"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  SearchIcon,
  CloseIcon,
  SourceIcon,
  ConceptIcon,
  PersonIcon,
} from "@/components/icons";
import type { KnowledgeRow } from "@/app/knowledge/page";
import { contentEntryHref, isLibraryEntry } from "@/lib/content/routing";

const FILTERS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "article", label: "บทความ" },
  { key: "concept", label: "แนวคิด" },
  { key: "thinker", label: "นักคิด" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

const TYPE_ICON = {
  article: SourceIcon,
  concept: ConceptIcon,
  thinker: PersonIcon,
} as const;

const TYPE_HREF: Record<string, (slug: string) => string> = {
  article: (slug) => contentEntryHref({ contentType: "article", slug }),
  concept: (slug) => contentEntryHref({ contentType: "concept", slug }),
  thinker: (slug) => contentEntryHref({ contentType: "person", slug }),
};

const TYPE_LABEL: Record<string, string> = {
  article: "บทความ",
  concept: "แนวคิด",
  thinker: "นักคิด",
};

const GROUP_TITLE: Record<string, string> = {
  article: "บทความ",
  concept: "คลังแนวคิด",
  thinker: "นักคิด",
};

type Props = {
  articles: Extract<KnowledgeRow, { type: "article" }>[];
  concepts: Extract<KnowledgeRow, { type: "concept" }>[];
  thinkers: Extract<KnowledgeRow, { type: "thinker" }>[];
};

export function KnowledgeIndex({ articles, concepts, thinkers }: Props) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const debouncedQuery = useDebounce(query, 200);

  const filtered = useMemo(() => {
    const all: KnowledgeRow[] = [...articles.filter(isLibraryEntry), ...concepts, ...thinkers];

    let result = all;

    if (activeFilter !== "all") {
      result = result.filter((r) => r.type === activeFilter);
    }

    const q = debouncedQuery.trim().toLowerCase();
    if (q.length > 0) {
      result = result.filter((r) => {
        const haystack = [
          r.title,
          "thaiTitle" in r ? r.thaiTitle ?? "" : "",
          r.description ?? "",
          "framework" in r ? r.framework ?? "" : "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    return result;
  }, [articles, concepts, thinkers, debouncedQuery, activeFilter]);

  const groups = useMemo(() => {
    const articleItems = filtered.filter((r) => r.type === "article");
    const conceptItems = filtered.filter((r) => r.type === "concept");
    const thinkerItems = filtered.filter((r) => r.type === "thinker");
    return { article: articleItems, concept: conceptItems, thinker: thinkerItems };
  }, [filtered]);

  const totalCount = filtered.length;

  return (
    <div>
      {/* Search + Filter bar */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-bg-card px-5 py-3.5 shadow-sm transition-all duration-300 focus-within:border-accent/30 focus-within:shadow-md focus-within:ring-1 focus-within:ring-accent/20">
          <SearchIcon className="h-5 w-5 shrink-0 text-accent" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาแนวคิด บทความ หรือนักคิด..."
            aria-label="ค้นหา"
            className="w-full bg-transparent text-base text-text-heading placeholder:text-text-secondary/50 focus-visible:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="ล้างคำค้น"
              className="rounded-md p-1 text-text-secondary/60 transition-colors hover:text-text-heading focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeFilter === f.key
                  ? "border-accent/40 bg-accent/10 text-accent shadow-sm"
                  : "border-border/60 bg-transparent text-text-secondary hover:border-text-heading/20 hover:bg-bg-elevated hover:text-text-heading"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-text-secondary/50">
            {totalCount} รายการ
          </span>
        </div>
      </div>

      {/* Content groups */}
      {(["article", "concept", "thinker"] as const).map((groupType) => {
        const items = groups[groupType];
        if (items.length === 0) return null;

        const Icon = TYPE_ICON[groupType];

        return (
          <section key={groupType} className="mb-10">
            <h2 className="mb-4 flex items-center gap-2.5 text-xs uppercase tracking-[0.12em] text-text-secondary/50">
              <Icon className="h-4 w-4" />
              {GROUP_TITLE[groupType]}
              <span className="text-text-secondary/30">— {items.length} รายการ</span>
            </h2>

            <div className="space-y-1.5">
              {items.map((row) => (
                <Link
                  key={`${row.type}-${row.slug}`}
                  href={TYPE_HREF[row.type](row.slug)}
                  className="group flex items-center gap-3 rounded-lg border border-border/15 bg-bg-card/50 px-4 py-3 transition-all duration-200 hover:-translate-x-0.5 hover:border-accent/20 hover:bg-bg-card hover:shadow-sm focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
                >
                  {/* Type badge */}
                  <span className="shrink-0 rounded-md border border-border/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.05em] text-text-secondary/50 transition-colors duration-200 group-hover:text-accent group-hover:border-accent/30">
                    {TYPE_LABEL[row.type]}
                  </span>

                  {/* Title */}
                  <span className="min-w-0 flex-1 font-serif text-sm font-medium text-text-heading truncate transition-colors duration-200 group-hover:text-accent">
                    {row.title}
                  </span>

                  {/* Metadata */}
                  {"framework" in row && row.framework ? (
                    <span className="hidden shrink-0 text-[11px] text-text-secondary/40 sm:inline">
                      {row.framework}
                    </span>
                  ) : null}
                  {row.type === "article" && "publishedAt" in row && row.publishedAt ? (
                    <span className="hidden shrink-0 text-[11px] text-text-secondary/40 sm:inline">
                      {new Date(row.publishedAt).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {totalCount === 0 && (
        <p className="py-12 text-center text-sm text-text-secondary/50">
          ไม่พบรายการที่ตรงกับคำค้นหา
        </p>
      )}
    </div>
  );
}
