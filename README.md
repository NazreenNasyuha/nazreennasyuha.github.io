# Nazreen Razmi — Personal Website

A static single-page portfolio + blog, hosted on GitHub Pages at
**https://nazreennasyuha.github.io/**

No build tools, no frameworks, no server — plain HTML, CSS, and a little
vanilla JavaScript. It just works.

## Structure

```
my-website/
├── index.html          → homepage (two-clipboard canvas, education, achievements, blog teaser, contact)
├── style.css           → the whole theme (Midnight dark default + Morning light)
├── script.js           → theme toggle, rotator, scrollspy, filters, modal, copy, contact form + easter eggs
├── build-blog.js       → turns markdown posts into the blog pages + homepage teaser (node build-blog.js)
├── assets/
│   ├── profile.svg     → monogram avatar (shown until you add a real photo)
│   └── textures/       → paper & wood photo textures (light + dark variants)
└── blog/
    ├── index.html      → blog listing (generated — don't edit by hand)
    └── posts/
        ├── *.md        → ✍️ write posts here in markdown
        └── *.html      → generated post pages (don't edit by hand)
```

## Themes — Midnight & Morning

The site defaults to the **Midnight Collection** (dark, cozy midnight blues)
and can switch to the **Morning Collection** (light, airy dusty blues) with
the 🌙/☀️ toggle in the navbar. The choice is remembered in `localStorage`,
and transitions are smooth (0.5s).

Both themes use real **photo textures** (`assets/textures/`) — walnut wood
grain for the clipboards and fiber paper for the sheets — with separate
light/dark variants.

## Interactive features

- **Theme toggle** — Midnight ↔ Morning, remembered across visits
- **Typing rotator** — the hero headline cycles through your focus areas
- **Scrollspy** — the navbar highlights the section you're viewing
- **Project filters** — Research / Software / Design chips
- **Project modals** — click a project tile for a full preview
- **Copy-to-clipboard** — ⧉ buttons on email & phone in the contact sheet
- **Back-to-top** button after scrolling

### Hidden easter eggs 🥚

1. **Seismic activity** — click the "Hi, I'm Nazreen" intro card **5 times
   quickly** and the whole section shakes like an earthquake, then shows a
   "Seismic activity detected!" toast. (A nod to your HVSR research.)
2. **Cloud cursor & trail** — on desktop, the cursor becomes a little cloud
   that leaves a fading trail of dots. (Disabled for touch devices and
   `prefers-reduced-motion`.)
3. **Master Engineer Block** — a Minecraft-style dirt block in the footer.
   Click it: it plays a click sound. Click it **50 times** and a Minecraft-
   style "Achievement unlocked: Master Engineer" popup appears.

## Contact form (Web3Forms)

The form currently falls back to opening the visitor's email app. To receive
submissions directly in your inbox:

1. Go to **https://web3forms.com/** and enter `nazreennasyuha@gmail.com`
   to get your **access key** (free, no account needed).
2. Open `script.js` and paste the key here:

```js
const WEB3FORMS_ACCESS_KEY = ""; // <-- paste your key here
```

## Adding your photo

Drop a photo at `assets/profile.jpg` (square works best). The polaroid in
the hero picks it up automatically — until then it shows the `NR` monogram.

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
