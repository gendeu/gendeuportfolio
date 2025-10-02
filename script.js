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
const carouselTrack = document.querySelector('.carousel-track');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

// helper: set view mode and persist
function setProjectsView(mode) {
  if (mode === 'carousel') {
    carouselView.classList.add('active');
    gridView.classList.add('hidden');
    btnCarousel.setAttribute('aria-pressed', 'true');
    btnGrid.setAttribute('aria-pressed', 'false');
    localStorage.setItem('projectsView', 'carousel');
  } else {
    carouselView.classList.remove('active');
    gridView.classList.remove('hidden');
    btnCarousel.setAttribute('aria-pressed', 'false');
    btnGrid.setAttribute('aria-pressed', 'true');
    localStorage.setItem('projectsView', 'grid');
  }
}

// init view from localStorage (default to grid)
const savedView = localStorage.getItem('projectsView') || 'grid';
setProjectsView(savedView);

// toggle buttons
btnCarousel.addEventListener('click', () => setProjectsView('carousel'));
btnGrid.addEventListener('click', () => setProjectsView('grid'));

/* ============================
   Carousel controls (simple scroll)
   ============================ */
function scrollCarouselBy(amount) {
  if (!carouselTrack) return;
  carouselTrack.scrollBy({ left: amount, behavior: 'smooth' });
}
prevBtn.addEventListener('click', () => scrollCarouselBy(- (carouselTrack.clientWidth * 0.7) ));
nextBtn.addEventListener('click', () => scrollCarouselBy( (carouselTrack.clientWidth * 0.7) ));

// swipe / keyboard navigation for carousel
let isTouching = false;
carouselTrack.addEventListener('touchstart', () => { isTouching = true; });
carouselTrack.addEventListener('touchend', () => { isTouching = false; });
carouselTrack.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') scrollCarouselBy(260);
  if (e.key === 'ArrowLeft') scrollCarouselBy(-260);
});

/* ============================
   SPA Navigation (kept)
   ============================ */
// Show/hide loader functions defined later (floating loader section).
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
  cveez:{title:"Cveez",problem:"Needed sleek booking UX.",process:"Designed flows + coded frontend.",solution:"Modern booking platform.",link:"https://cveez.com/"}
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

/* Dark/Light toggle */
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
const followEase = 0.16; // smaller = slower
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

/* Accessibility note: loader & dim use pointer-events: none so they don't intercept clicks.
   To make dim block interactions during long ops: dimEl.style.pointerEvents = 'auto'; */
