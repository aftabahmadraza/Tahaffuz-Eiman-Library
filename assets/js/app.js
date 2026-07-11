/* =====================================
Tahaffuz-E-Iman Library
Common JavaScript
Version : 2.1 (Optimized)
===================================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("Tahaffuz-E-Iman Loaded");
  initTheme();
  initCounters();
  initScrollTop();
});

/* =====================================
Theme Toggle
===================================== */
function initTheme() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "☀️";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    btn.textContent = isDark ? "☀️" : "🌙";
  });
}

/* =====================================
Animated Counter
===================================== */
function initCounters() {
  const counters = document.querySelectorAll(".stat-card h2");

  counters.forEach(counter => {
    const target = parseInt(counter.innerText.replace(/\D/g, ""));
    if (isNaN(target)) return;

    let current = 0;
    const step = Math.ceil(target / 100);

    function update() {
      current += step;
      if (current >= target) {
        counter.innerText = target.toLocaleString() + "+";
        return;
      }
      counter.innerText = current.toLocaleString() + "+";
      requestAnimationFrame(update);
    }

    update();
  });
}

/* =====================================
Scroll To Top
===================================== */
function initScrollTop() {
  const btn = document.getElementById("scroll-top-btn");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 300 ? "flex" : "none";
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
