---
title: "Building HVSR Analyzer: a zero-dependency desktop app"
date: 2026-08-13
tags: [python, hvsr, desktop, automation]
---

My final year project taught me that the hardest part of seismic site
characterization isn't the theory — it's the tooling. Geopsy, EasyHVSR, and
Dinver are powerful, but getting a non-expert (or a fresh intern) from raw
microtremor recordings to a reliable H/V curve is a steep climb: install
Python, install packages, learn the CLI, fight version conflicts.

So I rebuilt the whole workflow as **HVSR Analyzer** — a desktop app that
"just runs."

## The idea

The goal was simple: drop your field recordings on the window, get your
H/V spectral ratio curve, a SESAME 2004 reliability check, and — optionally —
a 1D inversion into a layered soil model with Vs, Vs30, and soil class.

The constraint that made it interesting: **zero third-party packages**. No
numpy, no scipy, no obspy, no matplotlib. Everything on the Python standard
library.

## Why zero dependencies?

Three reasons:

1. **No setup for users.** No Python install, no `pip install`, no dependency
   hell. Download the installer, run it, done.
2. **Reproducibility.** The build is deterministic — the same code always
   produces the same app, on any machine.
3. **It's a great learning exercise.** When you can't lean on numpy, you
   actually understand the FFT, the windowing, and the smoothing you're
   implementing.

## What it does

- Reads many field file formats (including three-component files, `.eqd`/
  `.sg2`, 3-column files, and `.pz` response files)
- Drag & drop a folder to batch-process
- Checks reliability against **SESAME 2004** guidelines, plus Japan,
  Indonesia (SNI 1726-2019), USGS, and a generic checklist
- Inverts the H/V curve into a layered model — depth, Vs, Vs30, NEHRP/SNI
  soil class
- Ships with a dark theme for field use and a black & white "thesis" theme
  for printing

## Lessons learned

- The standard library is more capable than people give it credit for.
- A GUI doesn't need to be complicated — the whole app ships as a per-user
  installer with its own private Python runtime.
- Tools for engineers should hide complexity, not celebrate it.

If you're doing microtremor work and want to skip the setup dance, grab the
installer from the [releases page](https://github.com/NazreenNasyuha/HVSR_Analyzer/releases)
— or browse the source on [GitHub](https://github.com/NazreenNasyuha/HVSR_Analyzer).
