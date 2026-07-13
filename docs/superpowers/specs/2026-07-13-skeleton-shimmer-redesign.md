# Skeleton Shimmer Redesign — Design Spec

## Scope

Overhaul the skeleton loading system to use a **shimmer animation** instead of `animate-pulse`, and fix undefined `surface-*` color tokens. All 31 existing `loading.tsx` files continue to work unchanged.

## Problems Found

| Issue | Location | Impact |
|---|---|---|
| `--color-surface-1/2/3` undefined in `@theme` | `globals.css` | Skeleton bars get fallback/invisible colors |
| `animate-pulse` too subtle | `skeleton.tsx` + 31 loading files | No clear "loading" feeling |
| No shimmer/gradient effect | everywhere | Looks static, not alive |

## Files Changed (3 files)

### 1. `src/app/globals.css` — Add surface colors to `@theme`

```css
--color-surface-1: #EDEBE9;  /* Card skeleton bg — same as bg-elevated */
--color-surface-2: #E3DFDB;  /* Subtle hover/divider */
--color-surface-3: #D5D1CD;  /* Skeleton bar base — visible but quiet */
```

Warm tones matching the Sepia/Warm academic palette (`--color-bg: #F9F5F3`).

### 2. `src/app/feedback.css` — Add shimmer animation

```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-3);
  border-radius: 0.25rem;
}

.skeleton-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    color-mix(in srgb, var(--color-bg-card) 55%, transparent) 50%,
    transparent 100%
  );
  animation: shimmer 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer::after {
    animation: none !important;
    display: none;
  }
}
```

The shimmer highlight uses `color-mix` with the warm card white (`#FFFFFF` at 55% opacity) so it blends naturally with the warm page background.

### 3. `src/components/skeleton.tsx` — Use `.skeleton-shimmer` class

Replace every `animate-pulse rounded bg-surface-3` with `skeleton-shimmer`.

Changes:

- `SkeletonCard`: wrapper `bg-surface-1/50` → `bg-elevated/50`, all bars use `skeleton-shimmer`
- `SkeletonLine`: `animate-pulse rounded bg-surface-3` → `skeleton-shimmer`
- `SkeletonText`: delegates to `SkeletonLine` (no change needed)
- `SkeletonPageHeader`: all bars use `skeleton-shimmer`
- `SkeletonArticleContent`: all bars use `skeleton-shimmer`
- `SkeletonHomeHero`: all bars use `skeleton-shimmer`
- `SkeletonAccordion`: all bars use `skeleton-shimmer`
- `SkeletonIconGrid`: all bars use `skeleton-shimmer`
- `SkeletonGrid`: no change (wraps `SkeletonCard`)

### Not Changed

- 31 `loading.tsx` files (already use shared components)
- `role="status"` / `aria-label` — keep existing
- `aria-hidden="true"` — keep on individual bars
- Card border/shape/radius classes — keep as-is

## Animation Specs

| Property | Value |
|---|---|
| Duration | 2s |
| Easing | ease-in-out |
| Direction | LTR sweep |
| Gradient | transparent → card-white(55%) → transparent |
| Repetition | infinite |
| Reduced motion | flat color, no animation |

## Visual Behavior

- **Loading starts**: skeleton bars appear with `surface-3` warm gray base
- **During load**: a soft white sheen sweeps left-to-right across each bar continuously
- **Content arrives**: skeleton is replaced by actual content (standard React Suspense behavior)
- **Reduced motion**: static flat bars, no movement

## Convention Consistency

- Shimmer lives in `feedback.css` alongside spinner/dots/pulse-ring animation utilities
- Surface colors in `@theme` following the same naming convention as `--color-bg-elevated`
- `prefers-reduced-motion` guard already present in `feedback.css` (line 244+) — extend it
