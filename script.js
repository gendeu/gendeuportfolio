// SPA Navigation
const links = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    link.classList.add('active');
    const target = document.querySelector(link.getAttribute('href'));
    target.classList.add('active');
  });
});

// Typewriter effect
const roles = ["UI/UX Developer", "Frontend Engineer", "Creative Coder"];
let roleIndex = 0, charIndex = 0;
const typewriter = document.getElementById("typewriter");

function type() {
  if (charIndex < roles[roleIndex].length) {
    typewriter.textContent += roles[roleIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 2000);
  }
}
function erase() {
  if (charIndex > 0) {
    typewriter.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 50);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, 500);
  }
}
type();

// Case Studies
const caseStudies = {
  klp: {
    title: "KLP Lifestyle",
    problem: "E-commerce site lacked modern responsive UI.",
    process: "Redesigned in Figma, coded with HTML/CSS/JS.",
    solution: "Delivered a clean, mobile-friendly interface.",
    link: "https://klplifestyle.com/"
  },
  fixifoot: {
    title: "Fixifoot",
    problem: "Product showcase not engaging.",
    process: "Built interactive grids & responsive layout.",
    solution: "Improved UX and user interaction.",
    link: "https://fixifoot.ph/"
  },
  cveez: {
    title: "Cveez",
    problem: "Booking platform needed a sleek interface.",
    process: "Worked on flows, designed UI, coded frontend.",
    solution: "Launched fast, modern booking UX.",
    link: "https://cveez.com/"
  }
};

const modal = document.getElementById("case-study");
const modalTitle = document.getElementById("case-title");
const modalProblem = document.getElementById("case-problem");
const modalProcess = document.getElementById("case-process");
const modalSolution = document.getElementById("case-solution");
const modalLink = document.getElementById("case-link");

function openCaseStudy(key) {
  const data = caseStudies[key];
  modalTitle.textContent = data.title;
  modalProblem.textContent = "Problem: " + data.problem;
  modalProcess.textContent = "Process: " + data.process;
  modalSolution.textContent = "Solution: " + data.solution;
  modalLink.href = data.link;
  modal.style.display = "flex";
}

function closeCaseStudy() { modal.style.display = "none"; }

// Scroll Animations
const faders = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
});
faders.forEach(fade => observer.observe(fade));

// Dark/Light Mode
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});
