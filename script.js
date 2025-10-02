/* ============================
   SPA Navigation + Progress
   ============================ */
const links = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const loaderEl = document.getElementById('loader');
const dimEl = document.getElementById('dim');
const progressBar = document.getElementById('progress-bar');

// Projects view elements
const btnCarousel = document.getElementById('btn-carousel');
const btnGrid = document.getElementById('btn-grid');
const carouselView = document.getElementById('carouselView');
const gridView = document.getElementById('gridView');
const carouselViewport = document.querySelector('.carousel-viewport');
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

// helper: set view mode and persist (default carousel)
function setProjectsView(mode) {
  if (mode === 'grid') {
    carouselView.classList.remove('active');
    gridView.classList.remove('hidden');
    btnCarousel.setAttribute('aria-pressed', 'false');
    btnGrid.setAttribute('aria-pressed', 'true');
    localStorage.setItem('projectsView', 'grid');
  } else {
    carouselView.classList.add('active');
    gridView.classList.add('hidden');
    btnCarousel.setAttribute('aria-pressed', 'true');
    btnGrid.setAttribute('aria-pressed', 'false');
    localStorage.setItem('projectsView', 'carousel');
  }
}

// init view from localStorage (default to carousel)
const savedView = localStorage.getItem('projectsView') || 'carousel';
setProjectsView(savedView);

// toggle buttons
if (btnCarousel) btnCarousel.addEventListener('click', () => setProjectsView('carousel'));
if (btnGrid) btnGrid.addEventListener('click', () => setProjectsView('grid'));

/* ============================
   CENTER-STAGE CAROUSEL (hidden scrollbar + drag)
   ============================ */
const carouselItems = carouselTrack ? Array.from(carouselTrack.querySelectorAll('.carousel-item')) : [];

if (carouselTrack && carouselItems.length) {

  // Helper: center a specific item in the track
  function centerItem(item, smooth = true) {
    const trackRect = carouselTrack.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const trackScrollLeft = carouselTrack.scrollLeft;
    const itemCenter = (itemRect.left - trackRect.left) + (itemRect.width / 2);
    const targetScroll = trackScrollLeft + itemCenter - (trackRect.width / 2);
    carouselTrack.scrollTo({ left: targetScroll, behavior: smooth ? 'smooth' : 'auto' });
  }

  // Find the item nearest to the center of the visible track
  function findCenteredItem() {
    const trackRect = carouselTrack.getBoundingClientRect();
    const trackCenterX = trackRect.left + trackRect.width / 2;
    let minDist = Infinity, closest = null;
    carouselItems.forEach(it => {
      const r = it.getBoundingClientRect();
      const itemCenter = r.left + r.width / 2;
      const dist = Math.abs(itemCenter - trackCenterX);
      if (dist < minDist) { minDist = dist; closest = it; }
    });
    return closest;
  }

  // Update classes: active + sibling
  function updateActiveClasses() {
    const active = findCenteredItem();
    if (!active) return;
    carouselItems.forEach(it => {
      it.classList.remove('active', 'sibling');
      it.setAttribute('aria-selected', 'false');
    });
    active.classList.add('active');
    active.setAttribute('aria-selected', 'true');
    const idx = carouselItems.indexOf(active);
    if (idx > 0) carouselItems[idx - 1].classList.add('sibling');
    if (idx < carouselItems.length - 1) carouselItems[idx + 1].classList.add('sibling');
  }

  // Throttle using requestAnimationFrame during scroll
  let ticking = false;
  carouselTrack.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveClasses();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial centering: ALWAYS choose the middle index by default
  window.addEventListener('load', () => {
    const middleIndex = Math.floor(carouselItems.length / 2);
    const startItem = carouselItems[middleIndex] || carouselItems[0];
    centerItem(startItem, false);
    setTimeout(updateActiveClasses, 40);
    // store chosen default if you want later persistence
    localStorage.setItem('carouselCenterIndex', middleIndex);
  });

  // Click on item centers it
  carouselItems.forEach((it, i) => {
    it.addEventListener('click', (e) => {
      e.preventDefault();
      centerItem(it, true);
      localStorage.setItem('carouselCenterIndex', i);
      setTimeout(updateActiveClasses, 180);
    });
  });

  // Prev / Next behavior: center prev/next item
  if (prevBtn) prevBtn.addEventListener('click', () => {
    const active = findCenteredItem(); if (!active) return;
    const idx = carouselItems.indexOf(active);
    const targetIndex = Math.max(0, idx - 1);
    const target = carouselItems[targetIndex];
    centerItem(target, true);
    localStorage.setItem('carouselCenterIndex', targetIndex);
    setTimeout(updateActiveClasses, 180);
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    const active = findCenteredItem(); if (!active) return;
    const idx = carouselItems.indexOf(active);
    const targetIndex = Math.min(carouselItems.length - 1, idx + 1);
    const target = carouselItems[targetIndex];
    centerItem(target, true);
    localStorage.setItem('carouselCenterIndex', targetIndex);
    setTimeout(updateActiveClasses, 180);
  });

  // Keyboard support when track focused
  carouselTrack.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { nextBtn && nextBtn.click(); }
    if (e.key === 'ArrowLeft') { prevBtn && prevBtn.click(); }
  });

  // Snap to nearest item when user stops scrolling (short debounce)
  let scrollEndTimer = null;
  carouselTrack.addEventListener('scroll', () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      const center = findCenteredItem();
      if (center) {
        centerItem(center, true);
        updateActiveClasses();
        // store current
        const idx = carouselItems.indexOf(center);
        localStorage.setItem('carouselCenterIndex', idx);
      }
    }, 80);
  }, { passive: true });

  // On resize re-center the middle (or last active)
  window.addEventListener('resize', () => {
    const active = findCenteredItem() || carouselItems[Math.floor(carouselItems.length/2)] || carouselItems[0];
    centerItem(active, false);
    setTimeout(updateActiveClasses, 60);
  });

  /* ============================
     Drag-to-scroll implementation (so scrollbar can be hidden)
     - uses pointer events (works for mouse & touch)
     ============================ */
  let isDown = false, startX = 0, startScroll = 0;
  // pointerdown
  carouselTrack.addEventListener('pointerdown', (e) => {
    isDown = true;
    carouselTrack.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startScroll = carouselTrack.scrollLeft;
    // small visual feedback
    carouselTrack.style.cursor = 'grabbing';
  });
  // pointermove
  carouselTrack.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const dx = e.clientX - startX;
    carouselTrack.scrollLeft = startScroll - dx;
  }, { passive: false });
  // pointerup / leave
  const endDrag = (e) => {
    if (!isDown) return;
    isDown = false;
    try { carouselTrack.releasePointerCapture(e && e.pointerId); } catch {}
    carouselTrack.style.cursor = 'grab';
    // snap to nearest item
    const center = findCenteredItem();
    if (center) centerItem(center, true);
  };
  carouselTrack.addEventListener('pointerup', endDrag);
  carouselTrack.addEventListener('pointercancel', endDrag);
  carouselTrack.addEventListener('pointerleave', endDrag);
  // set friendly cursor
  carouselTrack.style.cursor = 'grab';

}

/* ============================
   SPA Navigation (kept)
   ============================ */
document.addEventListener("DOMContentLoaded", () => {
  showLoader();
  setTimeout(() => hideLoader(), 2000);
});
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    showLoader();
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    pages.forEach(p => {
      if (p.classList.contains('active')) {
        p.style.opacity = "0"; p.style.transform = "translateY(20px)";
        setTimeout(() => p.classList.remove('active'), 400);
      }
    });
    setTimeout(() => {
      const targetPage = document.querySelector(targetId);
      targetPage.classList.add('active');
      targetPage.style.opacity = "1";
      targetPage.style.transform = "translateY(0)";
      hideLoader();
    }, 1000 + Math.random()*900);
  });
});

/* Mobile menu */
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector("nav ul");
if (menuToggle) menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));

/* ============================
   Typewriter
   ============================ */
const roles = ["UI/UX Developer", "Frontend Engineer", "Creative Coder"];
let roleIndex = 0, charIndex = 0;
const typewriter = document.getElementById("typewriter");
function type() {
  if (charIndex < roles[roleIndex].length) {
    typewriter.textContent += roles[roleIndex].charAt(charIndex++);
    setTimeout(type, 100);
  } else setTimeout(erase, 2000);
}
function erase() {
  if (charIndex > 0) {
    typewriter.textContent = roles[roleIndex].substring(0, --charIndex);
    setTimeout(erase, 50);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 500);
  }
}
type();

/* ============================
   Case studies modal (kept)
   ============================ */
const caseStudies = {
  klp:{title:"KLP Lifestyle",problem:"E-commerce lacked responsive UI.",process:"Figma redesign + frontend build.",solution:"Delivered clean, mobile UI.",link:"https://klplifestyle.com/"},
  fixifoot:{title:"Fixifoot",problem:"Showcase not engaging.",process:"Interactive grids + responsive design.",solution:"Better UX & conversions.",link:"https://fixifoot.ph/"},
  cveez:{title:"Cveez",problem:"Needed sleek booking UX.",process:"Designed flows + coded frontend.",solution:"Modern booking platform.",link:"https://cveez.com/"},
  other1:{title:"Other 1",problem:"Reusable UI components.",process:"Component library.",solution:"Faster builds.",link:"#"},
  other2:{title:"Other 2",problem:"Landing optimization.",process:"A/B test + frontend.",solution:"Higher conversions.",link:"#"}
};
const modal = document.getElementById("case-study");
const closeBtn = modal.querySelector(".close");
function openCaseStudy(key) {
  const d = caseStudies[key]; if (!d) return;
  document.getElementById("case-title").textContent = d.title;
  document.getElementById("case-problem").textContent = "Problem: " + d.problem;
  document.getElementById("case-process").textContent = "Process: " + d.process;
  document.getElementById("case-solution").textContent = "Solution: " + d.solution;
  document.getElementById("case-link").href = d.link;
  modal.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 20);
}
function closeCaseStudy() {
  modal.classList.remove('show');
  setTimeout(() => { modal.style.display = "none"; }, 300);
}
closeBtn.addEventListener("click", closeCaseStudy);
window.addEventListener("click", e => { if (e.target === modal) closeCaseStudy(); });
window.addEventListener("keydown", e => { if (e.key === "Escape") closeCaseStudy(); });

/* ============================
   Dark/Light toggle
   ============================ */
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

/* ============================
   Particle background
   ============================ */
const canvas = document.getElementById("bgCanvas"), ctx = canvas.getContext("2d");
function fitCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
fitCanvas();
let particles = [];
for (let i=0;i<100;i++){
  particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,radius:1+Math.random()*2,dx:(Math.random()-.5)*.7,dy:(Math.random()-.5)*.7,opacity:Math.random(),twinkleSpeed:Math.random()*.02+.005});
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    if (!document.body.classList.contains("light")){ p.opacity += p.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1); if(p.opacity>1)p.opacity=1;if(p.opacity<0.2)p.opacity=0.2; } else { p.opacity=0.3; }
    ctx.fillStyle=`rgba(255,255,255,${p.opacity})`; ctx.arc(p.x,p.y,p.radius,0,Math.PI*2); ctx.fill();
    p.x+=p.dx; p.y+=p.dy;
    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener("resize", () => { fitCanvas(); });

/* ============================
   Floating GD Loader (pointer-follow + dim)
   ============================ */
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let pos = { x: pointer.x, y: pointer.y };
let rafId = null;
const followEase = 0.16;
const loaderMargin = 40;

function onPointerMove(e) {
  const ev = (e.touches && e.touches[0]) ? e.touches[0] : e;
  pointer.x = ev.clientX;
  pointer.y = ev.clientY;
}
window.addEventListener('mousemove', onPointerMove, { passive: true });
window.addEventListener('touchmove', onPointerMove, { passive: true });

function animateLoader() {
  pos.x += (pointer.x - pos.x) * followEase;
  pos.y += (pointer.y - pos.y) * followEase;
  const vw = window.innerWidth, vh = window.innerHeight;
  const x = Math.min(Math.max(pos.x, loaderMargin), vw - loaderMargin);
  const y = Math.min(Math.max(pos.y, loaderMargin), vh - loaderMargin);
  loaderEl.style.left = `${x}px`;
  loaderEl.style.top = `${y}px`;
  rafId = requestAnimationFrame(animateLoader);
}

function showLoader() {
  if (!rafId) animateLoader();
  loaderEl.classList.add('show');
  loaderEl.style.opacity = '1';
  dimEl.style.opacity = '1';
}

function hideLoader() {
  loaderEl.style.opacity = '0';
  dimEl.style.opacity = '0';
  loaderEl.classList.remove('show');
  setTimeout(() => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }, 350);
}

let pointerTimer = null;
function ensureCenterOnIdle() {
  clearTimeout(pointerTimer);
  pointerTimer = setTimeout(() => {
    pointer.x = window.innerWidth / 2;
    pointer.y = window.innerHeight / 2;
  }, 2200);
}
window.addEventListener('mousemove', ensureCenterOnIdle, { passive: true });
window.addEventListener('touchmove', ensureCenterOnIdle, { passive: true });

window.showLoader = showLoader;
window.hideLoader = hideLoader;

/* Accessibility note:
   loader & dim use pointer-events: none so they don't intercept clicks.
   To make dim block interactions during long ops: dimEl.style.pointerEvents = 'auto'; */
