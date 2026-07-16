"use client";

import { useMemo, useState, memo } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import Link from "next/link";
import type { ContentEntry } from "@/types/content";
import type { ConceptRegistryItem } from "@/lib/content/core/registry";
import { contentEntryHref, isLibraryEntry, registryNodeHref } from "@/lib/content/routing";
import { ViewBadge } from "@/components/view-badge";
import {
  SearchIcon,
  BookIcon,
  ConceptIcon,
  PersonIcon,
  CollectionIcon,
  SymbolIcon,
} from "@/components/icons";

function DiscoverCatIcon({ icon }: { icon: string }) {
  const className = "h-4 w-4 shrink-0 stroke-[1.75]";
  if (icon === "auto_stories") return <BookIcon className={className} aria-hidden="true" />;
  if (icon === "menu_book") return <BookIcon className={className} aria-hidden="true" />;
  if (icon === "bolt") return <ConceptIcon className={className} aria-hidden="true" />;
  if (icon === "person") return <PersonIcon className={className} aria-hidden="true" />;
  if (icon === "library_books") return <CollectionIcon className={className} aria-hidden="true" />;
  return <SymbolIcon className={className} aria-hidden="true" />;
}

interface DiscoverGridProps {
  entries: ContentEntry[];
  concepts: ConceptRegistryItem[];
}

type DiscoverCategory =
  | "all"
  | "articles"
  | "concepts"
  | "thinkers"
  | "books"
  | "timeline";

const CATEGORY_CONFIG: Record<
  DiscoverCategory,
  { label: string; icon: string; color: string }
> = {
  all: { label: "ทั้งหมด", icon: "apps", color: "var(--color-accent)" },
  articles: { label: "บทความ", icon: "article", color: "var(--color-accent)" },
  concepts: { label: "แนวคิด", icon: "psychology", color: "var(--color-concept)" },
  thinkers: { label: "นักคิด", icon: "person", color: "var(--color-thinker)" },
  books: { label: "หนังสือ", icon: "book", color: "var(--color-accent)" },
  timeline: { label: "เส้นเวลา", icon: "timeline", color: "var(--color-accent)" },
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "เริ่มต้น",
  intermediate: "กลาง",
  advanced: "ลึก",
  "source-note": "อ้างอิง",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  beginner: "var(--color-success)",
  intermediate: "var(--color-accent)",
  advanced: "var(--color-error)",
  "source-note": "var(--color-text-secondary)",
};

export function DiscoverGrid({ entries, concepts }: DiscoverGridProps) {
  const [category, setCategory] = useState<DiscoverCategory>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  const debouncedQuery = useDebounce(query, 200);
  const q = debouncedQuery.trim().toLowerCase();

  // Filter entries by category and query
  const { paginatedEntries, totalEntryPages, totalEntriesCount } = useMemo(() => {
    if (category === "timeline" || category === "concepts" || category === "thinkers") {
      return { paginatedEntries: [], totalEntryPages: 0, totalEntriesCount: 0 };
    }

    let filtered = entries.filter((entry) => entry.status === "published" && isLibraryEntry(entry));

    if (category === "articles") {
      filtered = filtered.filter((e) => e.contentType === "article");
    } else if (category === "books") {
      filtered = filtered.filter((e) => e.contentType === "book");
    }

    if (q) {
      filtered = filtered.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.shortDescription?.toLowerCase().includes(q) ||
          e.subtitle?.toLowerCase().includes(q) ||
          e.framework?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    filtered.sort((a, b) => {
      const au = a.updatedAt ?? "";
      const bu = b.updatedAt ?? "";
      return bu.localeCompare(au);
    });

    if (category === "all") {
      return { paginatedEntries: filtered.slice(0, 6), totalEntryPages: 1, totalEntriesCount: filtered.length };
    }

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    return {
      paginatedEntries: filtered.slice(start, start + ITEMS_PER_PAGE),
      totalEntryPages: totalPages,
      totalEntriesCount: filtered.length,
    };
  }, [entries, category, q, page]);

  // Filter concepts
  const { paginatedConcepts, totalConceptPages, totalConceptCount } = useMemo(() => {
    if (category !== "all" && category !== "concepts" && category !== "thinkers") {
      return { paginatedConcepts: [], totalConceptPages: 0, totalConceptCount: 0 };
    }

    let filtered = concepts;
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.thaiTitle?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }

    if (category === "all") {
      return { paginatedConcepts: filtered.slice(0, 8), totalConceptPages: 1, totalConceptCount: filtered.length };
    }

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    return {
      paginatedConcepts: filtered.slice(start, start + ITEMS_PER_PAGE),
      totalConceptPages: totalPages,
      totalConceptCount: filtered.length,
    };
  }, [concepts, category, q, page]);

  // Filter thinkers from concept registry
  const { paginatedThinkers, totalThinkerPages, totalThinkerCount } = useMemo(() => {
    if (category !== "all" && category !== "thinkers") {
      return { paginatedThinkers: [], totalThinkerPages: 0, totalThinkerCount: 0 };
    }

    let filtered = concepts.filter((c) => c.nodeType === "person");
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.thaiTitle?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }

    if (category === "all") {
      return { paginatedThinkers: filtered.slice(0, 8), totalThinkerPages: 1, totalThinkerCount: filtered.length };
    }

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    return {
      paginatedThinkers: filtered.slice(start, start + ITEMS_PER_PAGE),
      totalThinkerPages: totalPages,
      totalThinkerCount: filtered.length,
    };
  }, [concepts, category, q, page]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary stroke-[1.75]" aria-hidden="true" />
          <input
            type="text"
            placeholder="ค้นหาบทความ แนวคิด นักคิด..."
            aria-label="ค้นหา"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-border bg-bg-card py-3 pl-10 pr-4 text-sm text-text-heading placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_CONFIG) as DiscoverCategory[]).map((cat) => {
          const config = CATEGORY_CONFIG[cat];
          return (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                category === cat
                  ? "bg-accent/15 text-accent"
                  : "text-text-secondary hover:bg-bg-card hover:text-text-heading"
              }`}
            >
              <DiscoverCatIcon icon={config.icon} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs text-text-secondary">
        {category === "all" && (
          <span>
            {totalEntriesCount + totalConceptCount + totalThinkerCount} รายการ
          </span>
        )}
        {category === "articles" && <span>{totalEntriesCount} บทความ</span>}
        {category === "concepts" && <span>{totalConceptCount} แนวคิด</span>}
        {category === "thinkers" && <span>{totalThinkerCount} นักคิด</span>}
        {category === "books" && <span>{totalEntriesCount} หนังสือ</span>}
        {category === "timeline" && (
          <Link href="/timeline" className="text-accent hover:underline">
            ไปที่เส้นเวลา →
          </Link>
        )}
      </div>

      {/* Entries Grid */}
      {(category === "all" || category === "articles" || category === "books") &&
        paginatedEntries.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                รายการล่าสุด
              </h3>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedEntries.map((entry) => (
                <Link
                  key={entry.slug}
                  href={contentEntryHref(entry)}
                  className="group rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs text-text-secondary">{entry.framework}</span>
                    {entry.difficulty && (
                      <span
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${DIFFICULTY_COLOR[entry.difficulty]}20`,
                          color: DIFFICULTY_COLOR[entry.difficulty],
                        }}
                      >
                        {DIFFICULTY_LABEL[entry.difficulty]}
                      </span>
                    )}
                  </div>
                  <h4 className="mb-1 font-serif text-sm font-semibold text-text-heading transition-colors group-hover:text-accent">
                    {entry.title}
                  </h4>
                  <p className="line-clamp-2 text-xs text-text-secondary">
                    {entry.shortDescription || entry.subtitle}
                  </p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      {/* Concepts Grid */}
      {(category === "all" || category === "concepts") &&
        paginatedConcepts.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                คลังแนวคิด
              </h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedConcepts.map((concept) => (
                <Link
                  key={concept.slug}
                  href={registryNodeHref(concept.nodeType, concept.slug)}
                  className="rounded-lg border border-border bg-bg-card p-3 transition-colors hover:border-concept/30 hover:bg-bg-elevated"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          concept.nodeType === "concept"
                            ? "var(--color-concept)"
                            : concept.nodeType === "person"
                              ? "var(--color-thinker)"
                              : "var(--color-accent)",
                      }}
                    />
                    <span className="text-[10px] text-text-secondary">
                      {concept.nodeType === "concept"
                        ? "แนวคิด"
                        : concept.nodeType === "person"
                          ? "นักคิด"
                          : concept.nodeType === "school"
                            ? "สำนัก"
                            : concept.nodeType}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-heading">
                    {concept.thaiTitle || concept.title}
                  </h4>
                  {concept.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                      {concept.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      {/* Thinkers Grid */}
      {(category === "all" || category === "thinkers") &&
        paginatedThinkers.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                นักปราชญ์
              </h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedThinkers.map((thinker) => (
                <Link
                  key={thinker.slug}
                  href={registryNodeHref(thinker.nodeType, thinker.slug)}
                  className="rounded-lg border border-border bg-bg-card p-3 transition-colors hover:border-thinker/30 hover:bg-bg-elevated"
                >
                  <h4 className="text-sm font-semibold text-text-heading">
                    {thinker.thaiTitle || thinker.title}
                  </h4>
                  <p className="text-xs text-text-secondary">{thinker.title}</p>
                  {thinker.framework && (
                    <p className="mt-1 text-[10px] text-accent">
                      {thinker.framework}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

      {/* Pagination Controls */}
      {category !== "all" && (
        (() => {
          const totalPages =
            category === "articles" || category === "books"
              ? totalEntryPages
              : category === "concepts"
                ? totalConceptPages
                : category === "thinkers"
                  ? totalThinkerPages
                  : 0;
          if (totalPages <= 1) return null;
          return (
            <div className="mt-10 flex items-center justify-center gap-4 border-t border-border/10 pt-6 text-sm">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-border/40 bg-bg-card/60 px-4 py-2 font-medium text-text-heading transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
              >
                ก่อนหน้า
              </button>
              <span className="text-text-secondary">
                หน้า <strong className="font-semibold text-text-heading">{page}</strong> จาก {totalPages}
              </span>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-border/40 bg-bg-card/60 px-4 py-2 font-medium text-text-heading transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
              >
                ถัดไป
              </button>
            </div>
          );
        })()
      )}

      {/* Empty State */}
      {paginatedEntries.length === 0 &&
        paginatedConcepts.length === 0 &&
        paginatedThinkers.length === 0 &&
        category !== "timeline" && (
          <div className="py-12 text-center">
            <SearchIcon className="mx-auto mb-4 h-9 w-9 text-text-secondary/50 stroke-[1.5]" aria-hidden="true" />
            <p className="text-sm text-text-secondary">
              ไม่พบเนื้อหาที่ตรงกับคำค้นหา
            </p>
          </div>
        )}
    </div>
  );
}
