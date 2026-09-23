// ===== Theme toggle (remembered) =====
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) {}
themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ===== Mobile menu =====
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ===== Nav background on scroll + active link =====
const nav = document.getElementById("nav");
const sections = document.querySelectorAll("main section[id]");
const links = navLinks.querySelectorAll("a");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  let current = "";
  sections.forEach((s) => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Typing effect =====
const roles = [
  "Software QA Engineer",
  "API Testing Specialist",
  "Performance Tester",
  "Automation Enthusiast",
  "Bug Hunter 🐞",
];
const typedEl = document.getElementById("typed");
let r = 0, c = roles[0].length, deleting = true;
function type() {
  const word = roles[r];
  typedEl.textContent = word.slice(0, c);
  if (deleting) {
    c--;
    if (c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; }
  } else {
    c++;
    if (c > roles[r].length) { deleting = true; setTimeout(type, 1800); return; }
  }
  setTimeout(type, deleting ? 45 : 85);
}
setTimeout(type, 2200);

// ===== Reveal on scroll + counters =====
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || "";
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      const num = entry.target.querySelector("[data-count]");
      if (num) animateCount(num);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Contact form: opens the visitor's mail app =====
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const subject = encodeURIComponent(`Portfolio contact from ${f.name.value}`);
  const body = encodeURIComponent(`${f.message.value}\n\n${f.name.value}\n${f.email.value}`);
  window.location.href = `mailto:pabok.datta.01@gmail.com?subject=${subject}&body=${body}`;
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
