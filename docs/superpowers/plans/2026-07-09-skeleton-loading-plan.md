# Skeleton Loading System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add skeleton loading screens to all 14 non-studio pages using shared skeleton components.

**Architecture:** Extend `src/components/skeleton.tsx` with 6 new layout components (`SkeletonPageHeader`, `SkeletonGrid`, `SkeletonArticleContent`, `SkeletonHomeHero`, `SkeletonAccordion`, `SkeletonIconGrid`), then create one `loading.tsx` per page using composition.

**Tech Stack:** Next.js 16, React 19, Tailwind v4

## Global Constraints

- All skeleton bars use `animate-pulse rounded bg-surface-3` (Tailwind utility classes)
- Grid containers use `role="status"` + `aria-label="กำลังโหลดเนื้อหา"`
- Individual skeleton bars use `aria-hidden="true"`
- No new CSS files — only component and loading.tsx files
- Keep existing `SkeletonCard`, `SkeletonLine`, `SkeletonText`, `SkeletonGrid` components intact

---

### Task 1: Add 6 shared skeleton components to skeleton.tsx

**Files:**
- Modify: `src/components/skeleton.tsx` (append after existing `SkeletonGrid`)

- [ ] **Add SkeletonPageHeader**

```tsx
export function SkeletonPageHeader({
  kickerWidth = "w-20",
  titleWidth = "w-48",
  leadWidth = "w-96",
}: {
  kickerWidth?: string;
  titleWidth?: string;
  leadWidth?: string;
}) {
  return (
    <div className="mb-10 space-y-3" aria-hidden="true">
      <div className={`h-3 ${kickerWidth} animate-pulse rounded bg-surface-3`} />
      <div className={`h-8 ${titleWidth} animate-pulse rounded bg-surface-3`} />
      <div className={`h-5 ${leadWidth} animate-pulse rounded bg-surface-3`} />
    </div>
  );
}
```

- [ ] **Add SkeletonGrid**

```tsx
export function SkeletonGrid({
  cols = { sm: 2, lg: 3 },
  count = 6,
}: {
  cols?: { sm?: number; md?: number; lg?: number };
  count?: number;
}) {
  const colsClass = [
    cols.sm ? `sm:grid-cols-${cols.sm}` : "",
    cols.md ? `md:grid-cols-${cols.md}` : "",
    cols.lg ? `lg:grid-cols-${cols.lg}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`grid gap-4 ${colsClass}`}
      role="status"
      aria-label="กำลังโหลดเนื้อหา"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
```

- [ ] **Add SkeletonArticleContent**

```tsx
export function SkeletonArticleContent() {
  return (
    <div className="mx-auto max-w-[800px] space-y-4" aria-hidden="true">
      <div className="flex gap-2">
        <div className="h-5 w-16 animate-pulse rounded-full bg-surface-3" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-surface-3" />
        <div className="h-5 w-24 animate-pulse rounded-full bg-surface-3" />
      </div>
      <div className="h-10 w-3/4 animate-pulse rounded bg-surface-3" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-surface-3" />
      <div className="space-y-2 pt-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded bg-surface-3`}
            style={{ width: i === 7 ? "55%" : "100%" }}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Add SkeletonHomeHero**

```tsx
export function SkeletonHomeHero() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center" aria-hidden="true">
      <div className="mx-auto max-w-[720px] space-y-6">
        <div className="mx-auto h-12 w-64 animate-pulse rounded bg-surface-3" />
        <div className="mx-auto h-5 w-80 animate-pulse rounded bg-surface-3" />
        <div className="mx-auto h-5 w-56 animate-pulse rounded bg-surface-3" />
        <div className="mx-auto mt-8 h-12 w-full max-w-md animate-pulse rounded-lg bg-surface-3" />
      </div>
    </section>
  );
}
```

- [ ] **Add SkeletonAccordion**

```tsx
export function SkeletonAccordion({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border/20 p-4">
          <div className="h-5 w-3/4 animate-pulse rounded bg-surface-3" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Add SkeletonIconGrid**

```tsx
export function SkeletonIconGrid({ count = 24 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      role="status"
      aria-label="กำลังโหลดไอคอน"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 rounded-lg border border-border/20 p-4">
          <div className="h-10 w-10 animate-pulse rounded bg-surface-3" />
          <div className="h-3 w-16 animate-pulse rounded bg-surface-3" />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Verify skeleton.tsx builds**

Run: `npm run build`

Expected: No TypeScript errors

---

### Task 2: Create loading.tsx for all 14 pages

**Files:** Create 14 loading.tsx files

**Pattern reference — existing files use:**
```tsx
export default function PageNameLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <SkeletonPageHeader />
        <SkeletonGrid cols={{ sm: 2, lg: 3 }} count={6} />
      </div>
    </main>
  );
}
```

- [ ] **Create `/books` loading** — `src/app/books/loading.tsx`

```tsx
import { SkeletonPageHeader, SkeletonGrid } from "@/components/skeleton";

export default function BooksLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-6xl px-6 pt-16">
        <SkeletonPageHeader />
        <SkeletonGrid cols={{ sm: 2, lg: 3 }} count={6} />
      </div>
    </main>
  );
}
```

- [ ] **Create `/concepts` loading** — `src/app/concepts/loading.tsx`

Same as books, same grid.

- [ ] **Create `/disciplines` loading** — `src/app/disciplines/loading.tsx`

Same as books but `SkeletonGrid cols={{ sm: 2, lg: 3 }} count={12}`

- [ ] **Create `/external-links` loading** — `src/app/external-links/loading.tsx`

Same as books.

- [ ] **Create `/sources` loading** — `src/app/sources/loading.tsx`

Same as books but 3 sections of grid:
```tsx
<div className="space-y-12">
  <SkeletonPageHeader />
  <section><SkeletonGrid cols={{ md: 3 }} count={3} /></section>
  <section><SkeletonGrid cols={{ md: 3 }} count={3} /></section>
  <section><SkeletonGrid cols={{ md: 3 }} count={3} /></section>
</div>
```

- [ ] **Create `/support` loading** — `src/app/support/loading.tsx`

Same as books but `SkeletonGrid cols={{ md: 3 }} count={3}`

- [ ] **Create `/themes` loading** — `src/app/themes/loading.tsx`

Same as books but `SkeletonGrid cols={{ sm: 2 }} count={6}`

- [ ] **Create `/thinkers` loading** — `src/app/thinkers/loading.tsx`

Same as books.

- [ ] **Create `/timeline` loading** — `src/app/timeline/loading.tsx`

Same as books.

- [ ] **Create `/` (home) loading** — `src/app/loading.tsx`

```tsx
import { SkeletonHomeHero, SkeletonGrid } from "@/components/skeleton";

export default function HomeLoading() {
  return (
    <main>
      <SkeletonHomeHero />
      <div className="mx-auto max-w-[1200px] px-6 pb-24">
        <div className="mb-8 space-y-3">
          <div className="h-6 w-40 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-64 animate-pulse rounded bg-surface-3" />
        </div>
        <SkeletonGrid cols={{ sm: 2, lg: 4 }} count={8} />
      </div>
    </main>
  );
}
```

- [ ] **Create `/articles/[slug]` loading** — `src/app/articles/[slug]/loading.tsx`

```tsx
import { SkeletonArticleContent } from "@/components/skeleton";

export default function ArticleSlugLoading() {
  return (
    <main className="pb-24 pt-10">
      <SkeletonArticleContent />
    </main>
  );
}
```

- [ ] **Create `/faq` loading** — `src/app/faq/loading.tsx`

```tsx
import { SkeletonPageHeader, SkeletonAccordion } from "@/components/skeleton";

export default function FaqLoading() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <SkeletonPageHeader />
        <SkeletonAccordion count={5} />
      </div>
    </main>
  );
}
```

- [ ] **Create `/icons` loading** — `src/app/icons/loading.tsx`

```tsx
import { SkeletonIconGrid } from "@/components/skeleton";

export default function IconsLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 space-y-3">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-3" />
        <div className="h-5 w-72 animate-pulse rounded bg-surface-3" />
      </div>
      <SkeletonIconGrid count={24} />
    </main>
  );
}
```

- [ ] **Create `/guide` loading** — `src/app/guide/loading.tsx`

```tsx
import { SkeletonPageHeader, SkeletonGrid } from "@/components/skeleton";

export default function GuideLoading() {
  return (
    <main className="pb-24">
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <SkeletonPageHeader titleWidth="w-64" leadWidth="w-full" />
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <SkeletonGrid cols={{ sm: 2, lg: 3 }} count={6} />
      </section>
    </main>
  );
}
```

---

### Task 3: Verify build

- [ ] **Run build**

```bash
npm run build
```

Expected: Clean compile, no errors, all 14 new loading.tsx files recognized.

- [ ] **Run lint**

```bash
npm run lint
```

Expected: No ESLint errors.

- [ ] **Commit**

```bash
git add -A
git commit -m "feat: add skeleton loading screens to all non-studio pages"
```
