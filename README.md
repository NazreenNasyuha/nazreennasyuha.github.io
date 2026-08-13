# Nazreen Razmi — Personal Website

A static single-page portfolio + blog, hosted on GitHub Pages at
**https://nazreennasyuha.github.io/**

No build tools, no frameworks, no server — plain HTML, CSS, and a little
vanilla JavaScript. It just works.

## Structure

```
my-website/
├── index.html          → homepage (hero, about, education, experience, skills, projects, blog teaser, achievements, contact)
├── style.css           → the whole theme (dark default + light via the toggle)
├── script.js           → theme toggle, typing rotator, scrollspy, project filters, back-to-top, contact form
├── build-blog.js       → turns markdown posts into the blog pages + homepage teaser (node build-blog.js)
├── assets/
│   └── profile.svg     → monogram avatar (shown until you add a real photo)
└── blog/
    ├── index.html      → blog listing (generated — don't edit by hand)
    └── posts/
        ├── *.md        → ✍️ write posts here in markdown
        └── *.html      → generated post pages (don't edit by hand)
```

## Interactive features

- **Theme toggle** — dark/light, remembered in `localStorage` (🌙/☀️ in the navbar)
- **Typing rotator** — the hero headline cycles through your focus areas
- **Scrollspy** — the navbar highlights the section you're viewing
- **Project filters** — Research / Software / Design chips in the Projects section
- **Back-to-top** button appears after scrolling
- **Contact form** — posts to Web3Forms when a key is set (see below)

## Contact form (Web3Forms)

The form currently falls back to opening the visitor's email app. To receive
submissions directly in your inbox:

1. Go to **https://web3forms.com/** and enter `nazreennasyuha@gmail.com`
   to get your **access key** (free, no account needed).
2. Open `script.js` and paste the key here:

```js
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste your key here
```

That's it — submissions will now arrive in your email.

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
4. Rebuild the blog — this also refreshes the "Latest from the blog" teaser on the homepage:

```bash
node build-blog.js
```

5. Commit and push — GitHub Pages updates automatically.

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
The homepage blog teaser is also generated (between the `BLOG-TEASER-START`
and `BLOG-TEASER-END` comments in `index.html`) — don't edit it by hand.
