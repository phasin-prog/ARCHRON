# ARCHRON Professional Web Architecture Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Phase 1 of the Professional Architecture Upgrade by building the `/explore` discovery hub, standardizing the `ReadingPage` editorial layout (`760px`), and adding the `/compare` analytical portal.

**Architecture:** Next.js 16 App Router (RSC + Client Components), Tailwind v4 (`--color-*` tokens), strict adherence to `VOS.md`, `AES.md`, `EDS.md`, and `Sitemap.md` v3.0.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Lucide/Material Icons.

## Global Constraints

- Strict Thai-first UI language (`lang="th"`).
- No hardcoded hex values in frontend UI components outside dashboard exceptions; use CSS variable tokens (`var(--color-on-surface)`, `var(--accent)`, etc.).
- `npm run lint` and `npm test` must pass after every task commit.

---

### Task 1: Standardize ReadingPage Container Width (`760px` AES Standard)

**Files:**
- Modify: `components/reading/reading-page.tsx:285-300`

**Interfaces:**
- Consumes: `ContentEntry`
- Produces: Enhanced 760px (`max-w-[760px]`) reading container layout.

- [ ] **Step 1: Modify container grid classes in `components/reading/reading-page.tsx`**

Replace `max-w-6xl` and `max-w-2xl` / `42rem` with `max-w-7xl` and `max-w-[760px]` / `760px`:
```tsx
<div className="mx-auto grid max-w-7xl grid-cols-1 xl:grid-cols-[1fr_760px_1fr] xl:gap-8">
```
and:
```tsx
<main id="reading-article" className="w-full max-w-[760px] px-6 pb-24 pt-10 xl:mx-0 mx-auto">
```

- [ ] **Step 2: Verify lint passes**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Run existing reading tests**

Run: `npx vitest run tests/reading.spec.ts` (or equivalent unit tests)
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add components/reading/reading-page.tsx
git commit -m "refactor(reading): align container width to 760px AES standard"
```

---

### Task 2: Implement `/explore` Discovery Hub (Sitemap v3.0 Core Route)

**Files:**
- Create: `app/explore/page.tsx`
- Create: `components/explore/explore-hub.tsx`

**Interfaces:**
- Consumes: `getPublicEntries()` from `lib/content/public-source.ts`, `allEntrySlugs` from `lib/content/entries.ts`.
- Produces: Interactive discovery hub with Trending, Latest, Popular, and Random tabs.

- [ ] **Step 1: Create client component `components/explore/explore-hub.tsx`**

Build tab-based interactive explore hub displaying curated entries categorized by tab, featuring a "สุ่มค้นพบความรู้" (Random Discovery) action triggering Curiosity Psychology.

- [ ] **Step 2: Create server component `app/explore/page.tsx`**

Fetch public entries via `getPublicEntries()`, pass to `ExploreHub`. Set `export const revalidate = 300;`.

- [ ] **Step 3: Run linter and typecheck**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add app/explore/page.tsx components/explore/explore-hub.tsx
git commit -m "feat(explore): implement /explore discovery hub according to Sitemap v3.0"
```

---

### Task 3: Implement `/compare` Analytical Portal (Sitemap v3.0 Route)

**Files:**
- Create: `app/compare/page.tsx`
- Create: `components/compare/compare-matrix.tsx`

**Interfaces:**
- Consumes: `conceptRegistry` from `lib/content/concept-registry.ts`, `getPublicEntries()`.
- Produces: Side-by-side comparative analysis tool for philosophical concepts and thinkers.

- [ ] **Step 1: Create client component `components/compare/compare-matrix.tsx`**

Two-column interactive selection matrix allowing users to pick two concepts or thinkers to compare side-by-side (core definitions, schools, related concepts).

- [ ] **Step 2: Create server page `app/compare/page.tsx`**

Render `CompareMatrix` inside standard Archron PageHeader layout.

- [ ] **Step 3: Verify build and lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add app/compare/page.tsx components/compare/compare-matrix.tsx
git commit -m "feat(compare): add side-by-side comparative knowledge matrix (/compare)"
```
