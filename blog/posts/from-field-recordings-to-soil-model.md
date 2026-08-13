---
title: "From field recordings to a soil model: my microzonation FYP journey"
date: 2026-08-10
tags: [fyp, microzonation, hvsr, research]
---

For my final year project I worked on **seismic microzonation mapping** — the
process of dividing a region into zones that respond differently to
earthquake ground motion, based on local soil conditions. (The project
location is omitted here in compliance with a Non-Disclosure Agreement.)

This post is about the pipeline, the tools, and the things that went wrong
along the way.

## The method: ambient noise and HVSR

Instead of waiting for earthquakes, we used **ambient noise recordings** —
the ever-present microtremors of the ground. The **Horizontal-to-Vertical
Spectral Ratio (HVSR)** method compares horizontal to vertical ground motion
in the frequency domain.

Where the H/V curve peaks, there's usually a strong impedance contrast
below the site — the boundary between softer surface soils and stiffer
deeper material. The peak frequency and amplitude tell you about the depth
and stiffness of the layers.

## The toolchain

- **Geopsy** — the workhorse for HVSR processing
- **EasyHVSR** — fast, user-friendly HVSR computation
- **Dinver** — for inverting the H/V curve into a 1D soil model
- **hvsrpy** — Python library for programmatic analysis and comparison

Learning to troubleshoot these tools took longer than learning the theory.
Every one of them has quirks: file format expectations, window selection
parameters, smoothing settings. Getting consistent results across tools
became a mini-project in itself.

## Automating the grind

The repetitive part of the research was the sheer volume of recordings to
process and check. I wrote Python scripts to:

- batch-rename and organize field recordings
- run consistency checks across processing parameters
- generate reports and checklists from the results

That automation instinct — turning a one-by-one manual workflow into a
repeatable script — is what later grew into the
[HVSR Analyzer](https://github.com/NazreenNasyuha/HVSR_Analyzer) desktop app.

## Takeaways

1. **Field data is messy.** Processing real recordings means handling
   noise, instrument response, and the occasional bad file.
2. **Cross-validate everything.** If two tools disagree, find out why —
   usually it's a settings difference, not a bug.
3. **Automate early.** The time you spend writing the script is paid back
   tenfold the first time you re-run the whole dataset.

If you're starting a microzonation project, my advice: get your processing
pipeline scripted before you're knee-deep in recordings. Future you will
thank you.
