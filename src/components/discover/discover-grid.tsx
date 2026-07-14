"use client";

import { useMemo, useState, memo } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import Link from "next/link";
import type { ContentEntry } from "@/types/content";
import type { ConceptRegistryItem } from "@/lib/content/core/registry";
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

  const debouncedQuery = useDebounce(query, 200);
  const q = debouncedQuery.trim().toLowerCase();

  // Filter entries by category and query
  const filteredEntries = useMemo(() => {
    if (category === "timeline") return [];

    let filtered = entries.filter((e) => e.status === "published");

    if (category === "articles") {
      filtered = filtered.filter((e) => e.contentType === "article");
    } else if (category === "concepts") {
      filtered = filtered.filter((e) => e.contentType !== "article");
    } else if (category === "books") {
      filtered = filtered.filter((e) => e.contentType === "book");
    } else if (category === "thinkers") {
      return [];
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

    return filtered.sort((a, b) => {
      const au = a.updatedAt ?? "";
      const bu = b.updatedAt ?? "";
      return bu.localeCompare(au);
    });
  }, [entries, category, q]);

  // Filter concepts
  const filteredConcepts = useMemo(() => {
    if (category !== "all" && category !== "concepts" && category !== "thinkers") return [];

    let filtered = concepts;
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.thaiTitle?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }
    return filtered.slice(0, 24);
  }, [concepts, category, q]);

  // Filter thinkers from concept registry
  const filteredThinkers = useMemo(() => {
    if (category !== "all" && category !== "thinkers") return [];

    let filtered = concepts.filter((c) => c.nodeType === "person");
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.thaiTitle?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q),
      );
    }
    return filtered.slice(0, 24);
  }, [concepts, category, q]);

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
            onChange={(e) => setQuery(e.target.value)}
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
              onClick={() => setCategory(cat)}
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
            {filteredEntries.length + filteredConcepts.length + filteredThinkers.length} รายการ
          </span>
        )}
        {category === "articles" && <span>{filteredEntries.length} บทความ</span>}
        {category === "concepts" && <span>{filteredConcepts.length} แนวคิด</span>}
        {category === "thinkers" && <span>{filteredThinkers.length} นักคิด</span>}
        {category === "books" && <span>{filteredEntries.length} หนังสือ</span>}
        {category === "timeline" && (
          <Link href="/timeline" className="text-accent hover:underline">
            ไปที่เส้นเวลา →
          </Link>
        )}
      </div>

      {/* Entries Grid */}
      {(category === "all" || category === "articles" || category === "books") &&
        filteredEntries.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                บทความล่าสุด
              </h3>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEntries.slice(0, category === "all" ? 6 : undefined).map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/articles/${entry.slug}`}
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
        filteredConcepts.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                คลังแนวคิด
              </h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredConcepts.slice(0, category === "all" ? 8 : undefined).map((concept) => (
                <Link
                  key={concept.slug}
                  href={`/concepts/${concept.slug}`}
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
        filteredThinkers.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                นักปราชญ์
              </h3>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredThinkers.slice(0, category === "all" ? 8 : undefined).map((thinker) => (
                <Link
                  key={thinker.slug}
                  href={`/thinkers/${thinker.slug}`}
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

      {/* Empty State */}
      {filteredEntries.length === 0 &&
        filteredConcepts.length === 0 &&
        filteredThinkers.length === 0 &&
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
