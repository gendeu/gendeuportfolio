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
   CENTER-STAGE CAROUSEL (no scrollbar visible, swipe enabled)
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

  // Initial centering: center middle index by default (if no saved index)
  window.addEventListener('load', () => {
    const savedIndexRaw = localStorage.getItem('carouselCenterIndex');
    let startIndex;
    if (savedIndexRaw !== null) {
      const si = Number(savedIndexRaw);
      startIndex = (Number.isFinite(si) && si >= 0 && si < carouselItems.length) ? si : Math.floor(carouselItems.length / 2);
    } else {
      // default: middle card (center of list)
      startIndex = Math.floor(carouselItems.length / 2);
    }
    const startItem = carouselItems[startIndex] || carouselItems[0];
    centerItem(startItem, false);
    setTimeout(updateActiveClasses, 40);
    // store chosen default so next load keeps center if you want
    localStorage.setItem('carouselCenterIndex', startIndex);
  });

  // Click on item centers it
  carouselItems.forEach((it, i) => {
    it.addEv
