# Studio My Content Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/studio/my-content` page showing all user content in a card grid for easy editing selection.

**Architecture:** Single client component page using existing `listMyEntriesAction()` server action. Card grid with search, type/status filters. No new DB queries or components.

**Tech Stack:** Next.js 16 App Router (client component), React 19, Tailwind v4, TypeScript

**Global Constraints**
- Thai-first UI throughout
- Writer-only access (same guard as editor page)
- Use `contentTypeMeta` from `@/lib/content/cosmology` for type badges
- Follow dashboard patterns for styling (`archron-card`, spacing tokens)
- No new server actions or DB queries — reuse existing

---

### Task 1: Create `/studio/my-content` page

**Files:**
- Create: `src/app/studio/my-content/page.tsx`

**Interfaces:**
- Consumes: `listMyEntriesAction()` from `@/features/editor/actions` → `{ entries: ContentEntry[] }`
- Consumes: `contentTypeMeta()` from `@/lib/content/cosmology` → `{ icon, accent, label }`
- Consumes: `roleFromMetadata()`, `canWrite()` from `@/lib/content/roles`
- Produces: Page at `/studio/my-content` with card grid, filters, writer gate

- [ ] **Step 1: Create the page file**

Create `src/app/studio/my-content/page.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, canWrite } from "@/lib/content/roles";
import { contentTypeMeta } from "@/lib/content/cosmology";
import { listMyEntriesAction } from "@/features/editor/actions";
import { EditorIcon } from "@/components/studio/editor-icon";
import type { ContentEntry } from "@/types/content";

export default function StudioMyContentPage() {
  const { userId } = useAuth();
  const { user } = useUser();
  const role = roleFromMetadata(user?.publicMetadata);
  const writer = canWrite(role);

  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!userId || !writer) return;
    let active = true;
    (async () => {
      try {
        const { entries: data } = await listMyEntriesAction();
        if (active) setEntries(data);
      } catch {
        /* ignore */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [userId, writer]);

  const availableTypes = useMemo(() => {
    const types = new Set(entries.map((e) => e.contentType));
    return Array.from(types).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let result = [...entries];
    const q = search.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.slug.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((e) => e.contentType === typeFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }
    return result.sort((a, b) => {
      const da = a.updatedAt ?? a.publishedAt ?? "";
      const db = b.updatedAt ?? b.publishedAt ?? "";
      return db.localeCompare(da);
    });
  }, [entries, search, typeFilter, statusFilter]);

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      draft: "ฉบับร่าง",
      "needs-source-check": "รอตรวจ",
      "ready-to-publish": "พร้อมเผยแพร่",
      published: "เผยแพร่แล้ว",
      archived: "เก็บถาวร",
    };
    return map[s] ?? s;
  };

  const statusAccent = (s: string) => {
    const map: Record<string, string> = {
      draft: "var(--color-text-secondary)",
      "needs-source-check": "#B8860B",
      "ready-to-publish": "#5F8DCE",
      published: "#2E7D32",
      archived: "#8A8780",
    };
    return map[s] ?? "var(--color-text-secondary)";
  };

  if (!writer) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 text-accent">
          <EditorIcon name="edit_note" className="h-6 w-6" accent="var(--color-accent)" />
        </span>
        <h1 className="mt-6 font-serif text-2xl text-text-heading">ต้องมีสิทธิ์นักเขียน</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary/70">
          ขอเป็นนักเขียนได้จากหน้าโปรไฟล์
        </p>
        <Link
          href="/studio/profile"
          className="mt-6 inline-flex min-h-[44px] items-center justify-center gap-2 bg-accent px-6 py-2.5 text-sm font-semibold text-text-inverse hover:brightness-110 transition-all"
        >
          ไปที่โปรไฟล์
        </Link>
      </main>
    );
  }

  return (
    <main className="px-4 sm:px-6 pb-24 pt-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-text-secondary/80">
              Studio · เนื้อหาของฉัน
            </span>
            <h1 className="mt-2 font-serif text-3xl text-text-heading">
              เนื้อหาของฉัน
            </h1>
            <p className="mt-1 text-sm text-text-secondary/60">
              {entries.length} รายการ
            </p>
          </div>
          <Link
            href="/studio/editor"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-accent to-accent px-5 py-2.5 text-sm font-semibold text-text-inverse shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20"
          >
            <EditorIcon name="edit_note" className="h-[18px] w-[18px]" />
            เขียนใหม่
          </Link>
        </header>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อเรื่อง..."
            className="min-w-[200px] flex-1 rounded-lg border border-border/40 bg-bg/60 px-3 py-2 text-sm text-text-heading outline-none focus:border-accent/50"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-border/40 bg-bg/60 px-3 py-2 text-xs text-text-heading outline-none focus:border-accent/50"
          >
            <option value="all">ทุกประเภท</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>{contentTypeMeta(t).label}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border/40 bg-bg/60 px-3 py-2 text-xs text-text-heading outline-none focus:border-accent/50"
          >
            <option value="all">ทุกสถานะ</option>
            <option value="draft">ฉบับร่าง</option>
            <option value="published">เผยแพร่แล้ว</option>
            <option value="archived">เก็บถาวร</option>
          </select>
          <span className="text-xs text-text-secondary/40">
            {filtered.length} รายการ
          </span>
        </div>

        {/* Content grid */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="archron-card h-32 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="archron-card flex flex-col items-center gap-4 p-16 text-center">
            <span className="text-4xl text-text-secondary/40">
              <EditorIcon name="edit_note" className="h-12 w-12" />
            </span>
            <p className="text-sm text-text-secondary/60">
              {search || typeFilter !== "all" || statusFilter !== "all"
                ? "ไม่พบรายการที่ตรงกับตัวกรอง"
                : "ยังไม่มีเนื้อหา"}
            </p>
            {!search && typeFilter === "all" && statusFilter === "all" && (
              <Link
                href="/studio/editor"
                className="text-xs font-semibold text-accent hover:underline"
              >
                เริ่มเขียน
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => {
              const meta = contentTypeMeta(entry.contentType);
              return (
                <Link
                  key={entry.slug}
                  href={`/studio/editor?slug=${encodeURIComponent(entry.slug)}`}
                  className="archron-card archron-card--link group flex flex-col p-5 transition-all hover:-translate-y-0.5"
                >
                  {/* Type badge */}
                  <span
                    className="mb-3 inline-flex self-start rounded px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${meta.accent}18`,
                      color: meta.accent,
                    }}
                  >
                    {meta.label}
                  </span>

                  {/* Title */}
                  <h3 className="line-clamp-2 font-serif text-base font-medium text-text-heading group-hover:text-accent transition-colors">
                    {entry.title || entry.slug}
                  </h3>

                  {/* Description if available */}
                  {entry.shortDescription && (
                    <p className="mt-1.5 line-clamp-2 text-xs text-text-secondary/60">
                      {entry.shortDescription}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: `${statusAccent(entry.status)}15`,
                        color: statusAccent(entry.status),
                      }}
                    >
                      {statusLabel(entry.status)}
                    </span>
                    <span className="text-[10px] text-text-secondary/40">
                      {entry.updatedAt
                        ? new Date(entry.updatedAt).toLocaleDateString("th-TH", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify the build**

Run: `npm run lint`
Expected: No lint errors

Run: `npm run build`
Expected: Build succeeds

- [ ] **Step 3: Manual test**

Start dev server: `npm run dev`
Navigate to `/studio/my-content`
Expected:
- If not signed in → writer gate "ต้องมีสิทธิ์นักเขียน"
- If signed in as writer → grid of content cards
- Filter by type and status works
- Search filters by title
- Click card → navigates to `/studio/editor?slug=<slug>`
- "เขียนใหม่" button → `/studio/editor`

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-07-12-studio-my-content-page-design.md
git add docs/superpowers/plans/2026-07-12-studio-my-content-page.md
git add src/app/studio/my-content/page.tsx
git commit -m "feat(studio): add my-content page with card grid"
```
