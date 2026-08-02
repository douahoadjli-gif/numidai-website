# NumidAI — Website (Vite + React + GSAP + Lenis)

Single-page cinematic landing page for NumidAI. Fixed full-screen background video scrubbed by
scroll progress, GSAP ScrollTrigger animations, Lenis smooth scrolling, full EN/AR (LTR/RTL)
switcher, and the NumidAI design system as CSS variables.

## Structure

```
website/
├─ index.html                 entry (Google Fonts + #root)
├─ package.json               react, react-dom, gsap, lenis · vite
├─ vite.config.js
├─ public/
│  ├─ bg.mp4                  all-keyframe H.264 scroll video (from scripts/swap-bg-video.sh)
│  ├─ img/                    production image assets
│  └─ preview/                ⚠ sandbox-verification bundle — DELETE before deploying
├─ preview-shims/             ⚠ sandbox-only gsap/lenis stand-ins — not used by Vite
└─ src/
   ├─ main.jsx                React root
   ├─ App.jsx                 all sections (home → footer) + language switcher
   ├─ motion.js               Lenis + ScrollTrigger + scroll→video.currentTime scrub
   ├─ styles.css              full design system (tokens, layout, RTL, responsive)
   └─ data/content.js         EN + AR copy in parity
```

## Run locally

```bash
cd website
npm install        # installs react, react-dom, gsap, lenis, vite
npm run dev        # http://localhost:5173
```

Vite's dev server supports HTTP Range requests, which video scrubbing requires.

## Production build

```bash
npm run build -- --base=./
npm run preview                  # serves dist/ locally
```

Before deploying, remove the sandbox artifacts:

```bash
rm -rf public/preview preview-shims
```

Host requirement: the static host must support HTTP Range requests for `bg.mp4`
(all real hosts do — Netlify, Vercel, S3/CloudFront, nginx. `python3 -m http.server` does not;
use `node ../scripts/serve.cjs website/dist 8123` instead if testing a raw folder).

## How the scroll-video system works

1. `public/bg.mp4` is re-encoded to **all-keyframe H.264** (`scripts/swap-bg-video.sh`, `-g 1`),
   so every frame is independently seekable — no decode stutter when jumping around.
2. The `<video id="bgv">` is `position: fixed` behind everything (z-index 1), muted, paused.
   A teal tint layer and faint blueprint grid sit above it for text readability.
3. `motion.js` creates one master `ScrollTrigger` spanning `document.body` with `scrub: true`.
   Its `onUpdate` maps overall page progress (0→1) to `video.currentTime` across
   `duration − 0.05s`, throttled to >8 ms deltas.
4. Lenis provides inertial smooth scrolling; it's wired into GSAP's ticker and pings
   `ScrollTrigger.update` on scroll, so scrub and reveals stay in sync.
5. The hero content is pinned for the first viewport and fades out on scroll (scrubbed).
6. Reveals (`[data-reveal]`) and metric counters use one-shot ScrollTriggers.
7. Fallbacks: touch devices, viewports < 900 px, and `prefers-reduced-motion` skip video
   scrubbing entirely — CSS hides the `<video>` and shows the fixed hero render
   (`.bg-fallback`, `img/hero-building.png`) instead.

## Dev hooks (dev builds only)

- `window.__lenis` — the Lenis instance
- `window.__ST` — ScrollTrigger
- `window.__bgv` — the background video element

## Language

The header toggle switches EN ↔ AR: it swaps copy from `src/data/content.js` and flips
`<html dir>` between `ltr`/`rtl`; the layout, nav, and hero mirror via CSS logical properties.
