"use client";

import { useMemo, useState } from "react";
import type { ContentEntry } from "@/types/content";
import { disciplineMeta, type DisciplineKey } from "@/components/discipline-meta";
import { ViewBadge } from "@/components/view-badge";
import Link from "next/link";

function frameworkToDiscipline(framework?: string): DisciplineKey {
  if (!framework) return "philosophy";
  const fw = framework.toLowerCase();
  if (fw.includes("psychology") || fw.includes("psychoanalysis")) return "psychology";
  if (fw.includes("philosophy") || fw.includes("existentialism") || fw.includes("phenomenology")) return "philosophy";
  if (fw.includes("symbol") || fw.includes("myth")) return "symbol";
  if (fw.includes("anthropology")) return "anthropology";
  if (fw.includes("history")) return "history";
  if (fw.includes("language")) return "language";
  if (fw.includes("religion")) return "religion";
  if (fw.includes("science")) return "science";
  if (fw.includes("art")) return "art";
  if (fw.includes("ai") || fw.includes("future")) return "ai-future";
  if (fw.includes("civilization")) return "civilization";
  return "philosophy";
}

export function ArticlesBrowser({ articles }: { articles: ContentEntry[] }) {
  const [query, setQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "title">("latest");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 24;
  const q = query.trim().toLowerCase();

  // ดึงรายการ frameworks และ tags ทั้งหมดที่มี
  const frameworks = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.framework) set.add(a.framework);
    }
    return Array.from(set);
  }, [articles]);

  const tags = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a.tags) {
        a.tags.forEach((t) => set.add(t));
      }
    }
    return Array.from(set);
  }, [articles]);

  // คัดกรองและจัดเรียง
  const filtered = useMemo(() => {
    let result = articles.filter((a) => {
      // กรองตาม framework
      if (selectedFramework !== "all" && a.framework !== selectedFramework) {
        return false;
      }

      // กรองตาม tag
      if (selectedTag !== "all" && (!a.tags || !a.tags.includes(selectedTag))) {
        return false;
      }

      // กรองตามค้นหา
      if (q) {
        const inTitle = a.title.toLowerCase().includes(q);
        const inDesc = a.shortDescription?.toLowerCase().includes(q) || false;
        const inAuthor = a.author?.toLowerCase().includes(q) || false;
        const inBody = a.bodyMarkdown?.toLowerCase().includes(q) || false;
        if (!inTitle && !inDesc && !inAuthor && !inBody) return false;
      }

      return true;
    });

    // จัดเรียง
    if (sortBy === "latest") {
      result = [...result].sort((a, b) => {
        const dateA = a.publishedAt || a.updatedAt || "";
        const dateB = b.publishedAt || b.updatedAt || "";
        return dateB.localeCompare(dateA);
      });
    } else {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, "th"));
    }

    return result;
  }, [articles, selectedFramework, selectedTag, q, sortBy]);

  // คำนวณหน้า
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="space-y-6">
      {/* ส่วนกรองและค้นหา */}
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* ค้นหา */}
        <div className="flex items-center gap-3 rounded-md border border-ink/12 bg-surface-container/60 px-4 py-2.5 focus-within:border-burnished-gold/45">
          <span className="material-symbols-outlined text-[20px] text-burnished-gold">search</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาบทความ..."
            aria-label="ค้นหาบทความ"
            className="w-full bg-transparent text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 placeholder:text-on-surface-variant/50"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="text-on-surface-variant hover:text-soft-gold">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
        </div>

        {/* กรองศาสตร์ */}
        <select
          value={selectedFramework}
          onChange={(e) => {
            setSelectedFramework(e.target.value);
            setPage(1);
          }}
          aria-label="กรองตามศาสตร์วิชา"
          className="rounded-md border border-ink/12 bg-surface-container/60 px-3 py-2.5 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus:border-burnished-gold/45"
        >
          <option value="all">ศาสตร์วิชาทั้งหมด</option>
          {frameworks.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* กรองแท็ก */}
        <select
          value={selectedTag}
          onChange={(e) => {
            setSelectedTag(e.target.value);
            setPage(1);
          }}
          aria-label="กรองตามแท็ก"
          className="rounded-md border border-ink/12 bg-surface-container/60 px-3 py-2.5 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus:border-burnished-gold/45"
        >
          <option value="all">แท็กทั้งหมด</option>
          {tags.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>

        {/* จัดเรียง */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          aria-label="จัดเรียงลำดับ"
          className="rounded-md border border-ink/12 bg-surface-container/60 px-3 py-2.5 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus:border-burnished-gold/45"
        >
          <option value="latest">เรียงล่าสุด</option>
          <option value="title">เรียงตามชื่อเรื่อง (ก-ฮ)</option>
        </select>
      </div>

      {/* สถิติผลลัพธ์ */}
      <div className="flex items-center justify-between text-xs text-on-surface-variant/60">
        <p>พบทั้งหมด {filtered.length} บทความ</p>
        {totalPages > 1 && (
          <p>
            หน้า {page} จาก {totalPages}
          </p>
        )}
      </div>

      {/* ตารางแสดงผล */}
      {paginated.length === 0 ? (
        <div className="rounded-md border border-ink/10 bg-surface-container/30 p-12 text-center text-on-surface-variant/60">
          ไม่พบบทความที่ตรงกับการค้นหาหรือตัวกรองที่เลือก
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {paginated.map((e) => {
            const discKey = frameworkToDiscipline(e.framework);
            const meta = disciplineMeta(discKey);
            return (
              <Link
                key={e.slug}
                href={`/articles/${e.slug}`}
                className="archron-card group flex min-h-[220px] flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                {/* แถบข้างสี cosmology */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: meta.accent }}
                />

                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: meta.accent }}>
                        {e.framework ?? e.contentType}
                      </span>
                      <h2 className="font-serif text-xl text-ivory transition-colors group-hover:text-soft-gold">
                        {e.title}
                      </h2>
                    </div>
                    {/* 3D ICON GRID จาก sprite */}
                    <span className="icon-tile shrink-0 scale-90" style={{ borderColor: `color-mix(in srgb, ${meta.accent} 26%, var(--color-slate-boundary))` }}>
                      <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": meta.accent } as React.CSSProperties}>
                        <use href="/icons/archron-icons.svg#interpretation" />
                      </svg>
                    </span>
                  </div>

                  {e.shortDescription ? (
                    <p className="mt-3 text-sm leading-relaxed text-soft-ivory/80 line-clamp-3">
                      {e.shortDescription}
                    </p>
                  ) : null}

                  {e.tags && e.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {e.tags.map((t) => (
                        <span key={t} className="rounded bg-white/[0.02] px-1.5 py-0.5 text-[10px] text-muted border border-slate-boundary/10">
                          #{t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <span className="mt-5 flex items-center justify-between border-t border-slate-boundary/20 pt-4">
                  <span className="text-xs font-semibold flex items-center gap-1 transition-all duration-300 group-hover:gap-2" style={{ color: meta.accent }}>
                    อ่านบทความ <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                  </span>
                  <span className="flex items-center gap-3">
                    {e.author ? (
                      <span className="text-xs text-on-surface-variant/50">โดย {e.author}</span>
                    ) : null}
                    <ViewBadge slug={e.slug} />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {/* แถบแบ่งหน้า (Pagination) */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 rounded-md border border-slate-boundary/30 bg-surface-container/40 px-3 py-2 text-sm text-soft-ivory hover:border-burnished-gold/40 hover:text-soft-gold disabled:opacity-30 disabled:hover:border-slate-boundary/30 disabled:hover:text-soft-ivory"
          >
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            ก่อนหน้า
          </button>
          <span className="text-sm text-on-surface-variant/60">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 rounded-md border border-slate-boundary/30 bg-surface-container/40 px-3 py-2 text-sm text-soft-ivory hover:border-burnished-gold/40 hover:text-soft-gold disabled:opacity-30 disabled:hover:border-slate-boundary/30 disabled:hover:text-soft-ivory"
          >
            ถัดไป
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
