# NumidAI Platform — Project Workspace

Official workspace for the **NumidAI** website and platform. NumidAI is an AI-powered
decision-support platform that helps architects, engineering firms, real estate developers,
construction companies, and government institutions across the **Middle East and North Africa
(MENA)** design sustainable, climate-responsive buildings.

This repository currently contains **planning and documentation only** — no media, no 3D, no
production code has been generated yet.

---

## Folder structure

```
numidai-platform/
├─ assets/
│  ├─ images/       generated architectural renders, dashboard/UI mockups, illustrations
│  ├─ videos/       hero cinematic + web-optimized exports
│  ├─ references/   supplied reference material (dashboard mockup)
│  ├─ 3d/           Spline / R3F scenes (blueprint reveal, climate massing)
│  ├─ icons/        line-icon sets (climate, feature, industry, UI)
│  └─ logos/        supplied wordmark + emblem (use as-is)
├─ copy/
│  ├─ brand-kit.md        brand identity, mission, positioning, voice, palette, logo rules
│  ├─ asset-plan.md       every required asset with priority + missing-info list
│  ├─ image-prompts.md    ready-to-run AI image prompts per section
│  ├─ video-prompt.md     Seedance 2.0 hero cinematic concept (scene-by-scene)
│  ├─ website-brief.md    section-by-section site structure, motion, 3D notes
│  └─ content-plan.md     EN/AR copy framework per section
├─ docs/
│  └─ design-system.md    full visual + interaction spec (color, type, layout, motion, 3D, a11y)
├─ scripts/               build/encode helper scripts (added at production time)
└─ README.md              this file
```

## Supplied assets (already in workspace)
- `assets/logos/numidai-wordmark.png` — primary wordmark (use as-is, do not regenerate)
- `assets/logos/numidai-emblem.jpeg` — emblem for favicon / app icon / standalone mark
- `assets/references/dashboard-mockup-reference.png` — dashboard direction reference

---

## Tech stack (planned)
Lovable · React · TypeScript · TailwindCSS · Supabase · Spline · Three.js · React Three Fiber ·
Framer Motion. Full RTL (Arabic primary) + LTR (English), accessibility, SEO, performance.

---

## Production workflow

1. **Plan (this phase — complete):** brand kit, design system, asset plan, prompts, site brief,
   content plan.
2. **Approve planning:** confirm brand/voice/structure; resolve the missing-info list in
   `asset-plan.md` (partners, verified metrics, fonts, pricing, testimonials).
3. **Generate P0 media (on approval):** hero renders (A1/A2/A9), hero 3D reveal (B1), core
   dashboard mockup (C1), workflow diagram (D1), core icon sets, partner placeholders.
4. **Generate hero video (on approval):** Seedance 2.0 cinematic (G1) → web-optimized export (G2).
5. **Design system in code:** Tailwind theme from the eight design tokens, typography, base
   components (Button, Panel, StatTile, ScoreGauge, RecommendationItem).
6. **Build marketing site:** sections per `website-brief.md`, EN + AR in parity, Lenis smooth
   scroll (RTL-aware), Framer Motion reveals, Spline/R3F hero + climate scenes.
7. **Build product dashboard preview:** matching the reference mockup and design system.
8. **P1/P2 media + pages:** dashboard tabs, industries, resources, pricing; later phases
   (marketplace, BIM, platform walkthrough video).
9. **QA:** run the verification checklist in `docs/design-system.md` / the skill — palette, no
   generic-SaaS tropes, custom imagery, RTL/LTR parity, a11y, responsive, illustrative-figure
   labeling.

Media generation, live preview, and package installs happen in **Lovable / Claude Code**; this
chat environment can produce planning, copy, tokens, component code, and static assets.

---

## Guardrails (from the NumidAI skill)
- Only the eight brand colors; Soft Gold sparingly; no neon / purple AI gradients.
- Custom MENA architectural imagery only — never stock.
- No real partner/client logos or invented testimonials without explicit approval.
- Illustrative figures (e.g. −62% carbon) labeled as case-study examples until verified.
- Every screen must pass: _could this be a real Autodesk / Arcadis / Foster + Partners tool?_
