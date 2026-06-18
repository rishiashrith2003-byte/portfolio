document.addEventListener("DOMContentLoaded", () => {
  const footerText = document.getElementById("footer-text");
  const year = new Date().getFullYear();
  footerText.textContent = `© ${year} Adapa Avinash. All rights reserved.`;

  const sections = document.querySelectorAll(".section, .hero-content");

  const revealSections = () => {
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      const triggerBottom = window.innerHeight * 0.85;

      if (sectionTop < triggerBottom) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }
    });
  };

  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.8s ease";
  });

  revealSections();
  window.addEventListener("scroll", revealSections);
});
