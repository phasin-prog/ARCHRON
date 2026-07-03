# ARCHRON Professional Web Architecture Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Phase 2 of the Professional Architecture Upgrade by implementing the `/timeline` (Intellectual History Timeline), `/discover` (Faceted Category Discovery Hub), and updating navigation components to seamlessly unify all 6 constitutional pillars (`PRD.md`, `Sitemap.md`, `VOS.md`, `SYMBOLS.md`, `AES.md`, `EDS.md`).

**Architecture:** Next.js 16 App Router, Tailwind CSS v4 design tokens, exact alignment with `Sitemap.md` v3.0 and `EDS.md` card genome.

---

### Task 1: Implement `/timeline` Intellectual History Portal (`Sitemap.md` v3.0)

**Files:**
- Create: `app/timeline/page.tsx`
- Create: `components/timeline/timeline-browser.tsx`

**Interfaces:**
- Consumes: Historical entries and thinker eras.
- Produces: Interactive historical timeline from Ancient Philosophy to Modern AI/Cognitive Science.

- [ ] **Step 1: Create client component `components/timeline/timeline-browser.tsx`**

Build interactive timeline categorized by era (Ancient Greece, Enlightenment, Psychoanalytic Revolution, Cognitive & AI Era).

- [ ] **Step 2: Create server page `app/timeline/page.tsx`**

Render `TimelineBrowser` inside `PageScaffold`.

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add app/timeline/page.tsx components/timeline/timeline-browser.tsx
git commit -m "feat(timeline): add interactive intellectual history timeline (/timeline)"
```

---

### Task 2: Implement `/discover` Faceted Category Portal (`Sitemap.md` v3.0)

**Files:**
- Create: `app/discover/page.tsx`
- Create: `components/discover/discover-grid.tsx`

**Interfaces:**
- Consumes: `getPublicEntries()`, `conceptRegistry`.
- Produces: Faceted visual discovery interface by discipline, difficulty level, and primary source type.

- [ ] **Step 1: Create client component `components/discover/discover-grid.tsx`**

Build visual multi-category discovery tool adhering to `EDS.md` card standards.

- [ ] **Step 2: Create server page `app/discover/page.tsx`**

Render `DiscoverGrid` inside `PageScaffold`.

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add app/discover/page.tsx components/discover/discover-grid.tsx
git commit -m "feat(discover): add faceted category discovery portal (/discover)"
```

---

### Task 3: Unify Global Navigation & Site Header

**Files:**
- Modify: `components/page-nav.tsx`
- Modify: `components/site-header.tsx`

**Interfaces:**
- Consumes: Route definitions.
- Produces: Complete integration of `/timeline` and `/discover` into site navigation.

- [ ] **Step 1: Update `PAGE_ORDER` in `components/page-nav.tsx`**

Add `/timeline` and `/discover`.

- [ ] **Step 2: Verify lint and build**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit changes**

```bash
git add components/page-nav.tsx components/site-header.tsx
git commit -m "feat(nav): integrate /timeline and /discover into navigation hierarchy"
```
