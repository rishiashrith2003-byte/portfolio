"use strict";

/* ════════════════════════════════════════════
   1. FOOTER YEAR
════════════════════════════════════════════ */
const yearEl = document.getElementById("footerYear");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ════════════════════════════════════════════
   2. STICKY NAV — .scrolled after 80px
════════════════════════════════════════════ */
const nav = document.getElementById("nav");

function onNavScroll() {
  nav.classList.toggle("scrolled", window.scrollY > 80);
}

window.addEventListener("scroll", onNavScroll, { passive: true });
onNavScroll();

/* ════════════════════════════════════════════
   3. MOBILE BURGER MENU
════════════════════════════════════════════ */
const burger    = document.getElementById("navBurger");
const navLinks  = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  burger.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", String(open));
});

// Allow keyboard: Enter / Space
burger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    burger.click();
  }
});

// Close on link click
navLinks.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  });
});

/* ════════════════════════════════════════════
   4. ACTIVE NAV LINK (scroll-spy)
════════════════════════════════════════════ */
const sections    = document.querySelectorAll("section[id]");
const navAnchors  = document.querySelectorAll(".nav-links a");

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navAnchors.forEach(a => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach(s => spyObserver.observe(s));

/* ════════════════════════════════════════════
   5. SCROLL REVEAL (IntersectionObserver)
════════════════════════════════════════════ */
const revealEls = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, _i) => {
      if (!entry.isIntersecting) return;

      // Stagger siblings inside same parent
      const siblings = Array.from(entry.target.parentElement.children).filter(
        el => el.classList.contains("reveal")
      );
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 90}ms`;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ════════════════════════════════════════════
   6. HERO EYEBROW TYPING EFFECT
════════════════════════════════════════════ */
(function heroTyping() {
  const el     = document.getElementById("heroEyebrow");
  if (!el) return;

  const words  = ["Engineer.", "Strategist.", "Builder.", "Leader."];
  let   wi     = 0;       // word index
  let   ci     = 0;       // char index
  let   deleting = false;
  const PAUSE_FULL  = 2200;  // pause when word fully typed
  const PAUSE_EMPTY = 450;   // pause when cleared
  const TYPE_SPEED  = 80;
  const DEL_SPEED   = 45;

  function tick() {
    const word    = words[wi];
    const current = word.slice(0, ci);
    el.textContent = current + "|";

    if (!deleting && ci === word.length) {
      setTimeout(() => { deleting = true; tick(); }, PAUSE_FULL);
      return;
    }

    if (deleting && ci === 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
      setTimeout(tick, PAUSE_EMPTY);
      return;
    }

    ci += deleting ? -1 : 1;
    setTimeout(tick, deleting ? DEL_SPEED : TYPE_SPEED);
  }

  setTimeout(tick, 800);
})();

/* ════════════════════════════════════════════
   7. CONTACT FORM — validation + fake POST
════════════════════════════════════════════ */
(function contactForm() {
  const form       = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById("fname"),    err: document.getElementById("fnameErr") },
    email:   { el: document.getElementById("femail"),   err: document.getElementById("femailErr") },
    message: { el: document.getElementById("fmessage"), err: document.getElementById("fmessageErr") },
  };
  const successEl = document.getElementById("formSuccess");

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setErr(f, msg) {
    f.el.classList.add("field-err");
    f.err.textContent = msg;
  }

  function clearErr(f) {
    f.el.classList.remove("field-err");
    f.err.textContent = "";
  }

  function validate() {
    let ok = true;

    const name = fields.name.el.value.trim();
    if (!name || name.length < 2) {
      setErr(fields.name, "Please enter your name.");
      ok = false;
    } else { clearErr(fields.name); }

    const email = fields.email.el.value.trim();
    if (!email) {
      setErr(fields.email, "Email is required.");
      ok = false;
    } else if (!emailRx.test(email)) {
      setErr(fields.email, "Enter a valid email address.");
      ok = false;
    } else { clearErr(fields.email); }

    const msg = fields.message.el.value.trim();
    if (!msg || msg.length < 10) {
      setErr(fields.message, "Message should be at least 10 characters.");
      ok = false;
    } else { clearErr(fields.message); }

    return ok;
  }

  // Live re-validate on blur
  Object.values(fields).forEach(f => {
    f.el.addEventListener("blur", () => validate());
    f.el.addEventListener("input", () => {
      if (f.el.classList.contains("field-err")) validate();
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    successEl.textContent = "";

    if (!validate()) return;

    const btn = form.querySelector(".btn-submit");
    btn.disabled = true;
    btn.textContent = "Sending…";

    // Simulate /api/contact POST — replace with real fetch in Node.js context:
    // fetch("/api/contact", { method: "POST", headers: {"Content-Type":"application/json"},
    //   body: JSON.stringify({ name, email, message }) })
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Send Message →";
      form.reset();
      Object.values(fields).forEach(clearErr);
      successEl.textContent = "✓ Message received. I'll be in touch.";
      setTimeout(() => { successEl.textContent = ""; }, 5500);
    }, 1600);
  });
})();

/* ════════════════════════════════════════════
   8. SMOOTH ANCHOR SCROLL
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
