/* -------------------------
   DOM + Loader
   ------------------------- */
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));
const loaderEl = qs('#loader'); const dimEl = qs('#dim');

function showLoader(){ loaderEl.style.opacity='1'; dimEl.style.opacity='1'; document.body.style.pointerEvents='none'; }
function hideLoader(){ loaderEl.style.opacity='0'; dimEl.style.opacity='0'; document.body.style.pointerEvents='auto'; }

document.addEventListener('mousemove', e => {
  if(loaderEl.style.opacity==='1'){ loaderEl.style.left=e.clientX+'px'; loaderEl.style.top=e.clientY+'px'; loaderEl.style.transform='translate(-50%,-50%)'; }
});



/* -------------------------
   Inject Content from JSON
   ------------------------- */
function injectContent(){
  // Hero
  qs('#home h2').innerHTML = `${siteContent.hero.greeting} <span class="highlight">${siteContent.hero.name}</span>`;
  qs('#home .btn').textContent = siteContent.hero.cta;

  // About
  qs('#about h2').textContent = siteContent.about.title;
  qs('#about .card p').textContent = siteContent.about.text;

  // Case Studies
  const track = qs('#uix1-track'); track.innerHTML="";
  siteContent.caseStudies.forEach((c,i)=>{
    const card=document.createElement('article'); card.className='uix1-card'; if(i===0) card.dataset.active="true";
    card.innerHTML=`<img class="uix1-bg" src="${c.bg}" alt="${c.title} background">
      <div class="uix1-content">
        <img class="uix1-thumb" src="${c.thumb}" alt="${c.title} thumb">
        <div><h3 class="uix1-title">${c.title}</h3><p class="uix1-desc">${c.desc}</p>
        <button class="uix1-btn" type="button">Details</button></div></div>`;
    track.appendChild(card);
  });

  // Skills grid
  const grid=qs('#skillsGridView'); grid.innerHTML="";
  siteContent.skills.forEach(p=>{ const div=document.createElement('div'); div.className='card glass project'; div.dataset.key=p.key; div.innerHTML=`<h3>${p.title}</h3><p>${p.short}</p>`; grid.appendChild(div); });

  // Contact
  qs('#contact h2').textContent = siteContent.contact.title;
  qs('#contact a').textContent = siteContent.contact.email;
  qs('#contact a').href = `mailto:${siteContent.contact.email}`;
}


/* -------------------------
   SPA Navigation (One Page at a Time)
   ------------------------- */
function initSPA() {
  const links = qsa('.nav-link');
  const pages = qsa('.page');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;

      // Nav highlight
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Hide current
      pages.forEach(p => {
        if (p.classList.contains('active')) {
          p.style.opacity = '0';
          p.style.transform = 'translateY(20px)';
          setTimeout(() => p.classList.remove('active'), 300);
        }
      });

      // Show loader during transition
      showLoader();

      // Show new page
      setTimeout(() => {
        target.classList.add('active');
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        hideLoader();
      }, 560);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectContent();   // fill from JSON
  initSPA();         // activate navigation
  showLoader();
  setTimeout(hideLoader, 1200);
  
/* -------------------------
   Re-init Case Studies Slider (uix1)
   ------------------------- */
setTimeout(() => {
  if (typeof window.initUix1 === 'function') {
    window.initUix1();
  }
}, 200);

});


/* -------------------------
   Typewriter Roles
   ------------------------- */
const typewriter = qs('#typewriter'); let roleIndex=0,charIndex=0;
(function type(){ if(!typewriter) return; if(charIndex<siteContent.hero.roles[roleIndex].length){ typewriter.textContent += siteContent.hero.roles[roleIndex].charAt(charIndex++); setTimeout(type,80);} else setTimeout(erase,1400); })();
function erase(){ if(charIndex>0){ typewriter.textContent = siteContent.hero.roles[roleIndex].substring(0,--charIndex); setTimeout(erase,32);} else { roleIndex=(roleIndex+1)%siteContent.hero.roles.length; setTimeout(type,380);} }

/* -------------------------
   Skills Carousel & Grid Modal
   ------------------------- */
(function initSkillsCarousel(){
  const carousel=qs('#skillsCarousel'); const left=qs('#skills-arrow-left'); const right=qs('#skills-arrow-right'); const detail=qs('#skillsCarouselDetail'); const titleEl=qs('#skills-detail-title'); const shortEl=qs('#skills-detail-short');
  if(!carousel) return;
  function escapeHTML(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  siteContent.skills.forEach(p=>{const slide=document.createElement('div'); slide.className='card-slide'; slide.dataset.key=p.key; slide.innerHTML=`<img src="${p.img}" alt="${escapeHTML(p.title)}"><div class="meta">${escapeHTML(p.title)}</div>`; carousel.appendChild(slide);});
  const slides=Array.from(carousel.children); let activeIndex=Math.floor(slides.length/2); let scrollEndTimer=null;
  function findClosest(){const rect=carousel.getBoundingClientRect();const cx=rect.left+rect.width/2;let best=0,bd=Infinity;slides.forEach((s,i)=>{const r=s.getBoundingClientRect();const d=Math.abs((r.left+r.width/2)-cx);if(d<bd){bd=d;best=i;}});return best;}
  function setActive(i){slides.forEach(sl=>sl.classList.remove('active'));slides[i]?.classList.add('active');activeIndex=i;const p=siteContent.skills[i];if(p){titleEl.textContent=p.title;shortEl.textContent=p.short;detail.style.display='';}else detail.style.display='none';}
  function centerAt(i,smooth=true){i=Math.max(0,Math.min(i,slides.length-1));const s=slides[i];if(!s)return;const rect=carousel.getBoundingClientRect();const sr=s.getBoundingClientRect();const delta=(sr.left+sr.width/2)-(rect.left+rect.width/2);carousel.scrollBy({left:delta,behavior:smooth?'smooth':'auto'});setActive(i);}
  carousel.addEventListener('scroll',()=>{const c=findClosest();slides.forEach(s=>s.classList.remove('active'));slides[c]?.classList.add('active');const p=siteContent.skills[c];if(p){titleEl.textContent=p.title;shortEl.textContent=p.short;detail.style.display='';}clearTimeout(scrollEndTimer);scrollEndTimer=setTimeout(()=>{const idx=findClosest();activeIndex=idx;centerAt(idx,true);},120);},{passive:true});
  left&&left.addEventListener('click',()=>{centerAt(Math.max(0,findClosest()-1));}); right&&right.addEventListener('click',()=>{centerAt(Math.min(slides.length-1,findClosest()+1));});
  slides.forEach((s,i)=>{s.addEventListener('click',()=>{if(i!==findClosest())centerAt(i,true);});});
  setTimeout(()=>centerAt(Math.floor(slides.length/2),false),60);
})();

(function initGridModal(){
  const modal=qs('#case-study');const close=qs('#case-study .close');const modalThumb=qs('#modal-thumb');const modalTitle=qs('#modal-title');const modalRole=qs('#modal-role');const modalBody=qs('#modal-body');const modalLink=qs('#modal-link');
  function open(key){const p=siteContent.skills.find(x=>x.key===key);if(!p)return;modalThumb.src=p.img;modalTitle.textContent=p.title;modalRole.textContent=p.role;modalBody.innerHTML=p.details||'<p>'+p.short+'</p>';modalLink.href=p.live||'#';modal.style.display='flex';setTimeout(()=>modal.classList.add('show'),12);}
  function closeModal(){modal.classList.remove('show');setTimeout(()=>modal.style.display='none',180);}
  qsa('.project-grid .project').forEach(el=>{el.addEventListener('click',()=>open(el.dataset.key));});
  close&&close.addEventListener('click',closeModal);window.addEventListener('click',e=>{if(e.target===modal)closeModal();});window.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
})();

/* -------------------------
   View toggle & Mobile nav
   ------------------------- */
(function viewToggle(){const btnC=qs('#btn-skills-carousel');const btnG=qs('#btn-skills-grid');const carV=qs('#skillsCarouselView');const gridV=qs('#skillsGridView');function setView(m){if(m==='grid'){carV.style.display='none';gridV.style.display='grid';btnC.setAttribute('aria-pressed','false');btnG.setAttribute('aria-pressed','true');localStorage.setItem('skillsView','grid');}else{carV.style.display='';gridV.style.display='none';btnC.setAttribute('aria-pressed','true');btnG.setAttribute('aria-pressed','false');localStorage.setItem('skillsView','carousel');setTimeout(()=>window.centerSkillsCarousel&&window.centerSkillsCarousel(),60);}}const saved=localStorage.getItem('skillsView')||'carousel';setView(saved);btnC.addEventListener('click',()=>setView('carousel'));btnG.addEventListener('click',()=>setView('grid'));})();

const menuToggle=qs('#menu-toggle');const navUl=qs('nav ul');if(menuToggle&&navUl){menuToggle.addEventListener('click',()=>navUl.classList.toggle('show'));qsa('nav ul li a').forEach(a=>{a.addEventListener('click',()=>navUl.classList.remove('show'));});}



window.initUix1 = () => {
  const root = document.querySelector('.uix1-root');
  if (!root) return;

  /* ---------- Slider (unchanged) ---------- */
  const track = root.querySelector('#uix1-track');
  const wrap = track.parentElement;
  const cards = Array.from(track.querySelectorAll('.uix1-card'));
  const prev = root.querySelector('#uix1-prev');
  const next = root.querySelector('#uix1-next');
  const dotsBox = root.querySelector('#uix1-dots');

  const isMobile = () => matchMedia('(max-width:767px)').matches;

  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'uix1-dot';
    dot.setAttribute('role','button');
    dot.setAttribute('aria-label', `Go to slide ${i+1}`);
    dot.onclick = () => activate(i, true);
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  let current = 0;

  function center(i) {
    const card = cards[i];
    const axis = isMobile() ? 'top' : 'left';
    const size = isMobile() ? 'clientHeight' : 'clientWidth';
    const start = isMobile() ? card.offsetTop : card.offsetLeft;
    wrap.scrollTo({
      [axis]: start - (wrap[size] / 2 - card[size] / 2),
      behavior: 'smooth'
    });
  }

  function toggleUI(i) {
    cards.forEach((c,k) => { if (k===i) c.setAttribute('data-active','true'); else c.removeAttribute('data-active'); });
    dots.forEach((d,k) => d.classList.toggle('active', k===i));
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === cards.length - 1;
  }

  function activate(i, scroll) {
    if (i === current) return;
    current = i;
    toggleUI(i);
    if (scroll) center(i);
  }

  function go(step) {
    activate(Math.min(Math.max(current + step, 0), cards.length - 1), true);
  }

  if (prev) prev.onclick = () => go(-1);
  if (next) next.onclick = () => go(1);

  addEventListener('keydown', (e) => {
    if (['ArrowRight','ArrowDown'].includes(e.key)) go(1);
    if (['ArrowLeft','ArrowUp'].includes(e.key)) go(-1);
  }, { passive: true });

  cards.forEach((card,i) => {
    card.addEventListener('mouseenter', () => matchMedia('(hover:hover)').matches && activate(i,true));
    card.addEventListener('click', () => activate(i,true));
  });

  let sx=0, sy=0;
  track.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive:true });
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60) {
      go((isMobile() ? dy : dx) > 0 ? -1 : 1);
    }
  }, { passive:true });

  if (window.matchMedia('(max-width:767px)').matches) dotsBox.hidden = true;
  addEventListener('resize', () => center(current));
  toggleUI(0);
  requestAnimationFrame(() => center(0));

  /* ---------- Modal + zooming (matched open/close) ---------- */
  const modal = root.querySelector('#uix1-modal');
  const modalOverlay = modal.querySelector('[data-uix1-overlay]');
  const modalCloseBtn = modal.querySelector('[data-uix1-close]');
  const modalTitle = modal.querySelector('#uix1-modal-title');
  const modalImg = modal.querySelector('#uix1-modal-img');
  const modalDesc = modal.querySelector('#uix1-modal-desc');
  const dialog = modal.querySelector('.uix1-modal__dialog');

  let lastFocused = null;
  let openerElement = null;
  let isAnimating = false;

  function openModalFromCard(card, openerEl) {
    const titleEl = card.querySelector('.uix1-title');
    const descEl = card.querySelector('.uix1-desc');
    const thumb = card.querySelector('.uix1-thumb');
    const bg = card.querySelector('.uix1-bg');

    modalTitle.textContent = titleEl ? titleEl.textContent : '';
    modalDesc.textContent = descEl ? descEl.textContent : '';
    const imgSrc = (thumb && thumb.getAttribute('src')) || (bg && bg.getAttribute('src')) || '';
    modalImg.src = imgSrc;
    modalImg.alt = titleEl ? titleEl.textContent : 'Detail image';

    openerElement = openerEl || card;
    openModalWithZoom(openerElement);
  }

  function openModalWithZoom(opener) {
    if (isAnimating) return;
    isAnimating = true;
    lastFocused = document.activeElement;

    modal.setAttribute('uix1-open','true');
    modal.setAttribute('aria-hidden','false');

    const openerRect = opener.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();

    const dialogCenterX = dialogRect.left + dialogRect.width / 2;
    const dialogCenterY = dialogRect.top + dialogRect.height / 2;
    const openerCenterX = openerRect.left + openerRect.width / 2;
    const openerCenterY = openerRect.top + openerRect.height / 2;

    const dx = openerCenterX - dialogCenterX;
    const dy = openerCenterY - dialogCenterY;

    let scale = Math.min(openerRect.width / dialogRect.width, openerRect.height / dialogRect.height);
    if (scale > 1) scale = Math.min(scale, 1.2);
    if (!isFinite(scale) || scale < 0.06) scale = 0.06;

    dialog.style.transition = 'none';
    dialog.style.transformOrigin = 'center center';
    dialog.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    dialog.style.opacity = '0.01';

    dialog.getBoundingClientRect();

    requestAnimationFrame(() => {
      dialog.style.transition = 'transform 360ms cubic-bezier(.2,.9,.2,1), opacity 260ms ease';
      dialog.style.transform = 'translateY(0px) scale(1)';
      dialog.style.opacity = '1';
    });

    const onOpenEnd = (ev) => {
      if (ev && ev.target !== dialog) return;
      dialog.removeEventListener('transitionend', onOpenEnd);
      isAnimating = false;
      modalCloseBtn.focus();
      document.addEventListener('focus', focusTrap, true);
      document.addEventListener('keydown', onKeyDown);
    };
    dialog.addEventListener('transitionend', onOpenEnd);
  }

  function closeModalWithZoom() {
    if (isAnimating) return;
    isAnimating = true;
    document.removeEventListener('focus', focusTrap, true);
    document.removeEventListener('keydown', onKeyDown);

    const opener = openerElement || document.body;
    const openerRect = opener.getBoundingClientRect();
    const dialogRect = dialog.getBoundingClientRect();

    const dialogCenterX = dialogRect.left + dialogRect.width / 2;
    const dialogCenterY = dialogRect.top + dialogRect.height / 2;
    const openerCenterX = openerRect.left + openerRect.width / 2;
    const openerCenterY = openerRect.top + openerRect.height / 2;

    const dx = openerCenterX - dialogCenterX;
    const dy = openerCenterY - dialogCenterY;

    let scale = Math.min(openerRect.width / dialogRect.width, openerRect.height / dialogRect.height);
    if (scale > 1) scale = Math.min(scale, 1.2);
    if (!isFinite(scale) || scale < 0.06) scale = 0.06;

    dialog.style.transition = 'transform 300ms cubic-bezier(.2,.9,.2,1), opacity 220ms ease';
    dialog.style.transformOrigin = 'center center';
    dialog.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    dialog.style.opacity = '0.01';

    const onEnd = (ev) => {
      if (ev && ev.target !== dialog) return;
      dialog.removeEventListener('transitionend', onEnd);
      modal.setAttribute('uix1-open','false');
      modal.setAttribute('aria-hidden','true');
      isAnimating = false;
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      openerElement = null;
    };
    dialog.addEventListener('transitionend', onEnd);
  }

  function closeModal() { closeModalWithZoom(); }

  function onKeyDown(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
    else if (e.key === 'Tab') { maintainTabFocus(e); }
  }

  function focusTrap(e) { if (!modal.contains(e.target)) { e.stopPropagation(); modalCloseBtn.focus(); } }

  function maintainTabFocus(e) {
    const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
    const arr = Array.from(focusable).filter(el => el.offsetParent !== null);
    if (arr.length === 0) return;
    const first = arr[0], last = arr[arr.length -1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  const detailButtons = root.querySelectorAll('.uix1-btn');
  detailButtons.forEach((btn) => { btn.addEventListener('click', (e) => { const card = btn.closest('.uix1-card'); if (!card) return; openModalFromCard(card, btn); }); });

  modalOverlay.addEventListener('click', () => closeModal());
  modalCloseBtn.addEventListener('click', () => closeModal());
};
window.initUix1();

// const menuToggle=document.getElementById('menu-toggle');
// const navUl=document.querySelector('nav ul');
// menuToggle.addEventListener('click',()=>navUl.classList.toggle('show'));
// document.querySelectorAll('nav ul li a').forEach(a=>{
//   a.addEventListener('click',()=>navUl.classList.remove('show'));
// });
