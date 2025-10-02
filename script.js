
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// (Optional) Dark Mode Toggle
const toggle = document.createElement("button");
toggle.textContent = "🌙 Toggle Theme";
toggle.style.position = "fixed";
toggle.style.bottom = "20px";
toggle.style.right = "20px";
toggle.style.padding = "10px";
toggle.style.borderRadius = "12px";
toggle.style.cursor = "pointer";
document.body.appendChild(toggle);

let dark = false;
toggle.addEventListener("click", () => {
  if (!dark) {
    document.documentElement.style.setProperty("--bg", "#1e1e1e");
    document.documentElement.style.setProperty("--shadow-light", "#2c2c2c");
    document.documentElement.style.setProperty("--shadow-dark", "#0d0d0d");
    document.documentElement.style.setProperty("--text", "#f1f1f1");
    dark = true;
  } else {
    document.documentElement.style.setProperty("--bg", "#e0e5ec");
    document.documentElement.style.setProperty("--shadow-light", "#ffffff");
    document.documentElement.style.setProperty("--shadow-dark", "#a3b1c6");
    document.documentElement.style.setProperty("--text", "#333");
    dark = false;
  }
});
