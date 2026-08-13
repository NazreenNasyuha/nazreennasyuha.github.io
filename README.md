# Nazreen Razmi — Personal Website

A static single-page portfolio + blog, hosted on GitHub Pages at
**https://nazreennasyuha.github.io/**

No build tools, no frameworks, no server — plain HTML, CSS, and a little
vanilla JavaScript. It just works.

## Structure

```
my-website/
├── index.html          → homepage (hero, about, education, experience, skills, projects, achievements, contact)
├── style.css           → the whole dark theme
├── script.js           → nav toggle, scroll reveal, contact form
├── build-blog.js       → turns markdown posts into the blog pages (node build-blog.js)
├── assets/
│   └── profile.svg     → monogram avatar (shown until you add a real photo)
└── blog/
    ├── index.html      → blog listing (generated — don't edit by hand)
    └── posts/
        ├── *.md        → ✍️ write posts here in markdown
        └── *.html      → generated post pages (don't edit by hand)
```

## Adding your photo

Drop a photo at `assets/profile.jpg` (square works best). The homepage hero
picks it up automatically — until then it shows the `NR` monogram.

## Writing a blog post

1. Create a new file in `blog/posts/`, e.g. `blog/posts/my-new-post.md`.
2. Start it with this front matter:

```markdown
---
title: "My post title"
date: 2026-08-15
tags: [python, hvsr]
---
```

3. Write the rest in markdown (headings, lists, code blocks, links, quotes all supported).
4. Rebuild the blog:

```bash
node build-blog.js
```

5. Commit and push — GitHub Pages updates automatically.

## Editing the site

All content lives in `index.html`. Sections, skills, projects, achievements,
and contact details are plain HTML — find the section with the matching `id`
and edit away.

## Deployment

The site is deployed from the `main` branch of the
`nazreennasyuha.github.io` repository via GitHub Pages.

```bash
git add -A
git commit -m "Update site"
git push origin main
```

## Editing blog post pages

The blog pages are **generated** by `build-blog.js` from the `.md` files in
`blog/posts/`. Always edit the `.md`, then re-run `node build-blog.js`.
