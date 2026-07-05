# Alexandria UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ลด visual noise, สร้าง identity ที่แตกต่างในแต่ละหน้า, จัด layout consistency, ยึดกลิ่นอาย Library of Alexandria

**Architecture:** Each page gets exactly 1 atmosphere system (replacing 4-5 overlapping layers). Layouts consolidate from 10+ archetypes to 3 templates. Z-index uses a central token scale. Card system keeps 7 content variants but removes heavy pseudo-element effects. Texture system trimmed to grain + vignette only.

**Tech Stack:** Next.js 16 · React 19 · Tailwind v4 · CSS custom properties

**Global Constraints:**
- Thai-first UI — all text content stays Thai
- Dark mode only — no light mode changes
- No HTML/JSX structure changes unless specified (CSS-only where possible)
- `npm run build` must pass after every task
- Keep `.archron-card` class name for backward compat (components use it widely)
- Keep `atmo-base` class for backward compat (15 files use it)

---

### Task 1: Z-index Scale tokens + Overlays/Nav migration

**Files:**
- Modify: `app/globals.css` (line ~43, add after `@theme` block)
- Modify: `app/overlays.css`
- Modify: `app/navigation.css`

**Interfaces:**
- Produces: CSS custom properties `--z-base`, `--z-surface`, `--z-sticky`, `--z-nav`, `--z-drawer`, `--z-overlay`, `--z-toast`

- [ ] **Step 1: Add `--z-*` tokens to `globals.css`**

After the `@theme` block (after line ~109), add before `@layer base`:

```css
/* ── Z-index Scale (รวมศูนย์ — ห้ามใช้ magic numbers) ─────── */
:root {
  --z-base:    0;
  --z-surface: 10;
  --z-sticky:  30;
  --z-nav:     40;
  --z-drawer:  50;
  --z-overlay: 60;
  --z-toast:   70;
}
```

- [ ] **Step 2: Migrate `overlays.css` z-index**

Replace all hardcoded z-index values:
- Line 15: `z-index: 100;` → `z-index: var(--z-overlay);`
- Line 37: `z-index: 110;` → `z-index: var(--z-overlay);`
- Line 114: `z-index: 110;` → `z-index: var(--z-overlay);`
- Line 171: `z-index: 120;` → `z-index: var(--z-overlay);`
- Line 201: `z-index: 200;` → `z-index: var(--z-toast);`
- Line 289: `z-index: 130;` → `z-index: var(--z-overlay);`

- [ ] **Step 3: Migrate `navigation.css` z-index**

Line 326: `.archron-tabbar { z-index: 50; }` → `z-index: var(--z-nav);`

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/overlays.css app/navigation.css
git commit -m "feat(z-index): add centralized z-index scale, migrate overlays and nav"
```

---

### Task 2: Atmosphere System — CSS restructure (globals.css)

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `--z-base` from Task 1
- Produces: Clean `.atmo` system, simplified `.archron-card` base, removed hero-grid-3d/accent-aura/symbolic-icon CSS

- [ ] **Step 1: Remove `accent-aura` CSS block**

Delete lines 583-601 (`.accent-aura` definition + `@keyframes accent-breathe` + responsive override):
- `.accent-aura { ... }`
- `@keyframes accent-breathe { ... }`
- `@media (prefers-reduced-motion: reduce) { .accent-aura { animation: none; } }`

- [ ] **Step 2: Remove `hero-grid-3d` CSS block**

Delete lines 979-1138 (`.hero-grid-3d` and all BEM children + vignette + keyframes):
- `.hero-grid-3d { ... }` through `.hero-grid-3d__vignette { ... }`
- `@keyframes hero-grid-drift { ... }`
- `@media (prefers-reduced-motion: reduce) { .hero-grid-3d__* }`

Also remove the tablet/mobile overrides for hero-grid-3d at lines 1141-1152 (tablet block) and 1154-1210 (mobile block for hero-grid-3d parts only — keep mobile overrides for other elements).

- [ ] **Step 3: Simplify `.archron-card` base**

Replace the entire `.archron-card` block (lines 614-698) with:

```css
.archron-card {
  position: relative;
  border: 1px solid var(--color-slate-boundary);
  border-radius: 0.85rem;
  background: var(--color-surface-container-low);
  transition:
    border-color var(--dur-base) var(--ease-out),
    transform var(--dur-base) var(--ease-out);
}
.archron-card:hover {
  transform: translateY(-2px);
  border-color: var(--cosmology-accent, var(--color-burnished-gold));
}
```

Also remove:
- `.archron-card--prima`, `.archron-card--psyche`, `.archron-card--lumen`, `.archron-card--sapientia`, `.archron-card--mercurius`, `.archron-card--humanitas` (lines 703-744)
- `.archron-card--link` (lines 747-752)
- `.archron-card--lite` (lines 757-763)
- `.archron-panel` (lines 768-772)
- `.tag-pill` (lines 776-786)

- [ ] **Step 4: Remove `.icon-3d` and `.icon-tile` CSS blocks**

Delete lines 884-920 (`.icon-3d { ... }` through `.icon-tile .icon-3d { ... }`)

- [ ] **Step 5: Simplify `body::before`**

Replace the body::before block (lines 259-267) with a simpler gradient:

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: var(--z-base);
  pointer-events: none;
  background: linear-gradient(180deg, #1B2130 0%, #10141C 100%);
}
```

- [ ] **Step 6: Simplify `.atmo-base`**

Replace `.atmo-base` block (lines 1249-1271) — remove `::before` and `::after` pseudo-elements, keep only:

```css
.atmo-base {
  position: relative;
}
```

- [ ] **Step 7: Simplify existing atmosphere variant CSS**

Replace the atmosphere variants block (lines 1276-1357) — remove `::before`/`::after` overrides and `> .relative.z-10::before` patterns. Keep only:

```css
/* Grand Reading Hall (Home) — warm gold pulse */
.atmo-observatory {
  --cosmology-accent: #C79A4A;
}
.atmo-observatory::before {
  content: "";
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background:
    radial-gradient(900px 560px at 50% -8%, color-mix(in srgb, var(--color-burnished-gold) 20%, transparent), transparent 60%);
}

/* Scriptorium (Articles) — psyche wash */
.atmo-magazine {
  --cosmology-accent: #6E93A8;
}
.atmo-magazine::before {
  content: "";
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-psyche) 10%, transparent) 0%, transparent 60%);
}

/* Catalog Hall (Concepts) — cool slate + aisle light */
.atmo-dictionary {
  --cosmology-accent: #6E93A8;
}
.atmo-dictionary::before {
  content: "";
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--color-lumen) 12%, transparent) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--color-psyche) 6%, transparent) 0%, transparent 70%);
}

/* Temple (Schools/Guide) */
.atmo-temple {
  --cosmology-accent: #8AA395;
}
.atmo-temple::before {
  content: "";
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 20%, color-mix(in srgb, var(--color-mercurius) 8%, transparent) 0%, transparent 50%);
}

/* Biography (Thinkers) */
.atmo-biography {
  --cosmology-accent: #C79A4A;
}
.atmo-biography::before {
  content: "";
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background:
    radial-gradient(ellipse at 70% 15%, color-mix(in srgb, var(--color-burnished-gold) 6%, transparent) 0%, transparent 50%);
}

/* Museum (Timeline) */
.atmo-museum {
  --cosmology-accent: #8AA395;
}
.atmo-museum::before {
  content: "";
  position: fixed; inset: 0; z-index: var(--z-base);
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--color-mercurius) 6%, transparent) 0%, transparent 50%);
}
```

Remove the responsive blocks for atmo at lines 1352-1357.

- [ ] **Step 8: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 9: Commit**

```bash
git add app/globals.css
git commit -m "feat(atmosphere): simplify to 1-gradient per page, strip hero-grid-3d, accent-aura, card pseudo-elements, icon-tile, tag-pill"
```

---

### Task 3: Remove `accent-aura` from layout + update page atmosphere classes

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx` (Home)
- Modify: `app/articles/page.tsx`
- Modify: `app/articles/[slug]/page.tsx`
- Modify: `app/concepts/page.tsx`
- Modify: `app/concepts/[slug]/page.tsx`
- Modify: `app/constellation/page.tsx`
- Modify: `app/search/page.tsx`
- Modify: `app/faq/page.tsx`
- Modify: `app/guide/page.tsx`
- Modify: `app/schools/page.tsx`
- Modify: `app/schools/[slug]/page.tsx`
- Modify: `app/thinkers/page.tsx`
- Modify: `app/thinkers/[slug]/page.tsx`
- Modify: `app/timeline/page.tsx`
- Modify: `app/reading-sets/[slug]/page.tsx`

**Interfaces:**
- Consumes: Task 2 (simplified `.atmo-base` + new `::before`-based atmosphere system)

- [ ] **Step 1: Remove `accent-aura` div from `layout.tsx`**

In `app/layout.tsx`, delete line 117:
```tsx
<div className="accent-aura" aria-hidden="true" />
```

- [ ] **Step 2: Remove `HeroGrid3D` import and usage from `app/page.tsx`**

Delete line 15: `import { HeroGrid3D } from "@/components/hero/hero-grid-3d";`

Delete lines 87: `<HeroGrid3D />`

- [ ] **Step 3: Remove texture classes from `app/page.tsx`**

In the main wrapper (line 79): change `atmo-base atmo-observatory` → `atmo-observatory`

Remove `texture-grain` from line 81
Remove `texture-parchment` from lines 185, 226, 309
Remove `texture-glow-gold` from lines 185, 309
Remove `texture-vignette` from line 266

- [ ] **Step 4: Update all other page atmosphere classes**

In each file, replace `atmo-base atmo-VARIANT` with just `atmo-VARIANT`:

| File | Current | New |
|------|---------|-----|
| `app/page.tsx` | `atmo-base atmo-observatory` | `atmo-observatory` |
| `app/articles/page.tsx` | `atmo-base atmo-magazine` | `atmo-magazine` |
| `app/articles/[slug]/page.tsx` | `atmo-base atmo-magazine` | `atmo-magazine` |
| `app/concepts/page.tsx` | `atmo-base atmo-dictionary` | `atmo-dictionary` |
| `app/concepts/[slug]/page.tsx` | `atmo-base atmo-dictionary` | `atmo-dictionary` |
| `app/constellation/page.tsx` | `atmo-base atmo-observatory` | `atmo-observatory` |
| `app/search/page.tsx` | `atmo-base atmo-observatory` | `atmo-observatory` |
| `app/faq/page.tsx` | `atmo-base atmo-observatory` | `atmo-observatory` |
| `app/guide/page.tsx` | `atmo-base atmo-temple` | `atmo-temple` |
| `app/schools/page.tsx` | `atmo-base atmo-temple` | `atmo-temple` |
| `app/schools/[slug]/page.tsx` | `atmo-base atmo-temple` | `atmo-temple` |
| `app/thinkers/page.tsx` | `atmo-base atmo-biography` | `atmo-biography` |
| `app/thinkers/[slug]/page.tsx` | `atmo-base atmo-biography` | `atmo-biography` |
| `app/timeline/page.tsx` | `atmo-base atmo-museum` | `atmo-museum` |
| `app/reading-sets/[slug]/page.tsx` | `atmo-base atmo-dictionary` | `atmo-dictionary` |

- [ ] **Step 5: Remove texture classes from remaining pages**

Remove `texture-parchment`, `texture-glow-gold`, `texture-grain`, `texture-vignette`, `texture-paper` from:
- `app/thinkers/page.tsx` — remove `texture-parchment`, `texture-glow-gold`
- `app/schools/page.tsx` — remove `texture-parchment`, `texture-glow-gold`, `texture-grain`, `texture-vignette`
- `app/articles/page.tsx` — remove `texture-grain`, `texture-glow-gold`
- `app/concepts/page.tsx` — remove `texture-paper`
- `app/reading-page.tsx` — remove `texture-grain` (if present on `.reading-page`)

- [ ] **Step 6: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/page.tsx app/articles/ app/concepts/ app/constellation/ app/search/ app/faq/ app/guide/ app/schools/ app/thinkers/ app/timeline/ app/reading-sets/
git commit -m "feat(atmosphere): update all pages to new single-layer atmosphere system, remove texture classes"
```

---

### Task 4: Texture CSS cleanup

**Files:**
- Modify: `app/texture.css`

- [ ] **Step 1: Strip `texture.css` to only grain + vignette**

Delete everything except `.texture-grain` and `.texture-vignette::after` definitions.

Remove:
- `.texture-parchment`, `.texture-noise`, `.texture-paper`
- `.texture-glow-gold`, `.texture-glow-psyche`
- `.gradient-fade-bottom`, `.gradient-fade-top`, `.gradient-fade-edges`
- `.surface-elevated`, `.surface-sunken`, `.surface-glass`
- `.border-subtle`, `.border-glow`
- Lines 193-196 (duplicate/redundant utility definitions)

Result file should contain only:
```css
/* grain */
.texture-grain { position: relative; }
.texture-grain::before {
  content: ""; position: absolute; inset: 0;
  opacity: var(--texture-grain-opacity);
  background-image: url("data:image/svg+xml,...");
  background-repeat: repeat;
  background-size: 256px 256px;
  pointer-events: none;
  z-index: 1;
}

/* vignette */
.texture-vignette::after {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 60%, color-mix(in srgb, var(--color-prima) 40%, transparent) 100%);
  pointer-events: none;
  z-index: 1;
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 3: Commit**

```bash
git add app/texture.css
git commit -m "refactor(texture): keep only grain + vignette, remove unused texture variants"
```

---

### Task 5: Layout templates reduction

**Files:**
- Modify: `app/layout.css`
- Modify: `app/responsive.css`

- [ ] **Step 1: Replace `layout.css` content**

Replace entire file content:

```css
/* Layout Templates — 3 archetypes */
:root {
  --width-reading: 760px;
  --width-reference: 980px;
  --width-dashboard: 1280px;
}

.layout { min-height: 100vh; display: flex; flex-direction: column; }
.layout-main { flex: 1; width: 100%; }

/* Reading (760px) — articles, concepts */
.tpl-reading {
  max-width: var(--width-reading);
  margin-left: auto; margin-right: auto;
  padding: 0 16px;
}
@media (min-width: 768px) {
  .tpl-reading { padding: 0 24px; }
}

/* Reference (980px) — lists, search, index pages */
.tpl-reference {
  max-width: var(--width-reference);
  margin-left: auto; margin-right: auto;
  padding: 0 16px;
}
@media (min-width: 768px) {
  .tpl-reference { padding: 0 24px; }
}
@media (min-width: 1024px) {
  .tpl-reference { padding: 0 48px; }
}

/* Dashboard (1280px) — studio, timeline */
.tpl-dashboard {
  max-width: var(--width-dashboard);
  margin-left: auto; margin-right: auto;
  padding: 0 16px;
}
@media (min-width: 768px) {
  .tpl-dashboard { padding: 0 24px; }
}
@media (min-width: 1024px) {
  .tpl-dashboard { padding: 0 48px; }
}
```

- [ ] **Step 2: Remove redundant container overrides from `responsive.css`**

In `app/responsive.css`, remove lines 123-147 (the `.container-narrow`, `.container-standard`, `.container-wide`, `.container-full` overrides inside `@media (min-width: 1025px)`). These layouts are now handled by `.tpl-*` classes.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 4: Commit**

```bash
git add app/layout.css app/responsive.css
git commit -m "refactor(layout): reduce to 3 tpl-* templates, remove redundant container overrides"
```

---

### Task 6: Containers, Rhythm, Typography consolidation

**Files:**
- Modify: `app/containers.css`
- Modify: `app/rhythm.css`
- Modify: `app/typography.css`

- [ ] **Step 1: Strip `containers.css`**

Remove:
- `.container-sm`, `.container-md`, `.container-lg`, `.container-xl`, `.container-2xl`, `.container-prose`, `.container-reading`
- `.content-reading`, `.content-reference`, `.content-studio`, `.content-dashboard`
- `.prose` (full block, lines 127-274)
- Responsive container styles (lines 107-125)

Keep only:
```css
:root {
  --container-sm: 640px; --container-md: 768px;
  --container-lg: 1024px; --container-xl: 1280px; --container-2xl: 1536px;
  --container-prose: 75ch; --container-reading: 760px;
  --container-narrow: 640px; --container-standard: 1024px;
  --container-wide: 1280px; --container-full: 100%;
}
```

- [ ] **Step 2: Strip `rhythm.css`**

Remove `.reading-rhythm` block (lines 107-199) — this is covered by `.md-body` in `typography.css`.

Keep all other rhythm utilities.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 4: Commit**

```bash
git add app/containers.css app/rhythm.css
git commit -m "refactor(css): remove prose, reading-rhythm, container-variants (covered by tpl-* and md-body)"
```

---

### Task 7: Cards CSS simplification

**Files:**
- Modify: `app/cards.css`

- [ ] **Step 1: Simplify `cards.css` — content card variants**

Keep the 7 content type variant classes (article, concept, person, book, school, symbol, term) but strip all `::before`/`::after` pseudo-elements from them.

Replace each variant block to remove `::before`/`::after`. Example for `--article`:

```css
.archron-card--article {
  --card-accent: var(--color-burnished-gold);
  border-radius: 0.85rem;
}
.archron-card--article:hover {
  border-color: color-mix(in srgb, var(--card-accent) 60%, transparent);
  box-shadow: 0 20px 48px -16px color-mix(in srgb, var(--color-prima) 80%, transparent);
}
```

Apply same treatment to all 7 variants — remove `::before`, `::after`, and any `::before:hover`, `::after:hover` blocks.

Also remove:
- `.card-article`, `.card-concept`, `.card-thinker`, `.card-school`, `.card-book` (legacy class blocks, lines 245-249)
- `.card-selected`, `.card-interactive`, `.card-header`, `.card-icon`, `.card-title`, `.card-subtitle`, `.card-body`, `.card-footer`, `.card-grid`, `.card-stat`, `.card-stat-value`, `.card-stat-label`, `.card-skeleton`, `.card-skeleton-text`, `.card-skeleton-title`, `.card-skeleton-icon` (lines 272-406 — not referenced anywhere)

- [ ] **Step 2: Add `.card-panel` alias**

Add at the end of `cards.css`:
```css
.card-panel {
  border: 1px solid color-mix(in srgb, var(--color-ivory) 6%, var(--color-slate-boundary));
  border-radius: 0.5rem;
  background: color-mix(in srgb, var(--color-ivory) 3%, var(--color-surface-container));
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 4: Commit**

```bash
git add app/cards.css
git commit -m "refactor(cards): strip pseudo-elements from all variants, add card-panel alias, remove unused card components"
```

---

### Task 8: Remove HeroGrid3D component + SymbolicBackground

**Files:**
- Modify: `components/hero/hero-grid-3d.tsx`
- Modify: `components/symbolic-background.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Empty the `HeroGrid3D` component**

Replace `components/hero/hero-grid-3d.tsx` with:
```tsx
export function HeroGrid3D() {
  return null;
}
```

- [ ] **Step 2: Simplify `SymbolicBackground`**

Reduce to just the first character with lower opacity:
```tsx
"use client";

export function SymbolicBackground() {
  return (
    <div className="symbolic-bg" aria-hidden="true">
      <span
        className="symbolic-bg__item"
        style={{ left: "5%", top: "12%" }}
      >
        Ψ
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 4: Commit**

```bash
git add components/hero/hero-grid-3d.tsx components/symbolic-background.tsx
git commit -m "refactor(components): empty HeroGrid3D, simplify SymbolicBackground to single symbol"
```

---

### Task 9: Final file cleanup — responsive.css + globals.css

**Files:**
- Modify: `app/responsive.css`
- Modify: `app/globals.css`

- [ ] **Step 1: Clean `responsive.css`**

Remove only the unused animation overrides — `.animate-float`, `.animate-orbit`, `.animate-pulse-soft` (lines ~154-158). Keep all mobile overrides for `.archron-card`, `.archron-panel`, `backdrop-blur`, `scroll-reveal`, `.section-hero`.

Remove lines 228-259 (`.heading-responsive`, `.mobile-tab-bar` — not used).

- [ ] **Step 2: Clean `globals.css`** — remove `symbolic-bg` CSS

Since we simplified `SymbolicBackground`, the CSS is still needed for the single symbol. Keep `.symbolic-bg` and `.symbolic-bg__item` CSS as-is but reduce the nth-child rules. Delete lines 1387-1402 (nth-child overrides for position/size/opacity) and lines 1404-1417 (the `@keyframes sym-float`).

Actually, keep the keyframes — the single symbol still needs to float. Just remove the nth-child overrides that aren't needed.

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 4: Commit**

```bash
git add app/responsive.css app/globals.css
git commit -m "refactor: final cleanup of responsive.css and symbolic-bg nth-child"
```

---

### Task 10: Update components using `.icon-tile` → inline styles

**Files:**
- Modify: `app/support/page.tsx`
- Modify: `components/sources/sources-browser.tsx`
- Modify: `components/reading-sets/reading-set-card.tsx`
- Modify: `app/profile/page.tsx`
- Modify: `app/sources/page.tsx`
- Modify: `app/studio/profile/page.tsx`

- [ ] **Step 1: Replace `.icon-tile` with inline Tailwind classes**

`.icon-tile` CSS was:
```css
display: inline-flex; align-items: center; justify-content: center;
width: 2.75rem; height: 2.75rem; flex: none;
border: 1px solid ...; border-radius: 0.9rem 0.3rem;
background: linear-gradient(165deg, ...);
```

Replace each `.icon-tile` usage with:
```tsx
<span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-slate-boundary/40 rounded-[0.9rem_0.3rem] bg-surface-container-low">
```

Affected files and locations:
- `app/support/page.tsx` lines 50, 81
- `components/sources/sources-browser.tsx` line 124
- `components/reading-sets/reading-set-card.tsx` line 54
- `app/profile/page.tsx` lines 187, 240, 262, 282, 299
- `app/sources/page.tsx` line 78
- `app/studio/profile/page.tsx` line 159

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 3: Commit**

```bash
git add app/support/page.tsx app/profile/page.tsx app/sources/page.tsx app/studio/profile/page.tsx components/sources/sources-browser.tsx components/reading-sets/reading-set-card.tsx
git commit -m "refactor: replace .icon-tile with inline Tailwind classes"
```

---

### Task 11: Replace `.tag-pill` with inline Tailwind in components

**Files:**
- Modify: `components/thinkers/thinkers-hub.tsx`
- Modify: `app/studio/editor/page.tsx`
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Replace `.tag-pill` with inline classes**

`.tag-pill` CSS was:
```css
display: inline-flex; align-items: center;
border-radius: 9999px;
padding: 0.125rem 0.625rem;
font-size: 11px; font-weight: 600; line-height: 1.4;
background: color-mix(in srgb, ...gold... 10%, transparent);
color: ...gold...;
```

Replace with:
```tsx
className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4] bg-burnished-gold/10 text-burnished-gold"
```

Affected files:
- `components/thinkers/thinkers-hub.tsx` lines 140, 161
- `app/studio/editor/page.tsx` lines 353, 458
- `app/profile/page.tsx` lines 134, 398

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: SUCCESS

- [ ] **Step 3: Commit**

```bash
git add components/thinkers/thinkers-hub.tsx app/studio/editor/page.tsx app/profile/page.tsx
git commit -m "refactor: replace .tag-pill with inline Tailwind classes"
```
