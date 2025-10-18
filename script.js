/* === Utility Shortcuts === */
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));
let carouselSwiper = null;
const projectPlaceholder = "images/website-placeholder.jpg";

/* === GD Loader: hide when window fully loads === */
window.addEventListener('load', () => {
  const loader = qs('#loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
});

/* === SPA Navigation === */
function initSPA() {
  const links = qsa('.nav-link');
  const pages = qsa('.page');

  links.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      pages.forEach(p => p.classList.remove('active'));
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

/* === Theme Toggle DARK DEFAULT === */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const icon = document.querySelector('.theme-switch .icon');

  // Load saved theme
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    toggle.checked = true;
    icon.textContent = "☀️";
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      document.body.classList.add("light");
      icon.textContent = "☀️";
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      icon.textContent = "🌙";
      localStorage.setItem("theme", "dark");
    }
  });
}

// Make light theme the default
// function initThemeToggle() {
//   const toggle = qs('#theme-toggle');
//   const body = document.body;
//   if (!toggle) return;

//   // ✅ Default to light if no theme is saved
//   const savedTheme = localStorage.getItem("theme");
//   if (!savedTheme || savedTheme === "light") {
//     body.classList.add("light");
//     toggle.textContent = "☀️";
//     localStorage.setItem("theme", "light");
//   } else {
//     toggle.textContent = "🌙";
//   }

//   toggle.addEventListener("click", () => {
//     body.classList.toggle("light");
//     const isLight = body.classList.contains("light");
//     localStorage.setItem("theme", isLight ? "light" : "dark");
//     toggle.textContent = isLight ? "☀️" : "🌙";
//   });
// }

function initMobileMenu() {
  const toggle = qs('#menu-toggle');
  const menu = qs('nav ul');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('show');
    toggle.classList.toggle('open');
    toggle.textContent = toggle.classList.contains('open') ? '✖' : '☰';
  });

  qsa('nav ul li a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('show');
      toggle.classList.remove('open');
      toggle.textContent = '☰';
    })
  );
}

/* === Floating Navbar on Scroll === */
function initFloatingNav() {
  const header = qs('.nav-glass');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('floating');
    else header.classList.remove('floating');
  });
}

/* === Typewriter === */
function initTypewriter() {
  const textEl = qs('#typewriter');
  if (!textEl || !siteContent.hero) return;
  const roles = siteContent.hero.roles || [];
  let i = 0, j = 0, forward = true;
  setInterval(() => {
    const role = roles[i];
    textEl.textContent = forward ? role.slice(0, ++j) : role.slice(0, --j);
    if (j === role.length) forward = false;
    if (j === 0 && !forward) { forward = true; i = (i + 1) % roles.length; }
  }, 120);
}

/* === Projects + Modal === */
function loadProjects() {
  const grid = qs('#projects-grid');
  const modal = qs('#project-modal');
  const modalTitle = qs('#modal-title');
  const modalDesc = qs('#modal-desc');
  const modalLink = qs('#modal-link');
  const modalImg = qs('#modal-img');
  const close = qs('.close');
  const html = document.documentElement;
  const body = document.body;

  if (!grid || !modal || !siteContent.caseStudies) return;

  const placeholder = "images/website-placeholder.jpg";

  siteContent.caseStudies.forEach(p => {
    const slug = p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const imgSrc = p.img ? `images/projects/${p.img}` : projectPlaceholder;


    const card = document.createElement('div');
    card.className = 'card glass project-card';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.title}" onerror="this.src='${projectPlaceholder}'">
      <div class="overlay"></div>
      <div class="info">
        <h3>${p.title}</h3>
        <p>${p.desc.substring(0,100)}...</p>
      </div>
    `;

    card.addEventListener('click', () => {
      modal.classList.add('show');
      modalTitle.textContent = p.title;
      modalDesc.textContent = p.desc;
      modalLink.href = p.link || '#';
      modalImg.src = imgSrc;
      modalImg.onerror = () => (modalImg.src = placeholder);
      html.classList.add('modal-open');
      body.classList.add('modal-open');
    });

    grid.appendChild(card);
  });

  const closeModal = () => {
    modal.classList.remove('show');
    html.classList.remove('modal-open');
    body.classList.remove('modal-open');
  };

  if (close) close.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* === Grid / Carousel View Toggle === */
function initProjectViewToggle() {
  const gridWrapper = qs('#projects-grid');
  const carouselWrapper = qs('#projects-carousel');
  const gridBtn = qs('#gridViewBtn');
  const carouselBtn = qs('#carouselViewBtn');
  const carouselContainer = qs('#carousel-wrapper');

  if (!gridWrapper || !carouselWrapper) return;

  // Grid View handler
  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('active');
    carouselBtn.classList.remove('active');
    gridWrapper.style.display = ''; // revert to CSS (grid)
    carouselWrapper.style.display = 'none';

    if (carouselSwiper && carouselSwiper.destroy) {
      carouselSwiper.destroy(true, true);
      carouselSwiper = null;
    }
  });

  // Carousel View handler
  carouselBtn.addEventListener('click', () => {
    gridBtn.classList.remove('active');
    carouselBtn.classList.add('active');
    gridWrapper.style.display = 'none';
    carouselWrapper.style.display = 'block';
    initCarousel();
  });

  // Default -> trigger carousel on load
  carouselBtn.click();

  function initCarousel() {
    // ensure Swiper is available
    if (typeof Swiper === 'undefined') {
      console.error('Swiper is not loaded yet. Ensure Swiper JS is included before script.js.');
      return;
    }

    // Populate slides only once
    if (carouselContainer.children.length === 0 && Array.isArray(siteContent.caseStudies)) {
      // dynamic image fix — carousel + modal sync
      siteContent.caseStudies.forEach(p => {
        const slug = p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        const imgSrc = p.img ? `images/projects/${p.img}` : projectPlaceholder;

        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <img src="${imgSrc}" alt="${p.title}" onerror="this.src='${projectPlaceholder}'">
          <div class="overlay" data-title="${p.title}" data-img="${imgSrc}">
            <ion-icon name="open-outline"></ion-icon>
          </div>
        `;
        carouselContainer.appendChild(slide);
      });


      // dynamic image fix — sync modal image with carousel
      qsa('.swiper-slide .overlay').forEach(ov => {
        ov.addEventListener('click', () => {
          const title = ov.getAttribute('data-title');
          const imgSrc = ov.getAttribute('data-img');
          openProjectModal(title, imgSrc);
        });
      });

    }

    // Destroy any existing instance before creating a new one
    if (carouselSwiper && carouselSwiper.destroy) {
      carouselSwiper.destroy(true, true);
      carouselSwiper = null;
    }

    // create Swiper
  carouselSwiper = new Swiper('.swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 5, // show 5 on desktop
    loop: true,
    spaceBetween: 50,
    coverflowEffect: {
      rotate: 15,
      stretch: 0,
      depth: 180,
      modifier: 1,
      slideShadows: false,
    },
    autoplay: {
      delay: 2800,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: { slidesPerView: 1.6, spaceBetween: 20 },
      480: { slidesPerView: 2.2, spaceBetween: 30 },
      768: { slidesPerView: 3, spaceBetween: 40 },
      1024: { slidesPerView: 4, spaceBetween: 45 },
      1280: { slidesPerView: 5, spaceBetween: 50 },
    },
    on: {
      setTranslate(swiper, translate) {
        swiper.slides.forEach(slide => {
          const offset = slide.progress;
          const scale = 1 - Math.min(Math.abs(offset * 0.2), 0.3);
          const zIndex = 10 - Math.abs(offset);
          slide.style.transform = `scale(${scale}) rotateY(${offset * 20}deg)`;
          slide.style.zIndex = zIndex;
        });
      },
      setTransition(swiper, transition) {
        swiper.slides.forEach(slide => {
          slide.style.transition = `${transition}ms`;
        });
      },
    },
  });



  }
}


// Helper to open modal from carousel
function openProjectModal(title, customImg = null) {
  const project = siteContent.caseStudies.find(p => p.title === title);
  if (!project) return;
  const modal = qs('#project-modal');
  qs('#modal-title').textContent = project.title;
  qs('#modal-desc').textContent = project.desc;
  qs('#modal-link').href = project.link || '#';
  const img = qs('#modal-img');
  // dynamic image fix
  const imgSrc = project.img ? `images/projects/${project.img}` : projectPlaceholder;
  img.src = imgSrc;
  img.onerror = () => (img.src = projectPlaceholder);
  modal.classList.add('show');
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');
}


/* === Skills Section === */
function loadSkills() {
  const grid = qs('#skills-grid');
  if (!grid || !siteContent.skills) return;
  grid.innerHTML = "";

  siteContent.skills.forEach(group => {
    const section = document.createElement('div');
    section.className = 'skills-category';

    const title = document.createElement('h3');
    title.textContent = group.category;
    title.className = 'skills-category-title';
    section.appendChild(title);

    const container = document.createElement('div');
    container.className = 'skills-subgrid';

    group.items.forEach(s => {
      const card = document.createElement('div');
      card.className = 'skill-card';
      card.innerHTML = `
        <img src="${s.img}" alt="${s.name}" onerror="this.src='images/website-placeholder.jpg'">
        <span>${s.name}</span>
      `;
      container.appendChild(card);
    });

    section.appendChild(container);
    grid.appendChild(section);
  });
}


/* === Render Roadmap === */
function renderRoadmap() {
  const container = document.getElementById("roadmap-timeline");
  if (!container) return;

  if (!window.siteContent || !Array.isArray(siteContent.roadmap)) {
    container.innerHTML = `<p style="text-align:center;opacity:0.7;margin-top:2rem">
      ⚠️ Roadmap data not available.
    </p>`;
    console.warn("⚠️ siteContent.roadmap missing or invalid");
    return;
  }

  container.innerHTML = "";

  siteContent.roadmap.forEach((item, idx) => {
    const side = idx % 2 === 0 ? "left" : "right";
    const block = document.createElement("div");
    block.className = `timeline-block ${side} fade-up`;
    block.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content glass">
        <span class="timeline-year">${item.year}</span>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-desc">${item.desc}</p>
      </div>
    `;
    container.appendChild(block);
  });

  const items = container.querySelectorAll(".timeline-block");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(i => observer.observe(i));
}

/* === Magnetic Hover Effect === */
function initMagneticCards() {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * 8;
      const rotateY = ((x - cx) / cx) * -8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    });
  });
}

/* === Loader Fallback === */
window.addEventListener("load", hideLoaderSafely);
setTimeout(hideLoaderSafely, 3500);
function hideLoaderSafely() {
  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("hidden")) loader.classList.add("hidden");
}

/* === Initialize === */
document.addEventListener('DOMContentLoaded', () => {
  initSPA();
  initMobileMenu();
  initThemeToggle();
  initTypewriter();
  loadProjects();
  loadSkills();
  initFloatingNav();
  renderRoadmap();
  initProjectViewToggle();
  initMagneticCards();
});

/* === NETWORK MESH BACKGROUND ===
   Smoothly animated connected particles, light/dark mode adaptive
   Auto-reduces particle count on smaller screens
*/
(function() {
  const MeshBG = {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    particles: [],
    numParticles: 90,
    maxDistance: 180,
    speed: 0.4,
    raf: null,
    colors: {},

    init() {
      this.canvas = document.getElementById('dna-canvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.updateSize();
      window.addEventListener('resize', () => this.updateSize());
      const obs = new MutationObserver(() => this.updateColors());
      obs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      this.updateColors();
      this.createParticles();
      this.animate();
    },

    updateSize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 🔹 Adjust particle count based on screen size
      if (this.width <= 480) this.numParticles = 35;      // phones
      else if (this.width <= 768) this.numParticles = 55; // tablets
      else this.numParticles = 90;                        // desktops

      this.createParticles();
    },

    updateColors() {
      const cs = getComputedStyle(document.body);
      const accent = cs.getPropertyValue('--accent').trim() || '#00baff';
      const text = cs.getPropertyValue('--text').trim() || '#ffffff';
      const isLight = document.body.classList.contains('light');
      this.colors = {
        dot: isLight ? this.addAlpha(accent, 0.7) : this.addAlpha(accent, 0.9),
        line: isLight ? this.addAlpha(accent, 0.2) : this.addAlpha(accent, 0.3),
        bg: isLight ? '#ffffff' : '#000000'
      };
    },

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.numParticles; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * this.speed,
          vy: (Math.random() - 0.5) * this.speed
        });
      }
    },

    animate() {
      this.raf = requestAnimationFrame(() => this.animate());
      this.draw();
    },

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      // Draw particles
      for (let p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;

        // bounce from edges
        if (p.x < 0 || p.x > this.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.colors.dot;
        ctx.fill();
      }

      // Draw connections
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const a = this.particles[i];
          const b = this.particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.maxDistance) {
            const alpha = 1 - dist / this.maxDistance;
            ctx.strokeStyle = this.addAlpha(this.colors.line, alpha * 0.8);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    },

    addAlpha(color, alpha) {
      if (color.startsWith('#')) {
        const c = color.substring(1);
        const bigint = parseInt(c, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return color;
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => MeshBG.init(), 100);
  });

  window.MeshBG = MeshBG;
})();

/* === Scroll To Top Button === */
function initScrollTop() {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 200 ? "block" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initScrollTop();
});

