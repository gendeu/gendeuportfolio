// SPA Navigation
const links = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
links.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    links.forEach(l => l.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));
    link.classList.add('active');
    document.querySelector(link.getAttribute('href')).classList.add('active');
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
function openCaseStudy(key){
  const d=caseStudies[key];
  document.getElementById("case-title").textContent=d.title;
  document.getElementById("case-problem").textContent="Problem: "+d.problem;
  document.getElementById("case-process").textContent="Process: "+d.process;
  document.getElementById("case-solution").textContent="Solution: "+d.solution;
  document.getElementById("case-link").href=d.link;
  modal.style.display="flex";
}
function closeCaseStudy(){modal.style.display="none";}

// Particle Background
const canvas=document.getElementById("bgCanvas"),ctx=canvas.getContext("2d");
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
let particles=[];
for(let i=0;i<60;i++){
  particles.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,radius:2+Math.random()*2,dx:(Math.random()-.5)*1,dy:(Math.random()-.5)*1});
}
function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);
    ctx.fillStyle="rgba(255,255,255,0.5)";ctx.fill();
    p.x+=p.dx;p.y+=p.dy;
    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener("resize",()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
