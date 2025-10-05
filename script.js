const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

/* === GD Loader: hide when window fully loads === */
window.addEventListener('load', () => {
  const loader = qs('#loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 600);
});

/* SPA Navigation */
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

/* Load CV.html dynamically */
async function loadCV() {
  const container = qs('#cv-container');
  try {
    const res = await fetch('CV.html');
    const html = await res.text();
    container.innerHTML = html;
  } catch {
    container.innerHTML = "<p>Unable to load CV at the moment.</p>";
  }
}

/* Theme Toggle */
function initThemeToggle() {
  const toggle = qs('#theme-toggle');
  const body = document.body;

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

/* Mobile Nav */
function initMobileMenu() {
  const toggle = qs('#menu-toggle');
  const menu = qs('nav ul');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('show'));
  qsa('nav ul li a').forEach(a =>
    a.addEventListener('click', () => menu.classList.remove('show'))
  );
}

/* Floating Navbar on Scroll */
function initFloatingNav() {
  const header = qs('.nav-glass');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('floating');
    else header.classList.remove('floating');
  });
}

/* Typewriter */
function initTypewriter() {
  const textEl = qs('#typewriter');
  if (!textEl) return;
  const roles = siteContent.hero.roles;
  let i = 0, j = 0, forward = true;
  setInterval(() => {
    const role = roles[i];
    textEl.textContent = forward ? role.slice(0, ++j) : role.slice(0, --j);
    if (j === role.length) forward = false;
    if (j === 0 && !forward) { forward = true; i = (i + 1) % roles.length; }
  }, 120);
}

/* Projects + Modal (centered + scroll lock) */
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
  if (!grid || !modal) return;

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

/* Skills Section */
function loadSkills() {
  const grid = qs('#skills-grid');
  if (!grid) return;
  const fallback = "https://via.placeholder.com/64?text=?";
  const skills = Array.isArray(siteContent.skills) ? siteContent.skills : [];
  skills.forEach(s => {
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `
      <img src="${s.img}" alt="${s.name}" onerror="this.src='${fallback}'">
      <span>${s.name}</span>
    `;
    grid.appendChild(card);
  });
}

/* Loader fallback */
window.addEventListener("load", hideLoaderSafely);
setTimeout(hideLoaderSafely, 3500);
function hideLoaderSafely() {
  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("hidden")) loader.classList.add("hidden");
}

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  initSPA();
  initMobileMenu();
  initThemeToggle();
  initTypewriter();
  loadProjects();
  loadSkills();
  initFloatingNav();
});
