const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

/* === GD Loader: hide when window fully loads === */
window.addEventListener('load', () => {
  const loader = qs('#loader');
  if (loader) {
    // short delay so the loader is visible briefly even on very fast loads
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
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

/* Load CV.html dynamically (keeps original behavior) */
async function loadCV() {
  const container = qs('#cv-container');
  try {
    const res = await fetch('CV.html');
    const html = await res.text();
    container.innerHTML = html;
  } catch (e) {
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

/* Hamburger */
function initMobileMenu() {
  const toggle = qs('#menu-toggle');
  const menu = qs('nav ul');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => menu.classList.toggle('show'));
  qsa('nav ul li a').forEach(a => a.addEventListener('click', () => menu.classList.remove('show')));
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

/* Projects + Modal (thumbnails + fallback) */
function loadProjects() {
  const grid = qs('#projects-grid');
  const modal = qs('#project-modal');
  const modalTitle = qs('#modal-title');
  const modalDesc = qs('#modal-desc');
  const modalLink = qs('#modal-link');
  const modalImg = qs('#modal-img');
  const close = qs('.close');

  if (!grid || !modal) return;

  const placeholder = "https://via.placeholder.com/720x420?text=Project+Preview";

  siteContent.caseStudies.forEach(p => {
    // create safe slug: "FTAP (Frontier...)" -> "ftap-frontier-towers-associates-philippines"
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
      modalImg.onerror = () => modalImg.src = placeholder;
      // mark shown for accessibility
      modal.setAttribute('aria-hidden', 'false');
    });

    grid.appendChild(card);
  });

  // close handlers
  if (close) {
    close.addEventListener('click', () => {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
    });
  }
  modal.addEventListener('click', e => { if (e.target === modal) { modal.classList.remove('show'); modal.setAttribute('aria-hidden', 'true'); } });
}

/* Skills (use jsondata.js siteContent.skills and fallback on error) */
function loadSkills() {
  const grid = qs('#skills-grid');
  if (!grid) return;
  const fallback = "https://via.placeholder.com/64?text=?";

  // prefer siteContent.skills if available (more authoritative)
  const skills = Array.isArray(siteContent.skills) ? siteContent.skills : [
    { img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", name:"HTML5" },
    { img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", name:"CSS3" }
  ];

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

/* Initialize */
document.addEventListener('DOMContentLoaded', () => {
  initSPA();
  initMobileMenu();
  initThemeToggle();
  initTypewriter();
  loadCV();
  loadProjects();
  loadSkills();
});
// --- Safety timeout for loader in case window.load never fires ---
window.addEventListener("load", hideLoaderSafely);
setTimeout(hideLoaderSafely, 3500); // force hide after 3.5s

function hideLoaderSafely() {
  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("hidden")) {
    loader.classList.add("hidden");
  }
}


// === GD Loader Mouse Movement ===
const loaderLogo = document.getElementById("loader-logo");
if (loaderLogo) {
  document.addEventListener("mousemove", (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    loaderLogo.style.transform = `translate(${x}px, ${y}px)`;
  });
}
