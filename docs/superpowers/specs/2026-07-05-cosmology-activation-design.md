# Cosmology Activation — Design Spec

## Goal
Activate the 6-theme `data-cosmology` system across all pages so that `SymbolicBackground`, `glass-nav`, surface tints, and accent colors change per route.

## Background
The CSS has 6 fully-defined cosmology themes (`prima`, `psyche`, `lumen`, `sapientia`, `mercurius`, `humanitas`) triggered by `:root[data-cosmology="..."]`. However, `data-cosmology` is never set on `<html>`. A parallel `.atmo-*` class system on `<main>` fills the gap by setting `--cosmology-accent` directly — but 5 pages lack any atmosphere class.

## Changes

### 1. Create `components/cosmology-provider.tsx` (new)
A tiny client component (`"use client"`) that:
- Reads `usePathname()`
- Maps route prefix → cosmology value
- Sets `document.documentElement.dataset.cosmology` via `useEffect`

**Route map:** (values aligned with existing `.atmo-*` classes for consistency — outside-main elements match page content accent)

| Route | data-cosmology | atmo class | Color |
|---|---|---|---|
| `/` | `sapientia` | `atmo-observatory` | gold `#C79A4A` |
| `/articles`, `/articles/[slug]` | `psyche` | `atmo-magazine` | teal-blue `#6E93A8` |
| `/concepts`, `/concepts/[slug]` | `psyche` | `atmo-dictionary` | teal-blue `#6E93A8` |
| `/constellation` | `sapientia` | `atmo-observatory` | gold `#C79A4A` |
| `/schools`, `/schools/[slug]`, `/guide` | `mercurius` | `atmo-temple` | sage `#8AA395` |
| `/thinkers`, `/thinkers/[slug]` | `sapientia` | `atmo-biography` | gold `#C79A4A` |
| `/timeline` | `mercurius` | `atmo-museum` | sage `#8AA395` |
| `/sources` | `psyche` | `atmo-dictionary` | teal-blue `#6E93A8` |
| `/faq` | `sapientia` | `atmo-observatory` | gold `#C79A4A` |
| `/search` | `sapientia` | `atmo-observatory` | gold `#C79A4A` |
| `/reading-sets`, `/reading-sets/[slug]` | `psyche` | `atmo-dictionary` | teal-blue `#6E93A8` |
| `/external-links` | `mercurius` | `atmo-temple` | sage `#8AA395` |
| `/support` | `sapientia` | `atmo-biography` | gold `#C79A4A` |
| `/manifesto` | `sapientia` | `atmo-observatory` | gold `#C79A4A` |
| `/studio/*` | `mercurius` | (studio layout separate) | sage `#8AA395` |
| default | `sapientia` | — | gold `#C79A4A` |

**Matching logic:** exact match for leaf routes (`/`, `/faq`, `/search`, `/constellation`, `/guide`, `/sources`, `/support`, `/manifesto`, `/timeline`, `/external-links`, `/reading-sets`); `startsWith` for parameterized routes (`/articles/`, `/concepts/`, `/schools/`, `/thinkers/`, `/reading-sets/`, `/studio/`). `/articles` (exact) must not match `/articles/` (prefix) — handle both.

### 2. Wire into `app/layout.tsx`
Add `<CosmologyProvider />` inside `<body>` — renders nothing visually (fragment-only).

### 3. Add missing atmosphere classes on 5 pages
| Page | File | Add class |
|---|---|---|
| `/sources` | `app/sources/page.tsx` | `atmo-dictionary` |
| `/reading-sets` | `app/reading-sets/page.tsx` | `atmo-magazine` |
| `/external-links` | `app/external-links/page.tsx` | `atmo-temple` |
| `/support` | `app/support/page.tsx` | `atmo-biography` |
| `/manifesto` | `app/manifesto/page.tsx` | `atmo-observatory` |

## Visual Impact
- `SymbolicBackground` shows correct Unicode glyphs per cosmology (e.g. `⚜☸⬟⌘` for sapientia, `Ψ☤◎∼` for psyche)
- `glass-nav` border/tint shifts to match page accent
- Surface tints, border tints, glow tints all cascade from `data-cosmology`
- All 18+ routes get a distinct visual identity

## Non-goals (deferred to B/C)
- Merge `.atmo-*` with `data-cosmology` (keep both for now)
- Clean up CSS duplication
- Adjust spacing/typography
- Change card or component styles

## Files touched
```
components/cosmology-provider.tsx  (new)
app/layout.tsx                     (+1 import +1 element)
app/sources/page.tsx               (className: "atmo-dictionary")
app/reading-sets/page.tsx          (className: "atmo-magazine")
app/external-links/page.tsx        (className: "atmo-temple")
app/support/page.tsx               (className: "atmo-biography")
app/manifesto/page.tsx             (className: "atmo-observatory")
```
