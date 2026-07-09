# Unified Page Layout System

## Problem

The project has 86+ max-width declarations across 70+ files using 10+ different strategies (hardcoded px, Tailwind named tokens, CSS classes) — none of which use the `tpl-*` system defined in `layout.css`. Responsive padding varies per component. This causes visible inconsistencies in spacing and layout between pages.

## Solution: 4-Tier Layout System

### Tier Definitions

| Tier | Width | CSS Class | Used By |
|---|---|---|---|
| Reading | 760px | `tpl-reading` | Articles, concepts, reading pages |
| Reference | 980px | `tpl-reference` | List/index pages (articles, concepts, schools...) |
| Content | 1152px | `tpl-content` (new) | Homepage sections, compare, explore |
| Dashboard | 1280px | `tpl-dashboard` | Studio, admin |

### Responsive Padding (same for all tiers)

| Viewport | Padding |
|---|---|
| < 768px | 16px |
| 768px – 1023px | 24px |
| ≥ 1024px | 48px |

### Scope of Changes

**Phase 1 — Core CSS + Components (P0)**
- `layout.css` — add `tpl-content`, standardize all padding
- `spacing.css` — alias to use globals.css `--space-*`
- `grid.css` — align `--margin-*` with layout padding
- `page-scaffold.tsx` — `max-w-6xl px-6` → `tpl-reference`
- `page-header.tsx` — same
- `page-nav.tsx` — same
- `site-header.tsx` — `max-w-[1280px]` → `max-w-[--width-dashboard]`
- `site-footer.tsx` — `max-w-[1200px]` → `max-w-[--width-content]`

**Phase 2 — Content Pages (P1)**
- Homepage: `max-w-[720px]`, `max-w-[1200px]` → `tpl-content`
- 20+ list pages: `max-w-6xl`, `max-w-7xl`, `max-w-5xl` → appropriate `tpl-*` class
- Reading pages: hardcoded `max-w-[760px]` → `tpl-reading`

**Phase 3 — Polish (P2)**
- Clean up remaining hardcoded widths: loading.tsx files, error pages, etc.
- Z-index consistency pass (optional)

## Files Changed

~30 files total across CSS + components + pages.
