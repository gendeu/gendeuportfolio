// SPA Navigation with smooth transitions + progress bar
const links = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const progressBar = document.getElementById('progress-bar');

links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');

    // progress bar animation
    progressBar.style.width = "0";
    setTimeout(() => progressBar.style.width = "100%", 50);

    // remove active classes
    links.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // fade out current
    pages.forEach(p => {
      if (p.classList.contains('active')) {
        p.style.opacity = "0";
        p.style.transform = "translateY(20px)";
        setTimeout(() => p.classList.remove('active'), 400);
      }
    });

    // fade in new page
    setTimeout(() => {
      const targetPage = document.querySelector(targetId);
      targetPage.classList.add('active');
      targetPage.style.opacity = "1";
      targetPage.style.transform = "translateY(0)";
      progressBar.style.width = "0"; // reset bar
    }, 500);
  });
});

// Mobile menu toggle
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector("nav ul");
menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));

// Typewriter
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

// Case Studies
const caseStudies = {
  klp:{title:"KLP Lifestyle",problem:"E-commerce lacked responsive UI.",process:"Figma redesign + frontend build.",solution:"Delivered clean, mobile UI.",link:"https://klplifestyle.com/"},
  fixifoot:{title:"Fixifoot",problem:"Showcase not engaging.",process:"Interactive grids + responsive design.",solution:"Better UX & conversions.",link:"https://fixifoot.ph/"},
  cveez:{title:"Cveez",problem:"Needed sleek booking UX.",process:"Designed flows + coded frontend.",solution:"Modern booking platform.",link:"https://cveez.com/"}
};

const modal = document.getElementById("case-study");
const closeBtn = modal.querySelector(".close");

function openCaseStudy(key){
  const d=caseStudies[key];
  if(!d) return;
  document.getElementById("case-title").textContent=d.title;
  document.getElementById("case-problem").textContent="Problem: "+d.problem;
  document.getElementById("case-process").textContent="Process: "+d.process;
  document.getElementById("case-solution").textContent="Solution: "+d.solution;
  document.getElementById("case-link").href=d.link;
  modal.classList.add("show");
  modal.style.display="flex";
}
function closeCaseStudy(){
  modal.classList.remove("show");
  setTimeout(()=> modal.style.display="none", 300);
}
closeBtn.addEventListener("click", closeCaseStudy);
window.addEventListener("click", e => { if(e.target === modal) closeCaseStudy(); });

// Dark/Light Mode Toggle
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
});

// Particle Background with Twinkles
const canvas=document.getElementById("bgCanvas"),ctx=canvas.getContext("2d");
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
let particles=[];
for(let i=0;i<100;i++){
  particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,radius:1+Math.random()*2,dx:(Math.random()-.5)*.7,dy:(Math.random()-.5)*.7,opacity:Math.random(),twinkleSpeed:Math.random()*0.02+0.005});
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    if (!document.body.classList.contains("light")) {
      p.opacity += p.twinkleSpeed * (Math.random() > 0.5 ? 1 : -1);
      if(p.opacity > 1) p.opacity = 1;
      if(p.opacity < 0.2) p.opacity = 0.2;
    } else {
      p.opacity = 0.3;
    }
    ctx.fillStyle=`rgba(255,255,255,${p.opacity})`;
    ctx.arc(p.x,p.y,p.radius,0,Math.PI*2); ctx.fill();
    p.x+=p.dx; p.y+=p.dy;
    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener("resize",()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
