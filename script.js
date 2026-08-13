/* ============================================================
   Nazreen Razmi — Portfolio
   Interactions: nav, scroll reveal, contact form
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    // Close the menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- Navbar shadow on scroll ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim() || "Website contact";
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "Please fill in your name, email, and message.";
        note.style.color = "#ff8a80";
        return;
      }

      const body =
        "Hi Nazreen,\n\n" +
        message +
        "\n\n— " +
        name +
        "\n" +
        email;

      const mailto =
        "mailto:nazreennasyuha@gmail.com" +
        "?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;

      note.textContent = "Opening your email app… thanks for reaching out!";
      note.style.color = "";
      form.reset();
    });
  }
})();
