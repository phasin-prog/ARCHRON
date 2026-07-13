# Skeleton Shimmer Redesign — Implementation Plan

> **For agentic workers:** Execute tasks inline.

**Goal:** Replace `animate-pulse` with shimmer animation on skeleton loading states and fix undefined surface color tokens.

**Architecture:** Define `--color-surface-*` in `@theme` (globals.css), add shimmer CSS keyframe + `.skeleton-shimmer` class in feedback.css, update skeleton.tsx to use new class.

**Tech Stack:** Tailwind v4, CSS animations

## Global Constraints

- Must respect `prefers-reduced-motion`
- Must not touch any of the 31 `loading.tsx` files
- Shimmer highlight must use warm tones matching the SEP-inspired palette

---

### Task 1: Add surface colors to globals.css

**Files:**
- Modify: `src/app/globals.css` — insert into `@theme` block

Add three warm-gray surface tokens matching the page's sepia palette:

```
--color-surface-1: #EDEBE9;
--color-surface-2: #E3DFDB;
--color-surface-3: #D5D1CD;
```

Insert alphabetically after the existing `--color-bg-*` group.

### Task 2: Add shimmer animation to feedback.css

**Files:**
- Modify: `src/app/feedback.css` — append before the closing file

Add `@keyframes shimmer` + `.skeleton-shimmer` class.

### Task 3: Update skeleton.tsx

**Files:**
- Modify: `src/components/skeleton.tsx`

Replace every `animate-pulse rounded bg-surface-3` with `skeleton-shimmer`. Fix card wrapper `bg-surface-1/50` to `bg-surface-1/50` (now that colors are defined).
