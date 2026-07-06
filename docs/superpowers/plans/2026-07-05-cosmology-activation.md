# Cosmology Activation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans.

**Goal:** Activate `data-cosmology` on `<html>` per route so SymbolicBackground, glass-nav, and surface tints respond to page context.

**Architecture:** Tiny client provider reads `usePathname()` → maps route to cosmology value → sets `document.documentElement.dataset.cosmology`. 5 pages get missing atmosphere classes added.

**Tech Stack:** Next.js App Router, TypeScript, React 19, Tailwind v4

## Global Constraints

- `"use client"` required for `usePathname()` and DOM access
- No new dependencies
- Route matching: exact match for leaf routes (`/`, `/faq`, `/search`), `startsWith` for param routes (`/articles/`, `/concepts/`)
- Do not add comments
- Thai-first: UI is Thai, keep English for brand names only

---

### Task 1: Create `components/cosmology-provider.tsx`

**Files:**
- Create: `components/cosmology-provider.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<CosmologyProvider />` (fragment-only, sets dataset.cosmology on mount + route change)

- [ ] **Step 1: Create the component**

Write to `components/cosmology-provider.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ROUTE_COSMOLOGY: Record<string, string> = {
  "/": "sapientia",
  "/faq": "sapientia",
  "/search": "sapientia",
  "/constellation": "sapientia",
  "/guide": "mercurius",
  "/sources": "psyche",
  "/support": "sapientia",
  "/manifesto": "sapientia",
  "/timeline": "mercurius",
  "/external-links": "mercurius",
  "/reading-sets": "psyche",
  "/reading-sets/[slug]": "psyche",
};

const PREFIX_MAP: [string, string][] = [
  ["/articles", "psyche"],
  ["/concepts", "psyche"],
  ["/schools", "mercurius"],
  ["/thinkers", "sapientia"],
  ["/reading-sets", "psyche"],
  ["/studio", "mercurius"],
];

function pathToCosmology(pathname: string): string {
  if (pathname in ROUTE_COSMOLOGY) return ROUTE_COSMOLOGY[pathname];
  for (const [prefix, cosmology] of PREFIX_MAP) {
    if (pathname.startsWith(prefix)) return cosmology;
  }
  return "sapientia";
}

export function CosmologyProvider() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.cosmology = pathToCosmology(pathname);
  }, [pathname]);

  return null;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: passes without error

---

### Task 2: Wire CosmologyProvider into `app/layout.tsx`

**Files:**
- Modify: `app/layout.tsx` (add import + element inside `<body>`)

- [ ] **Step 1: Add import**

After `import { SymbolicBackground } from "@/components/symbolic-background";`:
```tsx
import { CosmologyProvider } from "@/components/cosmology-provider";
```

- [ ] **Step 2: Add element inside `<body>`**

After `<SymbolicBackground />`:
```tsx
          <CosmologyProvider />
```

Expected insertion point (line 116 after SymbolicBackground):
```tsx
          <SkipToContent />
          <SymbolicBackground />
          <CosmologyProvider />
          <SiteHeader />
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: passes without error

---

### Task 3: Add `atmo-dictionary` to `/sources`

**Files:**
- Modify: `app/sources/page.tsx` (add to PageScaffold className)

- [ ] **Step 1: Add className prop to PageScaffold**

In `app/sources/page.tsx` (line 30), change `<PageScaffold` to `<PageScaffold className="atmo-dictionary"`:

```tsx
    <PageScaffold
      className="atmo-dictionary"
      breadcrumb={[
```

---

### Task 4: Add `atmo-magazine` to `/reading-sets`

**Files:**
- Modify: `app/reading-sets/page.tsx`

- [ ] **Step 1: Add className prop to PageScaffold**

In `app/reading-sets/page.tsx` (line 19), change `<PageScaffold` to `<PageScaffold className="atmo-magazine"`:

```tsx
    <PageScaffold
      className="atmo-magazine"
      breadcrumb={[
```

---

### Task 5: Add `atmo-temple` to `/external-links`

**Files:**
- Modify: `app/external-links/page.tsx`

- [ ] **Step 1: Add atmosphere class to `<main>`**

In `app/external-links/page.tsx` (line 14), change `<main className="px-6 pb-24 pt-10">` to:

```tsx
    <main className="atmo-temple px-6 pb-24 pt-10">
```

---

### Task 6: Add `atmo-biography` to `/support`

**Files:**
- Modify: `app/support/page.tsx`

- [ ] **Step 1: Add className prop to PageScaffold**

In `app/support/page.tsx` (line 19), change `<PageScaffold` to `<PageScaffold className="atmo-biography"`:

```tsx
    <PageScaffold
      className="atmo-biography"
      breadcrumb={[
```

---

### Task 7: Add `atmo-observatory` to `/manifesto`

**Files:**
- Modify: `app/manifesto/page.tsx`

- [ ] **Step 1: Add atmosphere class to `<main>`**

Both `<main>` elements in `app/manifesto/page.tsx` need `atmo-observatory`:

Line 137 — DB entry path:
```tsx
      <main className="atmo-observatory pb-24">
```

Line 155 — fallback path:
```tsx
    <main className="atmo-observatory pb-24">
```
