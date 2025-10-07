/* === Utility Shortcuts === */
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

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

    const card = document.querySelector('.hover-hide-about');

    function showCard() {
      card.style.display = "block";
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, 10); // small delay to trigger transition
    }

    function hideCard() {
      card.style.opacity = "0";
      card.style.transform = "translateY(10px)";
      setTimeout(() => {
        card.style.display = "none";
      }, 300); // matches transition duration
    }
/* === Load CV.html dynamically === */
async function loadCV() {
  const container = qs('#cv-container');
  if (!container) return;
  try {
    const res = await fetch('CV.html');
    const html = await res.text();
    container.innerHTML = html;
  } catch {
    container.innerHTML = "<p>Unable to load CV at the moment.</p>";
  }
}

/* === Theme Toggle === */
function initThemeToggle() {
  const toggle = qs('#theme-toggle');
  const body = document.body;
  if (!toggle) return;

  if (localStorage.getItem("theme") === "light") {
    body.classList.add("light");
    toggle.textContent = "☀️";
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("light");
    const isLight = body.classList.contains("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    toggle.textContent = isLight ? "☀️" : "🌙";
  });
}

/* === Mobile Nav === */
function initMobileMenu() {
  const toggle = qs('#menu-toggle');
  const menu = qs('nav ul');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => menu.classList.toggle('show'));
  qsa('nav ul li a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('show'))
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

/* === Projects + Modal (centered + scroll lock) === */
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

  const placeholder = "https://via.placeholder.com/720x420?text=Project+Preview";

  siteContent.caseStudies.forEach(p => {
    const slug = p.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    const imgSrc = `images/projects/${slug}.jpg`;

    const card = document.createElement('div');
    card.className = 'card glass project-card';
    card.innerHTML = `
      <img src="${imgSrc}" alt="${p.title}" onerror="this.src='${placeholder}'">
      <div class="info">
        <h3>${p.title}</h3>
        <p>${p.desc.substring(0,120)}...</p>
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

/* === Skills Section === */
function loadSkills() {
  const grid = qs('#skills-grid');
  if (!grid || !siteContent.skills) return;
  const fallback = "https://via.placeholder.com/64?text=?";
  siteContent.skills.forEach(s => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <img src="${s.img}" alt="${s.name}" onerror="this.src='${fallback}'">
      <span>${s.name}</span>
    `;
    grid.appendChild(card);
  });
}

/* === Render Roadmap (with graceful fallback) === */
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

  // Clear container first
  container.innerHTML = "";

  // Render each roadmap item
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

  // Animate appearance
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
        card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
      });
    });
  }

  initMagneticCards();

});
