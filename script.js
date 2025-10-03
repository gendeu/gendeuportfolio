/* -------------------------
   DOM + Loader + SPA + UI Logic
------------------------- */
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));
const loaderEl = qs('#loader'); const dimEl = qs('#dim');

function showLoader(){ loaderEl.style.opacity='1'; dimEl.style.opacity='1'; document.body.style.pointerEvents='none'; }
function hideLoader(){ loaderEl.style.opacity='0'; dimEl.style.opacity='0'; document.body.style.pointerEvents='auto'; }

document.addEventListener('mousemove', e => {
  if(loaderEl.style.opacity==='1'){
    loaderEl.style.left=e.clientX+'px';
    loaderEl.style.top=e.clientY+'px';
    loaderEl.style.transform='translate(-50%,-50%)';
  }
});

/* -------------------------
   Inject Content from JSON
------------------------- */
function injectContent(){
  qs('#home h2').innerHTML = `${siteContent.hero.greeting} <span class="highlight">${siteContent.hero.name}</span>`;
  qs('#home .btn').textContent = siteContent.hero.cta;
  qs('#about h2').textContent = siteContent.about.title;
  qs('#about .card p').textContent = siteContent.about.text;
  const track = qs('#uix1-track'); if(track){ track.innerHTML=""; siteContent.caseStudies.forEach((c,i)=>{const card=document.createElement('article'); card.className='uix1-card'; if(i===0) card.dataset.active="true"; card.innerHTML=`<img class="uix1-bg" src="${c.bg}" alt="${c.title} background"><div class="uix1-content"><img class="uix1-thumb" src="${c.thumb}" alt="${c.title} thumb"><div><h3 class="uix1-title">${c.title}</h3><p class="uix1-desc">${c.desc}</p><button class="uix1-btn" type="button">Details</button></div></div>`; track.appendChild(card);}); }
  const grid=qs('#skillsGridView'); grid.innerHTML=""; siteContent.skills.forEach(p=>{const div=document.createElement('div'); div.className='card glass project'; div.dataset.key=p.key; div.innerHTML=`<h3>${p.title}</h3><p>${p.short}</p>`; grid.appendChild(div); });
  qs('#contact h2').textContent = siteContent.contact.title; qs('#contact a').textContent = siteContent.contact.email; qs('#contact a').href = `mailto:${siteContent.contact.email}`;
}

/* -------------------------
   SPA Navigation
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
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      pages.forEach(p => { if (p.classList.contains('active')) { p.style.opacity = '0'; p.style.transform = 'translateY(20px)'; setTimeout(() => p.classList.remove('active'), 300); } });
      showLoader();
      setTimeout(() => { target.classList.add('active'); target.style.opacity = '1'; target.style.transform = 'translateY(0)'; hideLoader(); }, 560);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectContent();
  initSPA();
  showLoader();
  setTimeout(hideLoader, 1200);
  setTimeout(() => { if (typeof window.initUix1 === 'function') window.initUix1(); }, 200);
});

/* -------------------------
   Typewriter Roles
------------------------- */
const typewriter = qs('#typewriter'); let roleIndex=0,charIndex=0;
(function type(){ if(!typewriter) return; if(charIndex<siteContent.hero.roles[roleIndex].length){ typewriter.textContent += siteContent.hero.roles[roleIndex].charAt(charIndex++); setTimeout(type,80);} else setTimeout(erase,1400); })();
function erase(){ if(charIndex>0){ typewriter.textContent = siteContent.hero.roles[roleIndex].substring(0,--charIndex); setTimeout(erase,32);} else { roleIndex=(roleIndex+1)%siteContent.hero.roles.length; setTimeout(type,380);} }

/* -------------------------
   Skills Carousel & Grid Modal (simplified)
------------------------- */
// ... (rest of your script.js logic including initSkillsCarousel, initGridModal, viewToggle, mobile nav, initUix1 slider etc. should be placed here; omitted for brevity)
