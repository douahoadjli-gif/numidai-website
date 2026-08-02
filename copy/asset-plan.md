# NumidAI — Media Asset Plan

_Every image, 3D scene, illustration, mockup, icon, diagram, and promotional asset the site
needs. Nothing here is generated yet. Priority: **P0** = required for a first credible build,
**P1** = strongly wanted, **P2** = later/future phase._

---

## Conventions
- All renders: custom, MENA-informed, no stock, no baked-in text, no real logos.
- Aspect ratios: 16:9 for hero/video contexts; card crops as noted.
- Save raw high-res in `assets/images` (or `assets/3d`, `assets/videos`); web-optimized exports
  go to the website's `public/media` at build time.
- Naming: `section-subject-variant.ext` (e.g. `hero-building-dawn.png`).

---

## A. Photoreal architectural renders (`assets/images`)

**Delivered production assets** (externally generated with ChatGPT GPT Image, 16:9, locked as
final — do not regenerate):

| Status | File | Section | Notes |
|---|---|---|---|
| ✔ delivered | hero-sustainable-building.png | Hero | Flagship MENA low-rise, mashrabiya + PV + vertical planting, golden hour. **Master architectural reference for all other renders.** |
| ✔ delivered | hero-ai-analysis-reference.png | Hero secondary / Features | Same building with restrained AI-analysis overlays (blueprint grid, scan line, solar arcs, wind streamlines, glass analytics cards). |
| ✔ delivered | dashboard-preview.png | Platform Dashboard | Full dashboard with Sustainability Score 86/100, 4 stat tiles, 3 AI recommendations, Climate Analysis panel. Reuses the flagship building in the project hero thumbnail. |
| ✔ delivered | climate-simulation.png | Climate Intelligence | Isometric site + sun path, wind streamlines, shading & thermal-comfort heat map, passive-cooling detail panels. |
| ✔ delivered | carbon-analysis.png | Sustainability / Carbon | −62% baseline vs optimized, embodied vs operational split, LCA timeline, reduction plan. |
| ✔ delivered | energy-optimization.png | Energy | −55% EUI, cooling-load breakdown, renewable mix donut, annual performance curve, KPI row. |
| ✔ delivered | smart-city-vision.png | Industries / Resources | Aerial MENA smart-city district in the same architectural language, tram spine, integrated water feature. |

**Later phases (P1/P2) — still to plan and produce:**
- Photoreal industry-specific building renders (government/civic, real estate development close-up, university campus).
- Blueprint-state hero (start frame of blueprint-to-building reveal) if a scroll-scrubbed video is added.
- Before/after climate-adaptation stills of the same building.
- Passive-cooling / wind-tower macro detail.
- Team & collaboration visual.

## B. 3D scenes (`assets/3d`)

| ID | File | Section | Priority | Description |
|---|---|---|---|---|
| B1 | hero-blueprint-reveal.spline | Hero | P0 | Blueprint→building reveal + AI scan pass + settling analytics panels |
| B2 | climate-massing-heatmap.r3f | Climate Intelligence | P1 | Heat-mapped massing model, low→high legend, (future) time-of-day scrub |
| B3 | building-rotate-study.spline | Features / About | P2 | Slow rotating building study for a secondary section |

## C. Dashboard & UI mockups (`assets/images`, direction in `assets/references`)

| ID | File | Section | Priority | Description |
|---|---|---|---|---|
| C1 | dashboard-overview.png | Platform Dashboard | P0 | Full product overview matching reference mockup: score gauge, 4 stat tiles, AI recs, climate panel |
| C2 | dashboard-ai-analysis.png | Dashboard tabs | P1 | AI Analysis view (geometry, solar, wind, daylight, energy, carbon) |
| C3 | dashboard-climate-sim.png | Dashboard tabs | P1 | Climate simulation heat-mapped site plan |
| C4 | dashboard-carbon-analysis.png | Dashboard tabs | P1 | Embodied vs operational carbon, baseline-vs-optimized bars, tCO₂e |
| C5 | dashboard-mobile.png | Dashboard | P1 | Responsive/mobile dashboard state |
| — | dashboard-mockup-reference.png | (reference) | ✔ have | Supplied reference already in `assets/references` |

## D. Illustrations & diagrams (`assets/images`)

| ID | File | Section | Priority | Description |
|---|---|---|---|---|
| D1 | workflow-4step-diagram.svg | AI Workflow | P0 | Enter data → analysis → alternatives → export, blueprint-line style |
| D2 | carbon-analysis-illustration.svg | Sustainability / Carbon | P1 | Life-cycle carbon reduction (baseline vs optimized) |
| D3 | energy-optimization-graphic.svg | Features / Energy | P1 | Cooling-load / energy-use-intensity optimization diagram |
| D4 | engineering-workflow-iso.png | AI Workflow / About | P1 | Isometric analysis diagram (solar arcs, wind flow, daylight) over a building |
| D5 | passive-design-section.svg | Climate Intelligence | P1 | Building section with natural ventilation, shading, green roof, thermal mass callouts |

## E. Icons (`assets/icons`)

| ID | Set | Priority | Description |
|---|---|---|---|
| E1 | climate-icons | P0 | leaf, sun, wind, water, thermal wave, CO₂ — thin line, consistent stroke |
| E2 | feature-icons | P0 | dashboard, workflow, climate-intelligence, reports, analysis |
| E3 | industry-icons | P1 | architecture, real-estate, construction, government, university |
| E4 | ui-icons | P1 | nav, chevrons, play, language, chat, close — RTL-mirrored variants |

## F. Logos (`assets/logos`)

| ID | File | Priority | Status |
|---|---|---|---|
| F1 | numidai-wordmark.png | P0 | ✔ supplied (use as-is, do not regenerate) |
| F2 | numidai-emblem.jpeg | P0 | ✔ supplied (favicon/app icon/standalone) |
| F3 | logo-usage-spec.pdf | P1 | ✗ needed — clear space, min sizes, mono versions, misuse |
| F4 | numidai-favicon.ico / app-icons | P0 | ✗ needed — derive from emblem |
| F5 | partner-placeholder-marks.svg | P0 | ✗ needed — generic marks for Trusted Partners strip |

## G. Promotional / video (`assets/videos`)

**Delivered production asset** (externally supplied and approved — locked, do not replace unless
the user explicitly instructs a replacement):

| Status | File | Section | Notes |
|---|---|---|---|
| ✔ delivered | numidai-promo.mp4 → website/public/about-video.mp4 | About NumidAI | **Official launch film.** 1920×1080, 83s, H.264+AAC. Web re-encode: CRF 23, faststart, ~37 MB, audio preserved. Poster: `img/about-poster.jpg` (film end-frame). Click-to-play with sound, never autoplay. |
| ✔ delivered | hero-background.mp4 | Hero | **Official Hero Background Animation.** 1024×592, H.264, 24 fps, 15.04s, ~7 MB. Full-bleed hero background layer (object-fit: cover). Static poster fallback: `hero-sustainable-building.png`. |

**Later phases (P1/P2) — still to plan and produce:**
- Web-optimized / faststart re-encode for production if needed (currently the delivered file is
  playable as-is on the web).
- Optional all-keyframe variant if scroll-scrubbing is added later.
- Platform walkthrough video (`platform-walkthrough.mp4`) — future.

## H. Team & collaboration visuals (`assets/images`)

| ID | File | Section | Priority | Description |
|---|---|---|---|---|
| H1 | team-collaboration.png | About | P2 | Architects/engineers collaborating over a NumidAI screen — custom render, not stock, no real faces if avoidable |

---

## Missing information required before production
- Confirmed **real partner/client names & logos** (or confirmation to keep placeholders).
- Any **verified aggregate performance data** to replace illustrative figures (−62% etc.).
- Final **typeface licenses** (heading + Arabic families).
- A representative **real MENA project** to feature (or approval to use a fictional exemplar).
- Confirmed **pricing tiers** for the Pricing page.
- Real **testimonial quotes + attribution**, or approval to omit/placeholder.

---

## Generation batching (when approved)
1. P0 renders (A1, A2, A9) + hero 3D (B1)
2. P0 dashboard (C1) + workflow diagram (D1) + icon sets E1/E2 + partner placeholders (F5)
3. Hero video (G1→G2)
4. P1 renders, dashboard tabs, illustrations, remaining icons
5. P2 / future-phase assets
