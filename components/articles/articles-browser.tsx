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

const GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E";

export function ArticlesBrowser({ articles }: { articles: ContentEntry[] }) {
  const [query, setQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "title">("latest");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 24;
  const q = query.trim().toLowerCase();

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

  const filtered = useMemo(() => {
    let result = articles.filter((a) => {
      if (selectedFramework !== "all" && a.framework !== selectedFramework) {
        return false;
      }
      if (selectedTag !== "all" && (!a.tags || !a.tags.includes(selectedTag))) {
        return false;
      }
      if (q) {
        const inTitle = a.title.toLowerCase().includes(q);
        const inDesc = a.shortDescription?.toLowerCase().includes(q) || false;
        const inAuthor = a.author?.toLowerCase().includes(q) || false;
        const inBody = a.bodyMarkdown?.toLowerCase().includes(q) || false;
        if (!inTitle && !inDesc && !inAuthor && !inBody) return false;
      }
      return true;
    });

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
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

      <div className="flex items-center justify-between text-xs text-on-surface-variant/60">
        <p>พบทั้งหมด {filtered.length} บทความ</p>
        {totalPages > 1 && (
          <p>
            หน้า {page} จาก {totalPages}
          </p>
        )}
      </div>

      {paginated.length === 0 ? (
        <div className="rounded-md border border-ink/10 bg-surface-container/30 p-12 text-center text-on-surface-variant/60">
          ไม่พบบทความที่ตรงกับการค้นหาหรือตัวกรองที่เลือก
        </div>
      ) : (
        <div className="grid gap-7 md:grid-cols-2">
          {paginated.map((e) => {
            const discKey = frameworkToDiscipline(e.framework);
            const meta = disciplineMeta(discKey);
            const bodyLen = e.bodyMarkdown?.length ?? 0;
            const readMin = Math.max(1, Math.round(bodyLen / 1200));
            return (
              <div key={e.slug} className="relative">
                <div
                  className="pointer-events-none absolute -inset-5 rounded-3xl opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(ellipse at 50% 35%, ${meta.accent}22, transparent 70%)`,
                  }}
                  aria-hidden
                />

                <Link
                  href={`/articles/${e.slug}`}
                  className="archron-card group relative z-[1] flex min-h-[260px] flex-col overflow-hidden p-0 transition-all duration-300"
                  style={
                    {
                      "--cosmology-accent": meta.accent,
                      "--cosmology-accent-soft": `color-mix(in srgb, ${meta.accent} 70%, transparent)`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-repeat opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]"
                    style={{
                      backgroundImage: `url("${GRAIN_URL}")`,
                      backgroundSize: "256px 256px",
                    }}
                    aria-hidden
                  />

                  <div
                    className="h-[3px] w-full shrink-0"
                    style={{
                      background: `linear-gradient(to right, ${meta.accent}, color-mix(in srgb, ${meta.accent} 35%, transparent), transparent 80%)`,
                    }}
                  />

                  <div className="relative z-[2] flex flex-1 flex-col px-7 pt-6 pb-6">
                    <h2
                      className="font-serif text-[1.35rem] font-bold leading-snug text-ivory transition-colors duration-300 group-hover:text-soft-gold"
                    >
                      {e.title}
                    </h2>

                    {e.shortDescription ? (
                      <p className="mt-3 text-[0.82rem] leading-relaxed text-soft-ivory/60 line-clamp-2">
                        {e.shortDescription}
                      </p>
                    ) : null}

                    <div className="mt-auto pt-5">
                      <div className="flex items-center justify-between border-t border-slate-boundary/12 pt-4">
                        <span className="flex items-center gap-3 text-xs text-on-surface-variant/55">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {readMin} นาที
                          </span>
                          <span
                            className="inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold font-mono"
                            style={{
                              color: meta.accent,
                              backgroundColor: `color-mix(in srgb, ${meta.accent} 8%, transparent)`,
                            }}
                          >
                            {e.framework ?? meta.label}
                          </span>
                        </span>
                        <span
                          className="flex items-center gap-1.5 text-xs font-semibold transition-all duration-300 group-hover:gap-2.5"
                          style={{ color: meta.accent }}
                        >
                          อ่านบทความ
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

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
