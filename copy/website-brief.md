# NumidAI — Website Brief & Section Plan

_The blueprint for the marketing site. Every section below defines purpose, content, motion, and
3D/interaction notes. Copy lives in `content-plan.md`; this file defines structure and behavior._

---

## Objective

A premium enterprise SaaS marketing site that convinces MENA architects, engineering firms,
construction companies, real estate developers, and government institutions that NumidAI is the
credible AI decision-support layer for climate-responsive architecture. Bilingual: Arabic
(primary, RTL) + English (LTR toggle).

Primary conversion goals: **Start Free Trial**, **Book a Demo**. Secondary: **Watch Platform**.

---

## Global behavior

- **Smooth scroll** (Lenis or equivalent), RTL-aware — mirror scroll-triggered text and card
  entrance directions when Arabic is active.
- **Sticky header** with condensed state on scroll.
- **Language switcher** mirrors the entire layout, not just text.
- **Floating AI chat bubble** (bottom-right; bottom-left in RTL), collapsed by default, palette-
  styled — a lightweight entry to the AI Chat Assistant.
- Motion is restrained per `docs/design-system.md`; heavy 3D degrades to static on mobile and
  under `prefers-reduced-motion`.

---

## Sections (in order)

### 1. Navigation (sticky header)
- Logo (wordmark), nav: **Home · Platform · Solutions · Pricing · Resources · About · Contact**
- Language switcher (AR/EN), "Log in" (ghost), primary CTA "Book a Demo" (solid).
- Micro-interaction: nav underline in Turquoise on active/hover; header background fades to a
  translucent Ivory glass on scroll.

### 2. Hero
- **Headline:** "AI for Sustainable Architecture" / "الذكاء الاصطناعي لعمارة مستدامة"
- **Subtitle:** one line naming the mechanism (climate simulation, carbon analysis, passive
  design) and the outcome (less carbon, energy, cost).
- **CTAs:** Start Free Trial (solid) · Book a Demo (solid-secondary) · Watch Platform (ghost,
  play icon).
- **Visual:** large premium MENA sustainable-building render with floating AI analytics panels
  (Sustainability Score, Carbon Reduction %, Energy Performance).
- **Motion (flagship):** blueprint-to-building reveal — structure resolves from construction
  lines into the rendered building; analytics panels settle in; a slow AI scan passes once.
- **3D:** Spline or R3F scene; static hero render fallback on mobile.

### 3. Trusted Partners (trust strip)
- "Trusted by leading firms and institutions across the region" / Arabic equivalent.
- **Placeholder/generic marks only** until real partnerships are confirmed — never fabricate
  real names/logos.
- Micro-interaction: subtle grayscale→tint on hover.

### 4. Features (three core pillars)
- **Platform Dashboard**, **AI Workflow**, **Climate Intelligence** — each a card with line
  icon, title, 2-line description, and a "learn more" link into its section below.
- Motion: cards reveal on scroll with a short stagger, subtle lift on hover.

### 5. Interactive Platform Dashboard (product preview)
- The dashboard framed like a real product screenshot (browser/app frame, soft shadow), using
  the reference mockup as direction: project selector, project render, Sustainability Score
  gauge (e.g. 86/100 "Excellent"), four stat tiles with real units, AI Recommendations list
  (impact-tagged), Climate Analysis panel.
- Interaction: optional tabbed toggling between Overview / AI Analysis / Climate / Carbon views;
  data animates on tab change (calm transition).

### 6. AI Workflow
- The pipeline made explicit: **Enter project data → AI analysis → Generate alternatives →
  Choose & export.** Four steps revealed in sequence on scroll (pinned section).
- Reinforces "decision-support, not magic" — show inputs and outputs, not a black box.
- Motion: step-by-step reveal; a connecting line "draws" between steps as you scroll.

### 7. Climate Intelligence
- "Understand your site. Design for comfort." Heat-mapped site/massing visual with a low→high
  legend; sub-metrics: air temperature, solar radiation, wind direction, humidity, comfort hours.
- 3D/interaction: an R3F heat-mapped massing model (or static render fallback) with a scrubbable
  time-of-day or season control (future-friendly, static acceptable in v1).

### 8. Sustainability Metrics (stat counters)
- Quantified outcomes counting up on scroll, each with a line icon and a Soft Gold accent
  underline on the digits:
  - **−62%** carbon footprint (illustrative — label as case-study example)
  - **+40%** thermal comfort
  - **−55%** energy consumption
  - **−18%** life-cycle cost
- Note: figures are illustrative of specific projects, not universal guarantees.

### 9. Industries
- Cards: Architecture firms · Real estate developers · Construction companies · Government /
  public institutions · Universities — each with a one-line framing of what NumidAI does for them.
- Motion: subtle reveal + hover lift.

### 10. Testimonials
- Only real, approved quotes with real attribution — otherwise clearly-labeled illustrative
  placeholders. Never invent quotes attributed to named real people/firms.

### 11. Resources
- Entry points to case studies, guides, documentation, and (future) research/blog.
- Card grid; each card = thumbnail (custom render/diagram), category tag, title, short excerpt.

### 12. Call-to-Action
- "Start Your Sustainable Project" / strong Arabic equivalent, confident and calm.
- Solid primary CTA to trial signup, secondary to Book a Demo.
- Background: faint blueprint motif + a resolved building render, not a loud gradient.

### 13. Footer
- Logo, tagline, repeated nav, contact placeholder, social placeholders, language switcher,
  legal/copyright. Dissolve into a deeper Deep Forest Teal or stay on Ivory per final art
  direction.

---

## Section → asset map (see `asset-plan.md` for full list)

| Section | Key assets |
|---|---|
| Hero | Hero building render, blueprint-reveal 3D scene, floating analytics UI, hero video |
| Trusted Partners | Generic placeholder logo marks |
| Features | 3 line-icon illustrations |
| Dashboard | Dashboard mockup (matches reference), stat tiles, score gauge |
| AI Workflow | 4 step diagrams / isometric analysis render |
| Climate Intelligence | Heat-mapped site model render, climate icons |
| Sustainability Metrics | 4 metric line icons |
| Industries | 5 industry renders/illustrations |
| Resources | Case-study / guide thumbnails |
| CTA | Resolved building render + blueprint motif |

---

## Interaction & scroll summary
- Lenis smooth scroll, RTL-aware.
- Pinned sections: Hero (blueprint reveal), AI Workflow (4-step), optionally Climate.
- Scroll-triggered reveals with short staggers; single-run counters on Sustainability Metrics.
- 3D via Spline/R3F in Hero and Climate; static fallbacks on mobile / reduced-motion.
- Floating chat bubble persistent across sections.
