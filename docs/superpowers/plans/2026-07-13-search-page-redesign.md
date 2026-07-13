# Search Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `/search` page components in `search-client.tsx` to the Alexandria Library scholarly reading desk style.

**Architecture:** Single-file change to `src/components/search/search-client.tsx` — style-only rewrite of `SearchBar`, `TypeFilters`, and `SearchResults` memos. No logic changes, no new files, no new dependencies.

**Tech Stack:** React 19 + Tailwind v4 + TypeScript. Uses existing design tokens from `globals.css` (SEP palette: `--color-accent #8C1515`, warm neutrals).

## Global Constraints

- Thai-first: all UI text stays in Thai
- Use existing design tokens only (`--color-bg`, `--color-accent`, etc.) — no hardcoded colors
- No logic changes to search, filtering, or ranking
- Keep all existing prop types and interfaces
- Icons from `@/components/icons` only (SearchIcon, CloseIcon, ExternalLinkIcon)
- All motion must respect `prefers-reduced-motion`

---

### Task 1: SearchBar redesign

**Files:**
- Modify: `src/components/search/search-client.tsx` (lines 14-45)

**Interfaces:**
- Consumes: `SearchBar` props: `{ query: string; setQuery: (v: string) => void; clear: () => void }`
- Produces: Updated SearchBar styled per Alexandria spec

- [ ] **Step 1: Update SearchBar container**

Change the search bar container from:
```
flex items-center gap-3 rounded-lg border border-text-heading/12 bg-bg-card/60 px-4 py-3 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20 transition-colors
```
to:
```
flex items-center gap-3 rounded-xl border border-border bg-bg-card px-5 py-3.5 shadow-sm transition-all duration-300 focus-within:border-accent/30 focus-within:shadow-md focus-within:ring-1 focus-within:ring-accent/20
```

- [ ] **Step 2: Update input element**

Change the input from:
```
w-full bg-transparent text-base text-text-heading placeholder:text-text-secondary/50 focus-visible:outline-none
```
to:
```
w-full bg-transparent text-lg font-ui text-text-heading placeholder:text-text-secondary/50 focus-visible:outline-none
```

- [ ] **Step 3: Add clear button animation**

Add animate-presence wrapper for the clear button — on mount: `animate-in fade-in zoom-in-90 duration-200`, on unmount: `animate-out fade-out zoom-out-90 duration-200`. Keep the same hover/click styles.

- [ ] **Step 4: Run lint to verify**

```bash
npm run lint
```
Expected: no errors

---

### Task 2: TypeFilters redesign

**Files:**
- Modify: `src/components/search/search-client.tsx` (lines 47-82)

**Interfaces:**
- Consumes: `TypeFilters` props: `{ activeType: string; setActiveType: (v: string) => void }`, `SEARCH_TYPE_ORDER`, `SEARCH_TYPE_LABEL` from types
- Produces: Updated TypeFilters styled per Alexandria spec

- [ ] **Step 1: Update chip layout**

Change container from `mt-4 flex flex-wrap gap-2` to `mt-6 flex flex-wrap gap-3`

- [ ] **Step 2: Update chip styling**

Change the `chip` function from:
```tsx
const chip = (on: boolean) =>
  `rounded-full border px-3 py-1 text-xs transition-colors duration-200 ${
    on
      ? "border-accent/50 bg-accent/10 text-accent"
      : "border-text-heading/12 text-text-secondary hover:border-text-heading/25 hover:text-text-heading"
  }`;
```
to:
```tsx
const chip = (on: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-xs font-ui transition-all duration-200 ${
    on
      ? "border-accent/40 bg-accent-subtle text-accent shadow-sm"
      : "border-border/60 bg-transparent text-text-secondary hover:border-text-heading/20 hover:bg-bg-elevated hover:text-text-heading"
  } active:scale-[0.97]";
```

- [ ] **Step 3: Run lint to verify**

```bash
npm run lint
```
Expected: no errors

---

### Task 3: SearchResults redesign (section headers + result cards)

**Files:**
- Modify: `src/components/search/search-client.tsx` (lines 84-159)

**Interfaces:**
- Consumes: `SearchResults` props: `{ debouncedQuery: string; result: SearchResult }`, `SearchResult` type from types, `Link`, `SearchIcon`, `ExternalLinkIcon`
- Produces: Updated SearchResults styled per Alexandria spec

- [ ] **Step 1: Update result count**

Change from `mb-5 text-xs text-text-secondary/50` to `mb-6 text-xs text-text-secondary/50`

- [ ] **Step 2: Update section header with decorative line**

Replace:
```tsx
<h2 className="mb-3 text-xs font-semibold tracking-[0.05em] text-accent/70">
  {g.label} · {g.items.length}
</h2>
```
with:
```tsx
<div className="mb-4 flex items-center gap-3">
  <h2 className="text-xs font-semibold tracking-[0.05em] text-accent/70 whitespace-nowrap">
    {g.label} · {g.items.length}
  </h2>
  <span className="h-px flex-1 bg-accent/10" />
</div>
```

- [ ] **Step 3: Replace result list with individual cards**

Replace the `<ul className="divide-y...">` wrapper with individual card items:
```tsx
Change:
  <ul className="divide-y divide-ink/5 overflow-hidden rounded-md border border-text-heading/10">
    {g.items.map(({ item: it }) => {
      const inner = ( ... );
      const cls = "group block bg-bg-card/40 px-4 py-3 transition-colors hover:bg-bg-card";
      return (
        <li key={it.id}>
          {it.external ? <a href={it.href} target="..." className={cls}>{inner}</a> : <Link href={it.href} className={cls}>{inner}</Link>}
        </li>
      );
    })}
  </ul>

To:
  <div className="space-y-3">
    {g.items.map(({ item: it }) => {
      const inner = ( ... );
      const cls = "group block rounded-lg border border-border/50 bg-bg-card/60 px-5 py-4 transition-all duration-200 hover:border-accent/20 hover:shadow-sm hover:-translate-y-0.5 hover:border-l-2 hover:border-l-accent/40";
      return (
        <div key={it.id}>
          {it.external ? <a href={it.href} target="..." className={cls}>{inner}</a> : <Link href={it.href} className={cls}>{inner}</Link>}
        </div>
      );
    })}
  </div>
```

- [ ] **Step 4: Update result card inner content**

Change the title from:
```tsx
<span className="font-serif text-base text-text-heading group-hover:text-accent">
  {it.thaiTitle || it.title}
</span>
{it.thaiTitle && it.thaiTitle !== it.title ? (
  <span className="text-xs text-text-secondary/45">{it.title}</span>
) : null}
```
to:
```tsx
<span className="font-heading text-[1.05rem] text-text-heading group-hover:text-accent">
  {it.thaiTitle || it.title}
</span>
{it.thaiTitle && it.thaiTitle !== it.title ? (
  <span className="ml-2 text-xs text-text-secondary/45">{it.title}</span>
) : null}
```

Update description from:
```tsx
<p className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary/65">
```
to:
```tsx
<p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-body/70">
```

Update badge from:
```tsx
<span className="mt-2 inline-block text-[11px] text-text-secondary/45">
```
to:
```tsx
<span className="mt-2.5 inline-flex text-[11px] px-1.5 py-0.5 rounded-md bg-accent/5 text-accent/70">
```

- [ ] **Step 5: Run lint to verify**

```bash
npm run lint
```
Expected: no errors

---

### Task 4: Empty & No-results states

**Files:**
- Modify: `src/components/search/search-client.tsx` (lines 91-97)

**Interfaces:**
- Consumes: `debouncedQuery`, `result.total`
- Produces: Enhanced empty/no-results UI with suggestion pills

- [ ] **Step 1: Update empty query hint**

Replace:
```tsx
<p className="text-sm text-text-secondary/60">
  พิมพ์คำค้น เช่น &ldquo;เงา&rdquo;, &ldquo;Jung&rdquo;, &ldquo;ปรัชญา&rdquo;, &ldquo;IPA&rdquo; — ค้นได้ทั้งแนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ
</p>
```
with:
```tsx
<div className="py-8 text-center">
  <p className="text-sm text-text-secondary/50 mb-4">
    พิมพ์คำค้นด้านบนเพื่อค้นทั่วทั้งคลังความรู้
  </p>
  <div className="flex flex-wrap gap-2 justify-center">
    {["เงา", "Jung", "ปรัชญา", "IPA"].map((s) => (
      <button
        key={s}
        type="button"
        onClick={() => setQuery(s)}
        className="rounded-full border border-border/40 px-3 py-1 text-xs text-text-secondary/60 transition-colors duration-200 hover:bg-accent/8 hover:text-accent hover:border-accent/20"
      >
        {s}
      </button>
    ))}
  </div>
</div>
```

- [ ] **Step 2: Update no-results state**

Replace:
```tsx
<p className="text-sm text-text-secondary/60">ไม่พบผลลัพธ์สำหรับ &ldquo;{debouncedQuery.trim()}&rdquo;</p>
```
with:
```tsx
<div className="py-8 text-center">
  <p className="text-sm text-text-secondary/60 mb-4">ไม่พบผลลัพธ์สำหรับ &ldquo;{debouncedQuery.trim()}&rdquo;</p>
  <p className="text-xs text-text-secondary/45">ลองใช้คำค้นอื่น หรือตรวจสอบการสะกด</p>
</div>
```

Note: The empty state needs `setQuery` — pass it down through `SearchResults` props from `SearchClient`.

- [ ] **Step 3: Update SearchResults props**

Add `setQuery` to `SearchResults` props type and pass it from `SearchClient`:
```tsx
const SearchResults = memo(function SearchResults({
  debouncedQuery,
  result,
  setQuery,
}: {
  debouncedQuery: string;
  result: SearchResult;
  setQuery: (v: string) => void;
}) { ... });
```

In `SearchClient`:
```tsx
<SearchResults debouncedQuery={debouncedQuery} result={result} setQuery={setQuery} />
```

- [ ] **Step 4: Run lint to verify**

```bash
npm run lint
```
Expected: no errors

---

### Task 5: Verify build

**Files:**
- Test: full project build

- [ ] **Step 1: Run production build**

```bash
npm run build
```
Expected: build succeeds with no errors

- [ ] **Step 2: Run lint**

```bash
npm run lint
```
Expected: no lint errors

- [ ] **Step 3: Visual verification checklist**
  - Search bar renders with white card background, subtle border, rounded-xl
  - Focus state shows accent ring + shadow-md
  - Clear button fades in/out with scale animation
  - Type pills have correct default → hover → active states
  - Section headers have decorative accent line
  - Result cards show as individual bordered cards with hover lift
  - Hover shows left accent bar (border-l-2)
  - Empty state shows suggestion pills that fill search
  - No-results state shows friendly message
  - All existing search functionality works (typing, filtering, navigation)
