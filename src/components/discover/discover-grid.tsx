"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ContentEntry } from "@/types/content";
import type { School } from "@/lib/content/schools";
import type { ConceptRegistryItem } from "@/lib/content/concept-registry";
import { ViewBadge } from "@/components/view-badge";

interface DiscoverGridProps {
  entries: ContentEntry[];
  schools: School[];
  concepts: ConceptRegistryItem[];
}

type DiscoverCategory =
  | "all"
  | "articles"
  | "concepts"
  | "thinkers"
  | "schools"
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
  schools: { label: "สำนักคิด", icon: "school", color: "var(--color-accent)" },
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

export function DiscoverGrid({ entries, schools, concepts }: DiscoverGridProps) {
  const [category, setCategory] = useState<DiscoverCategory>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();

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
    } else if (category === "thinkers" || category === "schools") {
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

  // Filter schools
  const filteredSchools = useMemo(() => {
    if (category !== "all" && category !== "schools") return [];

    let filtered = schools;
    if (q) {
      filtered = filtered.filter(
        (s) =>
          s.nameTh.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q) ||
          s.field?.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [schools, category, q]);

  // Filter concepts
  const filteredConcepts = useMemo(() => {
    if (category !== "all" && category !== "concepts") return [];

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

  // Extract unique thinkers from schools
  const filteredThinkers = useMemo(() => {
    if (category !== "all" && category !== "thinkers") return [];

    const thinkers = schools.flatMap((s) =>
      s.thinkers.map((t) => ({
        ...t,
        schoolNameTh: s.nameTh,
        schoolNameEn: s.nameEn,
        field: s.field,
      })),
    );

    if (q) {
      return thinkers.filter(
        (t) =>
          t.nameTh.toLowerCase().includes(q) ||
          t.nameEn.toLowerCase().includes(q) ||
          t.schoolNameTh.toLowerCase().includes(q),
      );
    }
    return thinkers.slice(0, 24);
  }, [schools, category, q]);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary inline-flex items-center justify-center w-4 h-4" aria-hidden="true">🔍</span>
          <input
            type="text"
            placeholder="ค้นหาบทความ แนวคิด นักคิด สำนักคิด..."
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
              <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[18px]" aria-hidden="true">
                {config.icon === "auto_stories" ? "📖" : config.icon === "menu_book" ? "📚" : config.icon === "bolt" ? "⚡" : config.icon === "school" ? "🎓" : config.icon === "person" ? "👤" : config.icon === "library_books" ? "📚" : "◆"}
              </span>
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-xs text-text-secondary">
        {category === "all" && (
          <span>
            {filteredEntries.length + filteredSchools.length + filteredConcepts.length + filteredThinkers.length} รายการ
          </span>
        )}
        {category === "articles" && <span>{filteredEntries.length} บทความ</span>}
        {category === "concepts" && <span>{filteredConcepts.length} แนวคิด</span>}
        {category === "thinkers" && <span>{filteredThinkers.length} นักคิด</span>}
        {category === "schools" && <span>{filteredSchools.length} สำนักคิด</span>}
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
                  key={thinker.nameEn}
                  href={`/thinkers/${thinker.nameEn.toLowerCase().replace(/\s+/g, "-")}`}
                  className="rounded-lg border border-border bg-bg-card p-3 transition-colors hover:border-thinker/30 hover:bg-bg-elevated"
                >
                  <h4 className="text-sm font-semibold text-text-heading">
                    {thinker.nameTh}
                  </h4>
                  <p className="text-xs text-text-secondary">{thinker.nameEn}</p>
                  <p className="mt-1 text-[10px] text-accent">
                    {thinker.schoolNameTh}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      {/* Schools Grid */}
      {(category === "all" || category === "schools") &&
        filteredSchools.length > 0 && (
          <div className="mb-12">
            {category === "all" && (
              <h3 className="mb-4 font-serif text-lg font-semibold text-text-heading">
                สำนักคิด
              </h3>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSchools.slice(0, category === "all" ? 6 : undefined).map((school) => (
                <Link
                  key={school.id}
                  href={`/schools/${school.id}`}
                  className="rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
                >
                  <h4 className="font-serif text-sm font-semibold text-text-heading">
                    {school.nameTh}
                  </h4>
                  <p className="text-xs text-text-secondary">{school.nameEn}</p>
                  <p className="mt-1 text-[10px] text-accent">{school.field}</p>
                  <p className="mt-2 line-clamp-2 text-xs text-text-secondary">
                    {school.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      {/* Empty State */}
      {filteredEntries.length === 0 &&
        filteredConcepts.length === 0 &&
        filteredThinkers.length === 0 &&
        filteredSchools.length === 0 &&
        category !== "timeline" && (
          <div className="py-12 text-center">
            <span className="mb-4 text-4xl text-text-secondary inline-flex items-center justify-center w-9 h-9" aria-hidden="true">🔍</span>
            <p className="text-sm text-text-secondary">
              ไม่พบเนื้อหาที่ตรงกับคำค้นหา
            </p>
          </div>
        )}
    </div>
  );
}
