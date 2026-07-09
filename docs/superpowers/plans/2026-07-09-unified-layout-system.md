# Unified Page Layout System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 86+ inconsistent max-width declarations across 70 files with a 4-tier `tpl-*` layout system, ensuring consistent responsive padding everywhere.

**Architecture:** 4 CSS layout tiers (reading/reference/content/dashboard) with unified responsive padding. Core components (`PageScaffold`, `PageHeader`, `PageNav`) and all pages adopt the `tpl-*` classes.

**Tech Stack:** CSS custom properties, Tailwind v4 utility classes, Next.js App Router components.

## Global Constraints

- **Thai-first**: All UI text in Thai
- **No new files**: Only modify existing files — no creating new components or CSS
- **Build must pass**: `npm run build` and `npm run lint` must be green after every batch
- **Follow existing patterns**: Use existing `tpl-*` CSS class convention, don't introduce new layout paradigms

---

### Task 1: Core CSS — `layout.css`

**Files:**
- Modify: `src/app/layout.css`

**Interfaces:**
- Consumes: `--width-reading: 760px`, `--width-reference: 980px`, `--width-dashboard: 1280px` (existing)
- Produces: New `--width-content: 1152px` + unified responsive padding for all 4 tiers

- [ ] **Step 1: Add `--width-content` token + `tpl-content` class**

```css
:root {
  --width-reading: 760px;
  --width-reference: 980px;
  --width-content: 1152px;
  --width-dashboard: 1280px;
}
```

```css
.tpl-content {
  max-width: var(--width-content);
  margin-left: auto; margin-right: auto;
  padding: 0 16px;
}
@media (min-width: 768px) {
  .tpl-content { padding: 0 24px; }
}
@media (min-width: 1024px) {
  .tpl-content { padding: 0 48px; }
}
```

- [ ] **Step 2: Add 1024px+ responsive padding to `tpl-reading`**

```css
.tpl-reading {
  max-width: var(--width-reading);
  margin-left: auto; margin-right: auto;
  padding: 0 16px;
}
@media (min-width: 768px) {
  .tpl-reading { padding: 0 24px; }
}
@media (min-width: 1024px) {
  .tpl-reading { padding: 0 48px; }
}
```

---

### Task 2: Core CSS — `spacing.css` + `grid.css`

**Files:**
- Modify: `src/app/spacing.css`
- Modify: `src/app/grid.css`

**Interfaces:**
- Consumes: `--space-*` tokens from `globals.css`, `--width-*` tokens from `layout.css`
- Produces: `--spacing-*` aliased to `--space-*`, `--margin-*` aligned with layout.css padding

- [ ] **Step 1: Alias `spacing.css` to use globals.css `--space-*`**

In `spacing.css`, replace the raw px values with references to `--space-*`:

```css
:root {
  --spacing-unit: 4px;
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: var(--space-2);      /* 8px */
  --spacing-3: var(--space-3);      /* 12px */
  --spacing-4: var(--space-4);      /* 16px */
  --spacing-5: 20px;
  --spacing-6: var(--space-5);      /* 24px */
  --spacing-8: var(--space-6);      /* 32px */
  --spacing-10: var(--space-7);     /* 40px */
  --spacing-12: var(--space-8);     /* 48px */
  --spacing-16: var(--space-9);     /* 64px */
  --spacing-20: var(--space-10);    /* 80px */
  --spacing-24: var(--space-11);    /* 96px */
  --spacing-32: var(--space-12);    /* 128px */
  --spacing-40: 160px;
  --spacing-48: 192px;
  --spacing-64: 256px;
  /* ... component/section spacing stays the same since they reference --spacing-* */
}
```

Leave `--spacing-1` (4px), `--spacing-5` (20px), `--spacing-40+` (160px+) as raw px since they don't map cleanly to 8pt grid.

- [ ] **Step 2: Align `grid.css` `--margin-*` with layout.css responsive padding**

Change `.grid-container` to use the same responsive padding as `tpl-*` classes:

```css
.grid-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 16px;
  padding-right: 16px;
}
@media (min-width: 768px) {
  .grid-container {
    padding-left: 24px;
    padding-right: 24px;
  }
}
@media (min-width: 1024px) {
  .grid-container {
    padding-left: 48px;
    padding-right: 48px;
  }
}
@media (min-width: 1280px) {
  .grid-container {
    padding-left: 48px;
    padding-right: 48px;
  }
}
```

Remove the `--margin-*` variables from `grid.css` (replace with the inline values above, since they're only used in `.grid-container`).

---

### Task 3: Core Components — PageScaffold, PageHeader, PageNav, PageSection

**Files:**
- Modify: `src/components/page-header.tsx:12`
- Modify: `src/components/page-nav.tsx:27`
- Modify: `src/components/page-scaffold.tsx:69`

**Interfaces:**
- Consumes: `tpl-reference` class from layout.css
- Produces: All content pages inherit consistent width + padding

- [ ] **Step 1: PageHeader — change `max-w-6xl px-6` → `tpl-reference`**

Change line 12:
```tsx
// Before:
<header className="scroll-reveal mx-auto max-w-6xl px-6 pb-10 pt-20">
// After:
<header className="scroll-reveal tpl-reference pb-10 pt-20">
```

Also change line 21:
```tsx
// Before: max-w-2xl
<p className="mt-5 max-w-2xl text-base leading-relaxed text-text-body">
// After:
<p className="mt-5 tpl-reference-child max-w-2xl ...">
```

Actually, keep `max-w-2xl` on the `<p>` since that's an inner element constraint, not a page layout constraint.

- [ ] **Step 2: PageNav — change `max-w-6xl px-6` → `tpl-reference`**

Line 27:
```tsx
// Before:
<nav className="mx-auto mt-20 max-w-6xl px-6" aria-label="นำทางระหว่างหน้า">
// After:
<nav className="tpl-reference mt-20" aria-label="นำทางระหว่างหน้า">
```

- [ ] **Step 3: PageScaffold PageSection — change `max-w-6xl px-6` → `tpl-reference`**

Line 69:
```tsx
// Before:
<section className={`scroll-reveal mx-auto max-w-6xl px-6 pb-14 ${className}`}>
// After:
<section className={`scroll-reveal tpl-reference pb-14 ${className}`}>
```

---

### Task 4: SiteHeader + SiteFooter

**Files:**
- Modify: `src/components/site-header.tsx:140`
- Modify: `src/components/site-footer.tsx:49,115`

- [ ] **Step 1: SiteHeader — replace `max-w-[1280px]` with `max-w-[--width-dashboard]`**

Line 140:
```tsx
// Before:
<div className="mx-auto max-w-[1280px] px-6">
// After:
<div className="mx-auto" style={{ maxWidth: "var(--width-dashboard)" }}>
```

Wait, Tailwind v4 should support `max-w-[--width-dashboard]` as an arbitrary value. Let me use:

```tsx
<div className="mx-auto" style={{ maxWidth: "var(--width-dashboard)" }}>
```

Actually in Tailwind v4, `max-w-[var(--width-dashboard)]` should work. But I'm not sure about CSS variable references in Tailwind arbitrary values. Let me use inline style to be safe.

```tsx
<div className="mx-auto px-6" style={{ maxWidth: "var(--width-dashboard)" }}>
```

- [ ] **Step 2: SiteFooter — replace `max-w-[1200px]` with layout variable**

Line 49 (main container):
```tsx
// Before:
<div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 px-4 sm:px-6 md:grid-cols-12 md:gap-x-14">
// After:
<div className="mx-auto grid max-w-[--width-content] grid-cols-1 gap-12 px-4 sm:px-6 md:grid-cols-12 md:gap-x-14">
```

Line 115 (bottom bar):
```tsx
// Before:
<div className="mx-auto mt-14 flex max-w-[1200px] ... px-4 sm:px-6 pt-8 sm:flex-row">
// After:
<div className="mx-auto mt-14 flex max-w-[--width-content] ... px-4 sm:px-6 pt-8 sm:flex-row">
```

Actually, I'm not sure Tailwind v4 supports `max-w-[--width-content]` arbitrary value syntax. Let me check - in Tailwind v4, the `max-w-[...]` arbitrary value should work with CSS variables. Let me use it directly:

```
max-w-(--width-content)
```

This is Tailwind v4 syntax for arbitrary CSS variable values. Actually, the standard Tailwind v4 way would be `max-w-[var(--width-content)]` or just `style={{maxWidth: 'var(--width-content)'}}`.

Let me just use `.grid-fixed` which already has `max-width: 1280px` in grid.css... no wait, that's 1280px, not 1152px.

I'll use inline style for these to be safe.

---

### Task 5: Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace hardcoded widths with `tpl-content`**

Line 37-38 (search):
Change wrapper from `max-w-[720px]` to something reasonable. Actually the search bar being 720px is a design choice (it should be narrower). Keep `max-w-[720px]` for the search bar itself but put it inside a `tpl-content` container.

Actually, looking at the homepage structure:
- Hero section (line 14): has `px-4` — this is fine for full-width hero
- Search bar (line 37): `max-w-[720px]` — intentionally narrow for search, keep
- Sections (lines 44, 49, 80): `mx-auto max-w-[1200px] px-6` — change to `tpl-content`

```tsx
// Before (line 44):
<section className="mx-auto mt-20 max-w-[1200px] px-6">
// After:
<section className="tpl-content mt-20">
```

Same for lines 49 and 80.

---

### Task 6: List Pages (max-w-6xl → tpl-reference)

**Files:** Replace `mx-auto max-w-6xl px-6` with `tpl-reference` in:

- `src/app/articles/page.tsx:36`
- `src/app/books/page.tsx:34`
- `src/app/concepts/page.tsx:36`
- `src/app/discover/page.tsx:35`
- `src/app/disciplines/page.tsx:27`
- `src/app/external-links/page.tsx:27`
- `src/app/icons/page.tsx:129`
- `src/app/reading-sets/page.tsx:33`
- `src/app/schools/page.tsx:31`
- `src/app/sources/page.tsx:42`
- `src/app/thinkers/page.tsx:42`
- `src/app/timeline/page.tsx:26`
- `src/app/profile/page.tsx:118`

And loading.tsx files:
- `src/app/articles/loading.tsx:6`
- `src/app/compare/loading.tsx:4`
- `src/app/constellation/loading.tsx:4`
- `src/app/discover/loading.tsx:4`
- `src/app/explore/loading.tsx:4`
- `src/app/knowledge/loading.tsx:4`
- `src/app/reading-sets/loading.tsx:4`
- `src/app/schools/loading.tsx:4`
- `src/app/profile/loading.tsx:9,15`

For loading.tsx files, they typically have a skeleton structure. Change `mx-auto max-w-6xl px-6` → `tpl-reference` and `mx-auto max-w-3xl px-6` → `tpl-reference`.

- [ ] **Step 1: All list pages**
- [ ] **Step 2: All loading.tsx files**

---

### Task 7: Content Pages (max-w-7xl/5xl → tpl-*)

**Files:**
- `src/app/explore/page.tsx:30` — `max-w-7xl` → `tpl-reference`
- `src/app/compare/page.tsx:30` — `max-w-7xl` → `tpl-reference`
- `src/app/knowledge/page.tsx:176` — `max-w-5xl` → `tpl-reference`
- `src/app/themes/page.tsx:25` — `max-w-5xl` → `tpl-reference`
- `src/app/themes/[slug]/page.tsx:49` — `max-w-5xl` → `tpl-reference`
- `src/app/faq/page.tsx:26` — `max-w-3xl` → `tpl-reference`
- `src/app/search/page.tsx:34` — `max-w-3xl` → `tpl-reference`

- [ ] **Step 1: Fix max-w-7xl/5xl/3xl pages**

---

### Task 8: Reading Pages (hardcoded px → tpl-reading)

**Files:**
- `src/app/reading-sets/[slug]/page.tsx:59,82,122,177,187` — `max-w-[760px]` → `tpl-reading`
- `src/components/reading/reading-page.tsx:301` — `max-w-[760px]` → `tpl-reading`
- `src/app/books/[slug]/page.tsx` — check if has hardcoded width
- `src/app/concepts/[slug]/page.tsx` — check if has hardcoded width
- `src/app/articles/[slug]/page.tsx` — check if has hardcoded width

- [ ] **Step 1: Fix reading pages**

---

### Task 9: Remaining hardcoded widths

**Files:** Remaining hardcoded px values in loading.tsx and misc pages:
- `src/app/books/[slug]/loading.tsx:4` — `max-w-[700px]`
- `src/app/concepts/[slug]/loading.tsx:4` — `max-w-[700px]`
- `src/app/manifesto/loading.tsx:4` — `max-w-[700px]`
- `src/app/themes/[slug]/loading.tsx:4` — `max-w-[800px]`
- `src/app/thinkers/[slug]/page.tsx:110` — check
- `src/app/thinkers/[slug]/loading.tsx:4` — `max-w-[800px]`
- `src/app/schools/[slug]/page.tsx:67` — `max-w-[900px]`
- `src/app/schools/[slug]/loading.tsx:4` — `max-w-[900px]`
- `src/app/schools/loading.tsx:4` — `max-w-[1100px]`
- `src/app/error.tsx:17` — `max-w-[720px]`
- `src/app/constellation/page.tsx:53` — `max-w-[1200px]`
- `src/app/studio/dashboard/page.tsx:183` — `max-w-[1200px]`

- [ ] **Step 1: Fix remaining loading.tsx and page files**

---

### Task 10: Verify

- [ ] **Step 1: Run `npm run lint`**
- [ ] **Step 2: Run `npm run build`**
