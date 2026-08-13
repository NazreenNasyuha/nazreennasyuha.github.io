#!/usr/bin/env node
/* ============================================================
   build-blog.js — turns blog/posts/*.md into static HTML pages
   Usage: node build-blog.js
   Posts: blog/posts/<slug>.md with YAML-ish front matter:
     ---
     title: "..."
     date: YYYY-MM-DD
     tags: [tag1, tag2]
     ---
   Output:
     - blog/index.html (listing)
     - blog/posts/<slug>.html (each post)
     - homepage teaser in index.html (between BLOG-TEASER markers)
   ============================================================ */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const POSTS_DIR = path.join(ROOT, "blog", "posts");
const BLOG_DIR = path.join(ROOT, "blog");
const INDEX_FILE = path.join(ROOT, "index.html");
const TEASER_COUNT = 3;

/* ---------------- Markdown helpers ---------------- */

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(text) {
  return text
    // inline code
    .replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`)
    // bold
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    // italic
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    // images ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    // links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function renderMarkdown(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let i = 0;
  let inList = null; // 'ul' | 'ol'
  let inCode = false;
  let codeBuf = [];
  let codeLang = "";
  let inQuote = false;
  let quoteBuf = [];

  function closeList() {
    if (inList) {
      html.push(`</${inList}>`);
      inList = null;
    }
  }

  function flushQuote() {
    if (inQuote) {
      html.push(`<blockquote>${quoteBuf.join("")}</blockquote>`);
      quoteBuf = [];
      inQuote = false;
    }
  }

  while (i < lines.length) {
    const line = lines[i];

    // fenced code blocks
    if (/^```/.test(line)) {
      if (!inCode) {
        closeList();
        flushQuote();
        inCode = true;
        codeLang = line.slice(3).trim();
        codeBuf = [];
      } else {
        const lang = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : "";
        html.push(`<pre${lang}><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
        inCode = false;
      }
      i++;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i++;
      continue;
    }

    // horizontal rule
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      closeList();
      flushQuote();
      html.push("<hr />");
      i++;
      continue;
    }

    // headings
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      flushQuote();
      const level = h[1].length;
      html.push(`<h${level}>${renderInline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      closeList();
      if (!inQuote) inQuote = true;
      quoteBuf.push(`<p>${renderInline(line.replace(/^>\s?/, ""))}</p>`);
      i++;
      continue;
    }
    if (inQuote) {
      flushQuote();
    }

    // unordered list
    const ul = /^\s*[-*]\s+(.*)$/.exec(line);
    if (ul) {
      if (inList !== "ul") {
        closeList();
        html.push("<ul>");
        inList = "ul";
      }
      html.push(`<li>${renderInline(ul[1])}</li>`);
      i++;
      continue;
    }

    // ordered list
    const ol = /^\s*\d+\.\s+(.*)$/.exec(line);
    if (ol) {
      if (inList !== "ol") {
        closeList();
        html.push("<ol>");
        inList = "ol";
      }
      html.push(`<li>${renderInline(ol[1])}</li>`);
      i++;
      continue;
    }

    closeList();

    // blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // paragraph (gather consecutive text lines)
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^```/.test(lines[i]) && !/^(#{1,6})\s/.test(lines[i]) && !/^\s*[-*]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i]) && !/^>\s?/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    html.push(`<p>${renderInline(para.join(" "))}</p>`);
  }

  closeList();
  if (inCode) {
    html.push(`<pre><code>${escapeHtml(codeBuf.join("\n"))}</code></pre>`);
  }
  flushQuote();

  return html.join("\n");
}

/* ---------------- Front matter parsing ---------------- */

function parsePost(file) {
  const raw = fs.readFileSync(file, "utf8");
  const fm = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  let meta = {};
  let body = raw;

  if (fm) {
    body = fm[2];
    const metaBlock = fm[1];
    const title = /^title:\s*["']?(.+?)["']?\s*$/m.exec(metaBlock);
    const date = /^date:\s*(\d{4}-\d{2}-\d{2})/m.exec(metaBlock);
    const tags = /^tags:\s*\[(.*?)\]/m.exec(metaBlock);
    meta.title = title ? title[1].trim() : path.basename(file, ".md");
    meta.date = date ? date[1] : "";
    meta.tags = tags
      ? tags[1].split(",").map((t) => t.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : [];
  } else {
    meta.title = path.basename(file, ".md");
    meta.date = "";
  }

  const slug = path.basename(file, ".md");
  return { slug, ...meta, body };
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/* ---------------- Page shell ---------------- */

function navHtml(prefix) {
  return `
      <a href="${prefix}index.html" class="logo" aria-label="PHOTO_ALBUM">
        <img src="${prefix}assets/PHOTO_ALBUM.webp" alt="PHOTO_ALBUM" class="logo-img" />
      </a>
      <nav class="nav-links" id="navLinks">
        <a href="${prefix}index.html#about">About</a>
        <a href="${prefix}index.html#education">Education</a>
        <a href="${prefix}index.html#experience">Experience</a>
        <a href="${prefix}index.html#skills">Skills</a>
        <a href="${prefix}index.html#projects">Projects</a>
        <a href="${prefix}blog/index.html">Blog</a>
        <a href="${prefix}index.html#achievements">Achievements</a>
        <a href="${prefix}index.html#contact" class="nav-cta">Contact</a>
      </nav>`;
}

function pageShell(prefix, title, body, opts = {}) {
  const desc = opts.desc || "Muhammad Nazreen Nasyuha bin Razmi — Civil Engineering graduate specializing in seismic site characterization and engineering automation.";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${desc}" />
  <title>${title} — Nazreen Razmi</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Caveat:wght@500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${prefix}style.css" />
</head>
<body data-theme="dark">
  <header class="nav">
    <div class="nav-inner container">
${navHtml(prefix)}
      <div class="nav-actions">
        <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark / light theme" title="Toggle theme">
          <span class="theme-icon theme-moon">🌙</span>
          <span class="theme-icon theme-sun">☀️</span>
        </button>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>
${body}
  <footer class="footer">
    <div class="container footer-inner">
      <p>© <span class="year-js">2026</span> Muhammad Nazreen Nasyuha bin Razmi. Built with ❤️ and a lot of Python.</p>
      <div class="footer-links">
        <a href="mailto:nazreennasyuha@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/nazreenrazmi/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/NazreenNasyuha" target="_blank" rel="noopener">GitHub</a>
        <a href="${prefix}blog/index.html">Blog</a>
        <a href="${prefix}index.html">Home</a>
      </div>
    </div>
  </footer>
  <button class="to-top" id="toTop" aria-label="Back to top">↑</button>
  <script>
    (function () {
      "use strict";
      /* theme toggle (Midnight default, Morning light) */
      var body = document.body;
      var tt = document.getElementById("themeToggle");
      var saved = "dark";
      try { saved = localStorage.getItem("nz-theme") || "dark"; } catch (e) {}
      body.setAttribute("data-theme", saved);
      if (tt) {
        tt.addEventListener("click", function () {
          var next = body.getAttribute("data-theme") === "light" ? "dark" : "light";
          body.setAttribute("data-theme", next);
          try { localStorage.setItem("nz-theme", next); } catch (e) {}
        });
      }
      /* nav toggle */
      var nt = document.getElementById("navToggle");
      var l = document.getElementById("navLinks");
      if (nt && l) {
        nt.addEventListener("click", function () {
          nt.classList.toggle("open");
          l.classList.toggle("open");
        });
        l.querySelectorAll("a").forEach(function (a) {
          a.addEventListener("click", function () {
            nt.classList.remove("open");
            l.classList.remove("open");
          });
        });
      }
      /* navbar shadow + back to top */
      var nav = document.querySelector(".nav");
      var top = document.getElementById("toTop");
      window.addEventListener("scroll", function () {
        var y = window.scrollY;
        if (nav) nav.classList.toggle("scrolled", y > 10);
        if (top) top.classList.toggle("visible", y > 480);
      }, { passive: true });
      if (top) {
        top.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
      }
      document.querySelectorAll(".year-js").forEach(function (el) {
        el.textContent = new Date().getFullYear();
      });
    })();
  </script>
</body>
</html>
`;
}

/* ---------------- Build ---------------- */

function main() {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error("No blog/posts directory found.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const posts = files.map((f) => parsePost(path.join(POSTS_DIR, f)));
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  if (posts.length === 0) {
    console.error("No markdown posts found in blog/posts/.");
    process.exit(1);
  }

  // ---- Individual post pages ----
  posts.forEach((post) => {
    const html = renderMarkdown(post.body);
    const dateStr = formatDate(post.date);
    const body = `
  <main class="blog-post-page">
    <div class="container">
      <header class="post-header">
        <span class="post-date">${dateStr}</span>
        <h1>${escapeHtml(post.title)}</h1>
        <p class="post-meta">
          ${post.tags.length ? "Tags: " + post.tags.join(", ") : "Notes from the field"}
        </p>
      </header>
      <article class="post-body">
${html}
      </article>
      <div class="post-footer-links">
        <a href="index.html">← Back to blog</a>
        <a href="../index.html">← Home</a>
      </div>
    </div>
  </main>`;
    fs.writeFileSync(path.join(POSTS_DIR, post.slug + ".html"), pageShell("../", post.title, body, {
      desc: `${post.title} — a post by Nazreen Razmi`,
    }));
    console.log(`  ✓ blog/posts/${post.slug}.html`);
  });

  // ---- Blog index ----
  const cards = posts
    .map((post) => {
      const dateStr = formatDate(post.date);
      const firstPara = /<p>([\s\S]*?)<\/p>/.exec(renderMarkdown(post.body));
      const excerpt = firstPara ? firstPara[1].replace(/<[^>]+>/g, "") : "";
      const tags = post.tags.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("\n          ");
      return `        <article class="blog-card">
          <span class="blog-date">${dateStr}</span>
          <h3><a href="posts/${post.slug}.html">${escapeHtml(post.title)}</a></h3>
          <p>${escapeHtml(excerpt)}</p>
          <div class="project-tags">${tags}</div>
          <a class="read-more" href="posts/${post.slug}.html">Read post →</a>
        </article>`;
    })
    .join("\n");

  const body = `
  <main class="section" style="padding-top: calc(var(--nav-h) + 56px);">
    <div class="container">
      <div class="section-head">
        <span class="section-tag">Blog</span>
        <h2 class="cursive big">Notes from the field</h2>
        <p class="section-sub">Writing about seismic site characterization, engineering automation, and the tools I build along the way.</p>
      </div>
      <div class="blog-grid">
${cards}
      </div>
    </div>
  </main>`;

  fs.writeFileSync(path.join(BLOG_DIR, "index.html"), pageShell("./", "Blog", body, {
    desc: "Blog — notes on seismic site characterization, engineering automation, and tools by Nazreen Razmi.",
  }));
  console.log("  ✓ blog/index.html");

  // ---- Homepage teaser ----
  const teaserCards = posts
    .slice(0, TEASER_COUNT)
    .map((post) => {
      const dateStr = formatDate(post.date);
      const firstPara = /<p>([\s\S]*?)<\/p>/.exec(renderMarkdown(post.body));
      const excerpt = firstPara ? firstPara[1].replace(/<[^>]+>/g, "") : "";
      const tags = post.tags.map((t) => `<span class="chip">${escapeHtml(t)}</span>`).join("\n            ");
      return `        <article class="blog-card reveal visible">
          <span class="blog-date">${dateStr}</span>
          <h3><a href="blog/posts/${post.slug}.html">${escapeHtml(post.title)}</a></h3>
          <p>${escapeHtml(excerpt)}</p>
          <div class="project-tags">${tags}</div>
          <a class="read-more" href="blog/posts/${post.slug}.html">Read post →</a>
        </article>`;
    })
    .join("\n");

  const teaserHtml = `<div class="blog-grid" id="blogTeaser">
${teaserCards}
      </div>`;

  if (fs.existsSync(INDEX_FILE)) {
    let index = fs.readFileSync(INDEX_FILE, "utf8");
    const startMarker = "<!-- BLOG-TEASER-START -->";
    const endMarker = "<!-- BLOG-TEASER-END -->";
    const startIdx = index.indexOf(startMarker);
    const endIdx = index.indexOf(endMarker);
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      const before = index.slice(0, startIdx + startMarker.length);
      const after = index.slice(endIdx);
      index = before + "\n" + teaserHtml + "\n" + after;
      fs.writeFileSync(INDEX_FILE, index);
      console.log(`  ✓ index.html teaser (${Math.min(posts.length, TEASER_COUNT)} latest post(s))`);
    } else {
      console.warn("  ! index.html BLOG-TEASER markers not found — teaser skipped.");
    }
  }

  console.log(`\nDone. Built ${posts.length} post(s).`);
}

main();
