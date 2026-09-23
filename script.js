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
const progress = document.getElementById("progress");
const fabTop = document.getElementById("fabTop");
function onScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 20);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  fabTop.classList.toggle("show", window.scrollY > 600);
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
  "Test Automation Engineer",
  "API Testing Specialist",
  "Performance Tester",
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

// ===== Tool logos =====
// Lowercase keys come from icons.js (Simple Icons); anything else gets a monogram badge.
function logo(key) {
  const d = window.ICONS && window.ICONS[key];
  if (d) return `<span class="logo-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg></span>`;
  const mono = key.replace(/[^A-Za-z]/g, "").slice(0, 2).toUpperCase();
  return `<span class="logo-mono">${mono}</span>`;
}
const LABELS = {
  apachejmeter: "JMeter", githubactions: "GitHub Actions", githubcopilot: "Copilot", webdriverio: "WebdriverIO",
  robotframework: "Robot Framework", junit5: "JUnit 5", saucelabs: "Sauce Labs", burpsuite: "Burp Suite",
  testrail: "TestRail", mysql: "MySQL", typescript: "TypeScript", javascript: "JavaScript", gitlab: "GitLab",
  github: "GitHub", k6: "k6", pytest: "Pytest",
};
const label = (k) => LABELS[k] || k.charAt(0).toUpperCase() + k.slice(1);

document.querySelectorAll(".tool-list[data-tools]").forEach((el) => {
  el.innerHTML = el.dataset.tools
    .split(",")
    .map((t) => {
      const [key, name] = t.split(":");
      return `<span class="tool">${logo(key)}${name}</span>`;
    })
    .join("");
});
document.querySelectorAll(".marquee-track[data-logos]").forEach((el) => {
  const items = el.dataset.logos.split(",").map((k) => `<span class="m-logo">${logo(k)}${label(k)}</span>`).join("");
  el.innerHTML = items + items; // duplicated for a seamless loop
});

// ===== Code tabs =====
document.querySelectorAll(".code-tabs button").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".code-tabs button").forEach((b) => b.classList.toggle("active", b === btn));
    document.querySelectorAll(".code[data-panel]").forEach((p) => p.classList.toggle("active", p.dataset.panel === btn.dataset.tab));
  });
});

// ===== Card spotlight follows the mouse =====
document.querySelectorAll(".t-card, .skill-card, .project-card, .edu-card, .auto-group, .stat").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
});
