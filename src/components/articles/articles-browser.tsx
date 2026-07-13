"use client";

import { useMemo, useState, memo } from "react";
import type { ContentEntry } from "@/types/content";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { disciplineMeta, type DisciplineKey } from "@/components/discipline-meta";
import { ViewBadge } from "@/components/view-badge";
import Link from "next/link";
import { SearchIcon, CloseIcon, ArrowRightIcon, ClockIcon } from "@/components/icons";

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

const ArticleCard = memo(function ArticleCard({ entry }: { entry: ContentEntry }) {
  const discKey = frameworkToDiscipline(entry.framework);
  const meta = disciplineMeta(discKey);
  const bodyLen = entry.bodyMarkdown?.length ?? 0;
  const readMin = Math.max(1, Math.round(bodyLen / 1200));
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-5 rounded-3xl opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${meta.accent}1e, transparent 70%)`,
        }}
        aria-hidden
      />
      <Link
        href={`/articles/${entry.slug}`}
        className="archron-card archron-card--article group relative z-surface flex min-h-[260px] flex-col justify-between overflow-hidden p-6 sm:p-7 transition-all duration-300"
        style={
          {
            "--card-accent": meta.accent,
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
        <div className="relative z-surface">
          <div className="mb-4 flex items-center justify-between gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide border"
              style={{
                backgroundColor: `${meta.accent}14`,
                borderColor: `${meta.accent}33`,
                color: meta.accent,
              }}
            >
              {entry.framework ?? meta.label}
            </span>
            <span className="flex items-center gap-1 text-xs font-medium text-text-secondary/65">
              <ClockIcon className="h-3.5 w-3.5" />
              {readMin} นาที
            </span>
          </div>
          <h2 className="font-serif text-2xl font-medium leading-snug tracking-tight text-text-heading transition-colors duration-200 group-hover:text-[var(--card-accent)]">
            {entry.title}
          </h2>
          {entry.shortDescription ? (
            <p className="mt-3 text-sm leading-relaxed text-text-secondary line-clamp-3">
              {entry.shortDescription}
            </p>
          ) : null}
        </div>
        <div className="relative z-surface mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-text-secondary transition-colors group-hover:text-[var(--card-accent)]">
          <span>อ่านบทความและวิเคราะห์เชิงลึก</span>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border/40 transition-all duration-300 group-hover:border-[var(--card-accent)]/40 group-hover:bg-[var(--card-accent)]/10 group-hover:translate-x-0.5">
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
});

export function ArticlesBrowser({ articles }: { articles: ContentEntry[] }) {
  const [query, setQuery] = useState("");
  const [selectedFramework, setSelectedFramework] = useState<string | "all">("all");
  const [selectedTag, setSelectedTag] = useState<string | "all">("all");
  const [sortBy, setSortBy] = useState<"latest" | "title">("latest");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 24;
  const debouncedQuery = useDebounce(query, 200);
  const q = debouncedQuery.trim().toLowerCase();

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
        if (!inTitle && !inDesc && !inAuthor) return false;
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
        <div className="flex items-center gap-3 rounded-md border border-text-heading/12 bg-bg-card/60 px-4 py-2.5 focus-within:border-accent/45">
          <SearchIcon className="h-5 w-5 text-accent" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาบทความ..."
            aria-label="ค้นหาบทความ"
            className="w-full bg-transparent text-sm text-text-heading outline-none focus-visible:ring-2 focus-visible:ring-accent/30 placeholder:text-text-secondary/50"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="ล้างคำค้น" className="text-text-secondary hover:text-accent">
              <CloseIcon className="h-4.5 w-4.5" />
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
          className="rounded-md border border-text-heading/12 bg-bg-card/60 px-3 py-2.5 text-sm text-text-heading outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus:border-accent/45"
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
          className="rounded-md border border-text-heading/12 bg-bg-card/60 px-3 py-2.5 text-sm text-text-heading outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus:border-accent/45"
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
          className="rounded-md border border-text-heading/12 bg-bg-card/60 px-3 py-2.5 text-sm text-text-heading outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus:border-accent/45"
        >
          <option value="latest">เรียงล่าสุด</option>
          <option value="title">เรียงตามชื่อเรื่อง (ก-ฮ)</option>
        </select>
      </div>

      <div className="flex items-center justify-between text-xs text-text-secondary/60">
        <p>พบทั้งหมด {filtered.length} บทความ</p>
        {totalPages > 1 && (
          <p>
            หน้า {page} จาก {totalPages}
          </p>
        )}
      </div>

      {paginated.length === 0 ? (
        <div className="rounded-md border border-text-heading/10 bg-bg-card/30 p-12 text-center text-text-secondary/60">
          ไม่พบบทความที่ตรงกับการค้นหาหรือตัวกรองที่เลือก
        </div>
      ) : (
        <div className="grid gap-7 md:grid-cols-2">
          {paginated.map((e) => (
            <ArticleCard key={e.slug} entry={e} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="flex items-center gap-1 rounded-md border border-border/30 bg-bg-card/40 px-3 py-2 text-sm text-text-body hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:hover:border-border/30 disabled:hover:text-text-body"
          >
            <ArrowRightIcon className="h-4 w-4" style={{ transform: 'rotate(180deg)' }} />
            ก่อนหน้า
          </button>
          <span className="text-sm text-text-secondary/60">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="flex items-center gap-1 rounded-md border border-border/30 bg-bg-card/40 px-3 py-2 text-sm text-text-body hover:border-accent/40 hover:text-accent disabled:opacity-30 disabled:hover:border-border/30 disabled:hover:text-text-body"
          >
            ถัดไป
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
