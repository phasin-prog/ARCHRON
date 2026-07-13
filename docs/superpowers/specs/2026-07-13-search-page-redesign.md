# Search Page Redesign — ARCHRON (Alexandria Library)

Version: 1.0
Date: 2026-07-13
Status: Draft — pending user review
Approach: Alexandria Library (Scholarly Reading Desk)

---

## Context

Redesign the `/search` page — `SearchBar`, `TypeFilters`, and `SearchResults` components in `src/components/search/search-client.tsx` — to feel like an elegant scholarly "reading desk" in the Library of Alexandria. The current design is functional but flat and lacks visual warmth and hierarchy.

**Source materials:**
- `src/components/search/search-client.tsx` — current search components
- `src/features/search/` — search logic layer (unchanged)
- `src/app/search/page.tsx` — search page shell (uses `PageScaffold` + `atmo-observatory` class)
- `src/app/globals.css` — design tokens (SEP-inspired · warm off-white · Cardinal Red accent)

---

## Design Decisions

| Topic | Decision |
|-------|----------|
| Approach | Alexandria Library — warm, scholarly, elevated card-based design |
| Search bar | White card (`--color-bg-card`) with subtle border + focus glow |
| Type filters | Pills with dimension, active = accent bg + subtle shadow |
| Results | Index cards with hover elevation + left accent bar |
| Motion | Soft transitions (`duration-200~300`), stagger fade-in view |
| Color palette | SEP palette (full): `--color-accent #8C1515`, warm neutrals |

---

## Component Design

### SearchBar

**Container:**
- `bg-bg-card` (white card)
- `border border-border` (subtle border)
- `rounded-xl` (larger radius than current `rounded-lg`)
- `shadow-sm` resting → `shadow-md` on focus-within
- `transition-all duration-300` for smooth state changes
- `focus-within:border-accent/30` + `focus-within:ring-1 focus-within:ring-accent/20`
- Padding: `px-5 py-3.5` (slightly more spacious than current `px-4 py-3`)

**Icon:**
- `SearchIcon` at `h-5.5 w-5.5` → keep current size
- Color: `text-accent` (Cardinal Red)
- Margin-right: `gap-3` (same as current)

**Input:**
- `bg-transparent w-full`
- `text-lg font-ui text-text-heading` (slightly larger than current `text-base`)
- `placeholder:text-text-secondary/50`
- `focus-visible:outline-none`

**Clear button:**
- Same as current position (right side, conditionally rendered)
- `opacity-0` → `opacity-100` + `scale-90` → `scale-100` with `transition-all duration-200`
- `rounded-md p-1 text-text-secondary/60 hover:text-text-heading hover:bg-bg-elevated`

### TypeFilters

**Layout:**
- `flex flex-wrap gap-3` (wider gap than current `gap-2`)
- `mt-6` (more margin than current `mt-4`)

**Chip styles:**
- Default: `rounded-full border border-border/60 bg-transparent px-3.5 py-1.5 text-xs font-ui text-text-secondary transition-all duration-200`
- Hover: `border-text-heading/20 bg-bg-elevated text-text-heading`
- Active: `border-accent/40 bg-accent-subtle text-accent shadow-sm`
- Press: `scale-[0.97]` on active (click feedback)

### SearchResults

**Result count:**
- `text-xs text-text-secondary/50 mb-6` (more bottom margin)

**Section header:**
- Inline-flex with decorative separator line:
  ```
  flex items-center gap-3 mb-4
    <h2 class="text-xs font-semibold tracking-[0.05em] text-accent/70 whitespace-nowrap">
    <span class="h-px flex-1 bg-accent/10">
  ```
- Gives a clear "chapter/section" feeling

**Result card (each item):**
- Container: `block rounded-lg border border-border/50 bg-bg-card/60 px-5 py-4 transition-all duration-200 hover:border-accent/20 hover:shadow-sm hover:-translate-y-0.5 hover:border-l-2 hover:border-l-accent/40`
- Bottom margin: `mb-3` between cards
- Title: `font-heading text-[1.05rem] text-text-heading group-hover:text-accent`
- English title: `text-xs text-text-secondary/45 ml-2`
- Description: `mt-1.5 text-sm leading-relaxed text-text-body/70 line-clamp-2`
- Badge: `inline-flex mt-2.5 text-[11px] px-1.5 py-0.5 rounded-md bg-accent/5 text-accent/70`

**Section container:**
- Replace current `<ul className="divide-y divide-ink/5 overflow-hidden rounded-md border border-text-heading/10">` with individual card items (no list border, each card has its own border)

### Empty & No-Results States

**Empty query hint:**
- `text-sm text-text-secondary/50 text-center py-8`
- Suggestion pills below the hint: `flex flex-wrap gap-2 justify-center`
- Each pill: `rounded-full border border-border/40 px-3 py-1 text-xs text-text-secondary/60 hover:bg-accent/8 hover:text-accent hover:border-accent/20 transition-colors cursor-pointer`
- Clicking a pill fills the search bar with that term

**No results:**
- `text-sm text-text-secondary/60 text-center py-8`
- Followed by suggestion pills for alternative searches

---

## Motion & Interaction

| Element | Animation | Duration |
|---------|-----------|----------|
| Search bar focus glow | border + shadow | 300ms ease-out |
| Clear button appear | opacity + scale | 200ms ease-out |
| Filter chip active | border + bg + shadow | 200ms ease-out |
| Filter chip press | scale | 100ms |
| Result card hover | translateY + shadow + border | 200ms ease-out |
| Result list stagger | fade-in + translateY(8px) | 400ms ease-out, 80ms stagger |
| Section separator line | width expand on scroll reveal | 600ms ease-out |

All motion respects `prefers-reduced-motion`.

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/search/search-client.tsx` | Rewrite component styling per design spec above |
| (No other files — search logic, types, page scaffold unchanged) |

Note: `src/app/inputs.css` has `.archron-search` class utilities — those remain for other search inputs; this redesign is scoped to `SearchClient` only.

---

## Non-Goals

- No changes to search logic, indexing, ranking, or data flow
- No changes to `HomeSearch`, `QuickOpen`, or site header search
- No changes to `PageScaffold`, breadcrumbs, or page layout
- No new dependencies or icons
