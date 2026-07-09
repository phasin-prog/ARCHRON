# Skeleton Loading System — Design Spec

## Scope

Add `loading.tsx` to all 14 non-studio pages that currently lack one. Use shared skeleton layout components to ensure consistency and maintainability.

## Components (added to `src/components/skeleton.tsx`)

### `SkeletonPageHeader`
Simulates `PageScaffold` header: breadcrumb (3 thin bars), kicker (short), title (medium), lead/description (long).

Props:
- `kickerWidth?: string` — default `"w-20"`
- `titleWidth?: string` — default `"w-48"`
- `leadWidth?: string` — default `"w-96"`

### `SkeletonGrid`
Responsive card grid wrapping `SkeletonCard` items.

Props:
- `cols?: { sm?: number; md?: number; lg?: number }` — grid column config
- `count?: number` — default 6

### `SkeletonArticleContent`
Article/reading page layout: breadcrumb, meta pills, title, byline/subtitle, paragraph lines.

### `SkeletonHomeHero`
Centered wordmark block + 2 subtitle lines + search bar placeholder.

### `SkeletonAccordion`
Accordion list items (for FAQ): clickable header bars + hidden content area.

### `SkeletonIconGrid`
6-column icon grid (for `/icons` page): small square skeleton boxes.

## Page Mapping

| Page | Components |
|---|---|
| `/` | `SkeletonHomeHero` + `SkeletonGrid({ sm:2, lg:4 }, count=8)` |
| `/articles/[slug]` | `SkeletonArticleContent` |
| `/books` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |
| `/concepts` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |
| `/disciplines` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |
| `/external-links` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |
| `/faq` | `SkeletonPageHeader` + `SkeletonAccordion` |
| `/guide` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |
| `/icons` | `SkeletonPageHeader` + `SkeletonIconGrid` |
| `/sources` | `SkeletonPageHeader` + `SkeletonGrid({ md:3 }, count=3)` ×3 |
| `/support` | `SkeletonPageHeader` + `SkeletonGrid({ md:3 }, count=3)` |
| `/themes` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2 }, count=6)` |
| `/thinkers` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |
| `/timeline` | `SkeletonPageHeader` + `SkeletonGrid({ sm:2, lg:3 })` |

## Conventions

- All loading.tsx use `SkeletonPageHeader` (not inline header bars) — single source of truth
- Grid columns match the actual page's responsive grid
- `role="status"` + `aria-label="กำลังโหลดเนื้อหา"` on grid containers
- `aria-hidden="true"` on individual skeleton bars
- Reduced motion: `animate-pulse` already respects `prefers-reduced-motion` via Tailwind

## Files to Create

14 loading.tsx files, one per page listed above. No CSS changes needed.
