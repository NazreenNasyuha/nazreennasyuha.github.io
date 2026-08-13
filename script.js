/* ============================================================
   Nazreen Razmi — Portfolio (Morning Collection)
   Interactions: rotator, nav, filters, modal, copy, form
   ============================================================ */

(function () {
  "use strict";

  /* ============ Theme toggle (Midnight default, Morning light) ============ */
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "nz-theme";

  function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* localStorage unavailable — fine */
    }
  }

  // Default is dark (Midnight Collection)
  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  } catch (e) {
    /* ignore */
  }
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const current = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(current);
    });
  }

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
  const projectTiles = document.querySelectorAll(".project-tile");

  if (filterBar && projectTiles.length) {
    filterBar.addEventListener("click", function (e) {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      filterBar.querySelectorAll(".filter-chip").forEach(function (c) {
        c.classList.toggle("active", c === chip);
      });

      const filter = chip.getAttribute("data-filter");
      projectTiles.forEach(function (tile) {
        const show = filter === "all" || tile.getAttribute("data-category") === filter;
        tile.classList.toggle("hidden", !show);
      });
    });
  }

  /* ============ Project modal ============ */
  const projects = {
    fyp: {
      icon: "🌍",
      title: "Final Year Project — Microzonation Mapping",
      desc: "Seismic microzonation research using ambient noise recordings to characterize local site effects. (Project location omitted in compliance with Non-Disclosure Agreement.)",
      points: [
        "Extracted Horizontal-to-Vertical Spectral Ratio (HVSR) data",
        "Processed & troubleshooted Geopsy, EasyHVSR, Dinver, and hvsrpy workflows",
        "Built Python tooling to automate repetitive analysis steps",
      ],
      tags: ["Python", "Geopsy", "HVSR", "Research"],
      links: [],
    },
    hvsr: {
      icon: "📊",
      title: "HVSR Analyzer — Desktop App",
      desc: "A friendly desktop app that turns microtremor recordings into ground-motion results — no Python to install, no packages to fiddle with. It just runs.",
      points: [
        "Computes H/V spectral ratio curves from many field file formats, with drag & drop",
        "Validates results against SESAME 2004 guidelines (plus SNI 1726-2019, USGS, Japan)",
        "Inverts curves into layered soil models — Vs, Vs30, and NEHRP/SNI soil class",
      ],
      tags: ["Python", "Zero third-party deps", "Desktop"],
      links: [
        { label: "GitHub", href: "https://github.com/NazreenNasyuha/HVSR_Analyzer" },
      ],
    },
    ultcalc: {
      icon: "🧮",
      title: "UltCalc — Scientific & Graphing Calculator",
      desc: "A feature-packed scientific calculator with a textbook-quality MathML expression display and a full graphing calculator — in a single-page web app with zero dependencies.",
      points: [
        "Scientific functions, MathML rendering, and graphing in vanilla JavaScript",
        "No build step, no frameworks — plain HTML + CSS + ES modules",
        "Runs anywhere: live link, single-file download, or from source",
      ],
      tags: ["HTML", "CSS", "JavaScript"],
      links: [
        { label: "Live demo", href: "https://nazreennasyuha.github.io/UtlCalculator/" },
        { label: "GitHub", href: "https://github.com/NazreenNasyuha/UtlCalculator" },
      ],
    },
    idp: {
      icon: "🏗️",
      title: "Integrated Design Project — Drainage & Earthwork",
      desc: "Full drainage system and earthwork design for site development, covering hydraulics, grading, and soil optimization.",
      points: [
        "Designed drainage system based on site conditions and rainfall considerations",
        "Planned earthwork including cut & fill calculations",
        "Ensured proper land leveling and optimized soil usage",
      ],
      tags: ["AutoCAD", "Hydrology", "Site Development"],
      links: [],
    },
  };

  const modalOverlay = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalIcon = document.getElementById("modalIcon");
  const modalDesc = document.getElementById("modalDesc");
  const modalPoints = document.getElementById("modalPoints");
  const modalTags = document.getElementById("modalTags");
  const modalLinks = document.getElementById("modalLinks");
  const modalClose = document.getElementById("modalClose");

  function openModal(key) {
    const p = projects[key];
    if (!p || !modalOverlay) return;

    modalTitle.textContent = p.title;
    modalIcon.textContent = p.icon;
    modalDesc.textContent = p.desc;

    modalPoints.innerHTML = "";
    p.points.forEach(function (point) {
      const li = document.createElement("li");
      li.textContent = point;
      modalPoints.appendChild(li);
    });

    modalTags.innerHTML = "";
    p.tags.forEach(function (tag) {
      const span = document.createElement("span");
      span.className = "chip";
      span.textContent = tag;
      modalTags.appendChild(span);
    });

    modalLinks.innerHTML = "";
    if (p.links.length) {
      p.links.forEach(function (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = link.label + " ↗";
        modalLinks.appendChild(a);
      });
    }

    modalOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  if (modalOverlay && modalClose) {
    projectTiles.forEach(function (tile) {
      tile.addEventListener("click", function () {
        openModal(tile.getAttribute("data-project"));
      });
    });

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ============ Seismic easter egg ============ */
  const seismicSection = document.getElementById("seismic-section");
  const gameToast = document.getElementById("gameToast");
  let seismicClicks = [];
  let toastTimer = null;

  function showGameToast(msg) {
    if (!gameToast) return;
    gameToast.textContent = msg;
    gameToast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      gameToast.classList.remove("show");
    }, 2600);
  }

  if (seismicSection) {
    seismicSection.addEventListener("click", function () {
      const now = Date.now();
      seismicClicks = seismicClicks.filter(function (t) { return now - t < 2500; });
      seismicClicks.push(now);
      if (seismicClicks.length >= 5) {
        seismicClicks = [];
        seismicSection.classList.remove("seismic-shake");
        // restart the animation
        void seismicSection.offsetWidth;
        seismicSection.classList.add("seismic-shake");
        showGameToast("\u{1F30A} Seismic activity detected!");
        setTimeout(function () {
          seismicSection.classList.remove("seismic-shake");
        }, 2200);
      }
    });
  }

  /* ============ Custom cursor + cloud trail ============ */
  const finePointer = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finePointer && !reducedMotion) {
    document.body.classList.add("custom-cursor");

    const cloud = document.createElement("div");
    cloud.className = "cursor-cloud";
    cloud.setAttribute("aria-hidden", "true");
    cloud.innerHTML =
      '<svg viewBox="0 0 30 22" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M8 18 h16 a4.5 4.5 0 0 0 0-9 a6.5 6.5 0 0 0-12.5-1.5 A4.8 4.8 0 0 0 8 18 Z" ' +
      'fill="currentColor" opacity="0.85"/></svg>';
    document.body.appendChild(cloud);

    let cx = -100, cy = -100;
    let targetX = -100, targetY = -100;

    function spawnTrail(x, y) {
      const dot = document.createElement("span");
      dot.className = "trail-dot";
      const size = 5 + Math.random() * 7;
      dot.style.width = size + "px";
      dot.style.height = size + "px";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      document.body.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 650);
    }

    document.addEventListener("mousemove", function (e) {
      targetX = e.clientX;
      targetY = e.clientY;
      // throttle trail spawns slightly
      if (Math.random() < 0.45) spawnTrail(targetX, targetY);
    });

    (function animateCursor() {
      cx += (targetX - cx) * 0.28;
      cy += (targetY - cy) * 0.28;
      cloud.style.transform = "translate(" + (cx - 15) + "px, " + (cy - 11) + "px)";
      requestAnimationFrame(animateCursor);
    })();

    document.addEventListener("mouseleave", function () {
      cloud.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      cloud.style.opacity = "0.92";
    });
  }

  /* ============ Minecraft block + achievement ============ */
  const mcBlock = document.getElementById("mcBlock");
  const achPopup = document.getElementById("achPopup");
  const MC_KEY = "nz-mc-clicks";
  let mcClicks = 0;
  try {
    mcClicks = parseInt(localStorage.getItem(MC_KEY) || "0", 10) || 0;
  } catch (e) { /* ignore */ }

  function showAchievement() {
    if (!achPopup) return;
    achPopup.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      achPopup.classList.remove("show");
    }, 3600);
  }

  function playClickSound() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
      setTimeout(function () { ctx.close(); }, 300);
    } catch (e) { /* audio blocked — fine */ }
  }

  if (mcBlock) {
    mcBlock.addEventListener("click", function () {
      mcClicks += 1;
      try { localStorage.setItem(MC_KEY, String(mcClicks)); } catch (e) { /* ignore */ }
      playClickSound();

      if (mcClicks >= 50) {
        showAchievement();
        mcClicks = 0;
        try { localStorage.setItem(MC_KEY, "0"); } catch (e) { /* ignore */ }
      }
    });
  }

  /* ============ Copy to clipboard ============ */
  const copyToast = document.getElementById("copyToast");

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {
      /* ignore */
    }
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  function showToast() {
    if (!copyToast) return;
    copyToast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      copyToast.classList.remove("show");
    }, 1600);
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const text = btn.getAttribute("data-copy") || "";
      copyText(text)
        .then(showToast)
        .catch(function () {
          /* clipboard blocked — do nothing */
        });
    });
  });

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
          .catch(function () {
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
