/* ============================================================
   Nazreen Razmi — Portfolio
   Interactions: theme, nav, rotator, filters, contact form
   ============================================================ */

(function () {
  "use strict";

  /* ============ Theme toggle ============ */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "nz-theme";

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* localStorage unavailable — fine */
    }
  }

  function initTheme() {
    let saved = "dark";
    try {
      saved = localStorage.getItem(THEME_KEY) || "dark";
    } catch (e) {
      /* ignore */
    }
    applyTheme(saved);
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(current);
    });
  }

  initTheme();

  /* ============ Rotating hero text ============ */
  const rotator = document.getElementById("rotator");
  if (rotator) {
    const phrases = [
      "Seismic Site Characterization",
      "Engineering Automation",
      "Microzonation Research",
      "Building Engineering Tools",
    ];
    let index = 0;
    let charIndex = 0;
    let deleting = false;
    const speed = 60;

    function type() {
      const current = phrases[index];
      if (!deleting) {
        rotator.textContent = current.slice(0, charIndex++);
        if (charIndex > current.length) {
          deleting = true;
          setTimeout(type, 1800);
          return;
        }
        setTimeout(type, speed);
      } else {
        rotator.textContent = current.slice(0, charIndex--);
        if (charIndex < 0) {
          deleting = false;
          index = (index + 1) % phrases.length;
          setTimeout(type, 300);
          return;
        }
        setTimeout(type, speed / 2);
      }
    }
    type();
  }

  /* ============ Footer year ============ */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ Mobile nav toggle ============ */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ============ Navbar shadow + back-to-top on scroll ============ */
  const nav = document.querySelector(".nav");
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 10);
    if (toTop) toTop.classList.toggle("visible", y > 480);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============ Scrollspy (active nav link) ============ */
  const spySections = document.querySelectorAll("section[id]");
  const spyLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if ("IntersectionObserver" in window && spySections.length && spyLinks.length) {
    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            spyLinks.forEach(function (link) {
              link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + entry.target.id
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    spySections.forEach(function (s) {
      spyObserver.observe(s);
    });
  }

  /* ============ Scroll reveal ============ */
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
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ============ Project filters ============ */
  const filterBar = document.getElementById("projectFilters");
  const projectCards = document.querySelectorAll(".project-card");

  if (filterBar && projectCards.length) {
    filterBar.addEventListener("click", function (e) {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      filterBar.querySelectorAll(".filter-chip").forEach(function (c) {
        c.classList.toggle("active", c === chip);
      });

      const filter = chip.getAttribute("data-filter");
      projectCards.forEach(function (card) {
        const show = filter === "all" || card.getAttribute("data-category") === filter;
        card.classList.toggle("hidden", !show);
      });
    });
  }

  /* ============ Contact form ============
     If a Web3Forms access key is configured below, submissions are
     posted to Web3Forms and delivered to your email. Otherwise it
     falls back to opening the visitor's email app (mailto:). */
  const WEB3FORMS_ACCESS_KEY = ""; // <-- put your key here, e.g. "abc12345-..."

  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim() || "Website contact";
      const message = form.message.value.trim();

      note.classList.remove("error");

      if (!name || !email || !message) {
        note.textContent = "Please fill in your name, email, and message.";
        note.classList.add("error");
        return;
      }

      if (WEB3FORMS_ACCESS_KEY) {
        const submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
        note.textContent = "";

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            subject: subject,
            message: message,
            from_name: name,
          }),
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
          })
          .then(function (data) {
            if (data.success) {
              note.textContent = "Thanks! Your message is on its way — I'll reply soon.";
              form.reset();
            } else {
              throw new Error(data.message || "Submission failed");
            }
          })
          .catch(function (err) {
            note.textContent = "Something went wrong. Please email me directly at nazreennasyuha@gmail.com";
            note.classList.add("error");
          })
          .finally(function () {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message";
          });
      } else {
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
        form.reset();
      }
    });
  }
})();
