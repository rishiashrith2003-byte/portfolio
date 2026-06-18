/* ─────────────────────────────────────────
   PORTFOLIO — script.js
───────────────────────────────────────── */

"use strict";

/* ── 1. Dynamic year in footer ── */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── 2. Sticky nav — add .scrolled class on scroll ── */
const nav = document.getElementById("nav");

function handleNavScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 60);
}

window.addEventListener("scroll", handleNavScroll, { passive: true });
handleNavScroll();

/* ── 3. Mobile nav toggle ── */
const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
});

// Close mobile nav on link click
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ── 4. Intersection Observer — scroll-reveal ── */
const revealTargets = [
  { selector: ".timeline-item", stagger: true, delayBase: 100 },
  { selector: ".hobby-card",    stagger: true, delayBase: 80  },
];

function buildObserver({ selector, stagger, delayBase }) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = stagger
          ? parseInt(el.dataset.index || el.dataset.year ? 0 : 0) * delayBase
          : 0;

        // stagger by DOM order
        const siblings = Array.from(el.parentElement.children).filter(
          c => c.classList.contains(el.classList[0])
        );
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${idx * delayBase}ms`;
        el.classList.add("visible");
        io.unobserve(el);
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach(el => io.observe(el));
}

revealTargets.forEach(buildObserver);

/* ── 5. Skill bar animation ── */
const proficiencySection = document.getElementById("proficiencyBars");

if (proficiencySection) {
  const bars = proficiencySection.querySelectorAll(".bar-fill");
  const pcts = proficiencySection.querySelectorAll(".bar-pct");
  let animated = false;

  const barObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting || animated) return;
      animated = true;

      bars.forEach((bar, i) => {
        const val = parseInt(bar.dataset.val, 10);
        // Animate the bar width
        bar.style.width = val + "%";

        // Animate the percentage counter
        const pct = pcts[i];
        let current = 0;
        const step = Math.ceil(val / 60);
        const interval = setInterval(() => {
          current = Math.min(current + step, val);
          pct.textContent = current + "%";
          if (current >= val) clearInterval(interval);
        }, 20);
      });
    },
    { threshold: 0.3 }
  );

  barObserver.observe(proficiencySection);
}

/* ── 6. Active nav link highlighting ── */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navItems.forEach(a => {
        a.classList.toggle(
          "active",
          a.getAttribute("href") === `#${id}`
        );
      });
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

/* inject active nav style */
const activeStyle = document.createElement("style");
activeStyle.textContent = `.nav-links a.active { color: var(--text) !important; }
.nav-links a.active::after { width: 100% !important; }`;
document.head.appendChild(activeStyle);

/* ── 7. Contact form validation & submission ── */
const form         = document.getElementById("contactForm");
const formSuccess  = document.getElementById("formSuccess");

const fields = {
  name:    { el: document.getElementById("name"),    err: document.getElementById("nameError") },
  email:   { el: document.getElementById("email"),   err: document.getElementById("emailError") },
  message: { el: document.getElementById("message"), err: document.getElementById("messageError") },
};

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function clearError(field) {
  field.el.classList.remove("error");
  field.err.textContent = "";
}

function setError(field, msg) {
  field.el.classList.add("error");
  field.err.textContent = msg;
}

function validateForm() {
  let valid = true;

  const nameVal = fields.name.el.value.trim();
  if (!nameVal) {
    setError(fields.name, "Name is required.");
    valid = false;
  } else if (nameVal.length < 2) {
    setError(fields.name, "Please enter at least 2 characters.");
    valid = false;
  } else {
    clearError(fields.name);
  }

  const emailVal = fields.email.el.value.trim();
  if (!emailVal) {
    setError(fields.email, "Email is required.");
    valid = false;
  } else if (!validateEmail(emailVal)) {
    setError(fields.email, "Please enter a valid email address.");
    valid = false;
  } else {
    clearError(fields.email);
  }

  const msgVal = fields.message.el.value.trim();
  if (!msgVal) {
    setError(fields.message, "Message cannot be empty.");
    valid = false;
  } else if (msgVal.length < 10) {
    setError(fields.message, "Message should be at least 10 characters.");
    valid = false;
  } else {
    clearError(fields.message);
  }

  return valid;
}

// Live validation on blur
Object.values(fields).forEach(field => {
  field.el.addEventListener("blur", validateForm);
  field.el.addEventListener("input", () => {
    if (field.el.classList.contains("error")) validateForm();
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formSuccess.textContent = "";

  if (!validateForm()) return;

  const btn = form.querySelector(".btn-submit");
  btn.disabled = true;
  btn.textContent = "Sending…";

  // Simulate async send (replace with real fetch/emailjs call)
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = "Send message →";
    form.reset();
    Object.values(fields).forEach(clearError);
    formSuccess.textContent = "✓ Message sent! I'll get back to you soon.";
    setTimeout(() => { formSuccess.textContent = ""; }, 5000);
  }, 1400);
});

/* ── 8. Smooth hero CTA scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
