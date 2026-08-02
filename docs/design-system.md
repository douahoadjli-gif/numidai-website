# NumidAI — Design System

_The complete visual and interaction specification. Pairs with `copy/brand-kit.md`._

---

## 1. Design north star

Every NumidAI interface should look like it belongs next to **Apple, Autodesk, Arcadis, NVIDIA,
Stripe, Linear, Notion, BIG Architects, and Foster + Partners.**

The single governing test before shipping any screen or asset:

> **Could this pass for a real Autodesk / Arcadis / Foster + Partners internal tool screenshot
> or case-study page?**

If not, redo it. If a decision could apply to *any* AI SaaS product, it's wrong for NumidAI.

Explicit anti-patterns (never do these):
- Centered gradient-blob hero
- Generic purple/violet "AI gradient"
- Three-icon feature row that could belong to any SaaS
- Stock "diverse team laughing at a laptop" photography
- Generic robot / circuit-board / brain iconography
- Bubbly consumer-app rounding and bouncy motion
- Neon anything

---

## 2. Color system

### Tokens

```css
:root {
  --primary:    #0D3B3E; /* Deep Forest Teal */
  --secondary:  #156B6A; /* Emerald Teal */
  --accent:     #2AA69A; /* Turquoise */
  --soft-green: #A8C5A1; /* Sage Green */
  --bg:         #F5F2E8; /* Warm Ivory */
  --text:       #24352F; /* Charcoal Green */
  --neutral:    #D9DFDB; /* Mist Gray */
  --highlight:  #D6B55D; /* Soft Gold */
}
```

### Application map

| Element | Color |
|---|---|
| Page background (marketing) | Warm Ivory `--bg` |
| Body text | Charcoal Green `--text` |
| H1–H3, nav, logo lockup | Deep Forest Teal `--primary` |
| Primary button fill | Deep Forest Teal → Emerald Teal |
| Primary button hover | Emerald Teal `--secondary` |
| Links, active tab, data-highlight line | Turquoise `--accent` |
| Vegetation/nature icon, "green" metric | Sage Green `--soft-green` |
| Borders, dividers, disabled | Mist Gray `--neutral` |
| One premium accent per section (a stat digit, a thin rule, a star) | Soft Gold `--highlight` |
| Dashboard side panel (in-product) | Deep Forest Teal `--primary` |
| Dashboard content panels | Warm Ivory / white on `--bg` |

### Rules
- No colors outside these eight tokens.
- Soft Gold appears at most 1–2 times per section. If it shows up more, pull it back.
- Marketing site stays predominantly Warm Ivory. In-product dashboard may use a dark Deep
  Forest Teal nav rail against Ivory content (per the reference dashboard mockup).
- Contrast: verify Charcoal Green on Warm Ivory and white-on-Deep-Forest-Teal meet WCAG AA.

### Semantic status colors
Derive from the palette rather than importing new hues:
- Positive / on-track: Turquoise or Sage Green
- Attention: Soft Gold
- For a true error/danger state (rare), a muted terracotta may be introduced as a *documented*
  extension — flag it explicitly before use.

---

## 3. Typography

### Families

```css
:root {
  --font-head: "Space Grotesk", "General Sans", "Inter", system-ui, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", "JetBrains Mono", monospace; /* metrics, units, labels */
  --font-ar:   "IBM Plex Sans Arabic", "Noto Kufi Arabic", sans-serif; /* RTL */
}
```

### Scale (fluid, desktop reference)

| Role | Size | Weight | Notes |
|---|---|---|---|
| Display / H1 | 56–72px | 500–600 | Generous tracking, editorial |
| H2 | 40–48px | 500 | Section titles |
| H3 | 28–32px | 500 | Card/subsection titles |
| Body large | 18–20px | 400 | Hero subtitle, intros |
| Body | 16px | 400 | Default |
| Caption / label | 13–14px | 500 | Mono, uppercase, tracked |
| Metric value | 32–48px | 500 | Mono or tabular figures |

### Rules
- Restrained weight — no ultra-bold "shouting" headlines.
- Numbers and units always use mono / tabular figures for alignment (kWh/m²/year, kg CO₂/m²).
- Arabic uses `--font-ar`; never render Arabic in a Latin-only face.

---

## 4. Layout & grid

- **12-column grid**, max content width ~1280–1440px, generous gutters.
- Large vertical rhythm — sections breathe; don't compress to fit more.
- **Rounded corners:** restrained (8–16px for cards/panels, up to 24px for large feature
  panels). Autodesk/Linear level, not bubbly.
- **Glassmorphism:** only for floating analytics panels over a render/3D scene. Never the
  default panel style.
- **Blueprint motif:** faint construction lines, dimension marks, and axis guides as section
  backgrounds or dividers — the recurring signature. Keep low-contrast so it never fights content.
- **Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128 px.

---

## 5. Components

### Buttons
- **Primary:** Deep Forest Teal → Emerald Teal fill, Ivory text, subtle shadow, restrained hover
  lift. Used for the single most important action per view (Start Free Trial / Book a Demo).
- **Secondary / ghost:** Charcoal Green text, thin Mist Gray border, transparent/near-white fill.
- **Tertiary / link:** Turquoise text, underline on hover.

### Panels / cards
- Warm Ivory or white surface, thin Mist Gray or low-opacity Emerald border, restrained radius,
  soft shadow. Hover: subtle lift + faint Turquoise border glow.

### Stat tile (dashboard)
- Large mono metric value + unit, small label above, tiny sparkline/trend line in Turquoise.
- Four core tiles: Energy Use Intensity (kWh/m²/year), Carbon Emissions (kg CO₂/m²), Water
  Consumption (L/m²/day), Thermal Comfort (% hours comfortable).

### Sustainability Score
- Circular gauge, 0–100, arc colored Turquoise→Sage, numeric center value in mono, qualitative
  label beneath (Excellent / Good / Needs Improvement).

### AI Recommendation item
- Concise, action-phrased ("Increase shading on west façade to reduce cooling load"), with an
  impact badge (High / Medium / Low). High = Turquoise, Medium = Soft Gold, Low = Mist Gray.

### Badges / chips
- Small, mono uppercase label, thin border, palette-tinted background.

---

## 6. Iconography
- Thin line icons, consistent stroke weight (~1.5–2px), rounded joins, drawing-like precision.
- Climate/nature set: leaf, sun, wind, water drop, thermal wave, CO₂ — same line system.
- No filled consumer glyphs, no robot/circuit AI clichés.
- Emblem (twin-leaf + stacked diamonds) reserved for favicon / app icon / standalone mark.

---

## 7. Motion system

Motion is **precise and engineered**, never flashy. Priority order:

1. **Blueprint-to-building reveal** — structure resolves from wireframe/blueprint lines into a
   rendered building. Flagship pattern; use once per major surface, not everywhere.
2. **AI scan effect** — slow, precise scan line/grid pass over a render, suggesting analysis.
3. **Floating analytics cards** — stat panels gently settle into place over a hero visual.
4. **Climate visualization** — heat-map overlays (temp/solar/wind) fade in; low→high legend
   always visible.
5. **Smooth counters** — count up once on view; never loop.
6. **Dashboard transitions** — calm 150–250ms panel/section transitions.
7. **Hover interactions** — subtle lift / border glow; no bounce.

Constraints:
- Minimal overall — if in doubt, halve it.
- No gratuitous parallax, no looping ambient effects competing with data.
- Data viz settles into its final state (reports a result, doesn't perform).
- 3D camera moves slow and physically plausible — no whip pans or unmotivated spins.
- Framer Motion: `easeOut`-style settle curves for data; springs only for small UI affordances.
- Respect `prefers-reduced-motion` — disable non-essential motion.

---

## 8. 3D integration (Spline / Three.js / React Three Fiber)

- Hero: blueprint-to-building reveal and/or a slowly rotating building study.
- Climate: interactive heat-mapped site/massing model.
- Keep polycount and texture weight web-appropriate; lazy-load; provide a static render fallback
  on mobile and under `prefers-reduced-motion`.
- Spline for art-directed, quick-to-iterate scenes; R3F where tighter React/data integration is
  needed (e.g. data-driven climate overlays).

---

## 9. Responsive & accessibility
- Real layouts at desktop / tablet / mobile — not a squeezed desktop view.
- Heavy 3D/video hero → lighter or static fallback on mobile.
- Semantic HTML, keyboard navigability, visible focus states, alt text on all imagery.
- Color contrast AA minimum against Warm Ivory and Deep Forest Teal.
- Full **RTL** support: mirror layout, icon direction (arrows, progress), and scroll-triggered
  animation direction when Arabic is active — not just text alignment.

---

## 10. Z-layer architecture (marketing hero with 3D/video)

| Layer | z-index | Role |
|---|---:|---|
| 3D/video background | 0 | Fixed hero scene / blueprint reveal |
| Tint / readability wash | 1 | Soft warm wash for text contrast |
| Blueprint line texture | 2 | Faint construction-line motif |
| Page content | 10 | React sections |
| Floating analytics UI | 20 | Glass stat panels over the render |
| Custom cursor (desktop only) | 100 | Optional precision cursor ring |
