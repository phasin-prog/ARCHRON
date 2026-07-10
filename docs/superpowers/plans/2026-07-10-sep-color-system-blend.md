# SEP Color System Blend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Archon's color foundation tokens with SEP-inspired palette — Cardinal red accent, SEP bg/border/text — while keeping all other tokens, fonts, icons, and component language intact.

**Architecture:** Single-file change in `src/app/globals.css` @theme block (~15 tokens), plus build/lint verification and visual QA pass.

**Tech Stack:** Tailwind CSS v4 (@theme), CSS custom properties, Next.js 16

## Global Constraints

- Only touch `src/app/globals.css` — no component CSS changes (auto-propagates via CSS variables)
- All new values must maintain WCAG AA contrast (4.5:1+)
- Thai-first: no language changes
- Run `npm run build && npm run lint` before commit

---

### Task 1: Update foundation color tokens

**Files:**
- Modify: `src/app/globals.css:29-55` (@theme block — Neutral Canvas, Accent, Focus First Accent)

**Interfaces:**
- Consumes: existing CSS variable structure
- Produces: new color values that propagate to all component CSS files

- [ ] **Step 1: Update Neutral Canvas tokens**

Replace the bg, border, and text values in @theme:

```css
/* Old */
--color-bg: #FAF6F0;
--color-bg-elevated: #F1EBE1;
--color-border: #8C8478;
--color-text-heading: #25231F;
--color-text-body: #5C5852;
--color-text-secondary: #756E68;

/* New */
--color-bg: #F9F5F3;
--color-bg-elevated: #EDEBE9;
--color-border: #D7D5D3;
--color-text-heading: #000000;
--color-text-body: #505050;
--color-text-secondary: #666666;
```

- [ ] **Step 2: Update Accent tokens (Cardinal red)**

Replace the accent values:

```css
/* Old */
--color-accent: #1C5D99;
--color-accent-hover: #123F6B;
--color-accent-on-bg: #1C5D99;

/* New */
--color-accent: #8C1515;
--color-accent-hover: #6B1010;
--color-accent-on-bg: #8C1515;
```

- [ ] **Step 3: Update Focus First accent-knowledge**

```css
/* Old */
--color-accent-knowledge: #2F3A5A;

/* New */
--color-accent-knowledge: #3A3A5A;
```

- [ ] **Step 4: Verify edit is correct**

Read `src/app/globals.css` lines 28-56 to confirm the new values are in place.

---

### Task 2: Build + lint verification

**Files:** None — just running commands

- [ ] **Step 1: Run build**

```bash
npm run build
```
Expected: exit code 0, no errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```
Expected: exit code 0, no warnings/errors

---

### Task 3: Visual QA — Key pages

**Files:** None — visual inspection

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Check homepage** at `http://localhost:3000/`
  - Background `#F9F5F3` renders correctly
  - Cardinal red accent visible on links/buttons
  - Text colors updated (heading black, body #505050)
  - Borders are lighter

- [ ] **Step 3: Check content page** at `http://localhost:3000/articles/[slug]`
  - .md-body links use Cardinal red
  - Blockquote accent changed
  - Citation links updated

- [ ] **Step 4: Check navigation**
  - Glass-nav border tint changed from blue to red
  - Tab underline accent changed
  - Breadcrumb hover color changed

- [ ] **Step 5: Check cards** — any page with .archron-card
  - Card hover glow uses Cardinal red
  - Card border updated

- [ ] **Step 6: Check buttons**
  - .btn-primary bg is Cardinal red
  - .btn-secondary hover border/text updated
  - FAB updated

- [ ] **Step 7: Check inputs/form elements** at studio
  - Input focus ring uses Cardinal red
  - Switch toggle checked state red
  - Checkbox/radio accent color red

- [ ] **Step 8: If any visual issues found**, adjust:
  - Accent too strong → lower `--color-accent-subtle` mix opacity from 15% to 12%
  - Border too faint → change `--color-border` to `#C5C3C1`
  - Text too cool → change `--color-text-body` to `#4A4845`
  - Re-run build + lint after adjustments

---

### Task 4: Final commit

- [ ] **Step 1: Stage and commit**

```bash
git add src/app/globals.css
git commit -m "feat: blend SEP color system — Cardinal red accent, SEP bg/border/text"
```
