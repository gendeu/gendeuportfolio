// SPA-like navigation
const links = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // remove active state
    links.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    // add active state
    link.classList.add('active');
    const target = document.querySelector(link.getAttribute('href'));
    target.classList.add('active');
  });
});
