"use client";

import { memo, useMemo, useState } from "react";
import type { SourceItem } from "@/types/content";
import { SearchIcon, CloseIcon, PrimarySourceIcon, SecondarySourceIcon, InterpretationIcon } from "@/components/icons";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface SourceItemWithId extends SourceItem {
  id: string;
}

const TYPE_LABEL: Record<string, string> = {
  "primary-source": "Primary Source / แหล่งต้นทาง",
  "secondary-source": "Secondary Source / งานอธิบาย",
  "editorial-interpretation": "Interpretation / การตีความ",
};

const TYPE_ACCENT: Record<string, string> = {
  "primary-source": "var(--color-premium)",
  "secondary-source": "var(--color-concept)",
  "editorial-interpretation": "var(--color-quote)",
};

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  "primary-source": PrimarySourceIcon,
  "secondary-source": SecondarySourceIcon,
  "editorial-interpretation": InterpretationIcon,
};

const SourceCard = memo(function SourceCard({
  s,
}: {
  s: SourceItemWithId;
}) {
  const accent = TYPE_ACCENT[s.sourceType] || "var(--color-text-secondary)";
  const IconComponent = TYPE_ICON[s.sourceType] || PrimarySourceIcon;
  const label = TYPE_LABEL[s.sourceType] || s.sourceType;

  return (
    <div
      className="group relative overflow-hidden archron-card flex flex-col justify-between gap-4 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/45 border-t-2"
      style={{ borderTopColor: accent } as React.CSSProperties}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <span
          className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card shrink-0 scale-90 transition-transform duration-300 group-hover:scale-100"
          style={{ borderColor: `color-mix(in srgb, ${accent} 26%, var(--color-border))`, color: accent }}
        >
          <IconComponent className="w-6 h-6" />
        </span>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span
              className="rounded px-2 py-0.5 text-sm font-medium text-text-secondary/80 font-mono"
              style={{
                color: accent,
                backgroundColor: `color-mix(in srgb, ${accent} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
              }}
            >
              {label}
            </span>
            {s.year && (
              <span className="text-xs font-mono text-text-secondary/50">ปีพิมพ์: {s.year}</span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold leading-snug text-text-heading group-hover:text-accent transition-colors">
            {s.title}
          </h3>

          {s.author && (
            <p className="text-sm text-text-body">
              ผู้สร้างสรรค์: <span className="text-accent font-medium">{s.author}</span>
            </p>
          )}
          {s.citationNote && (
            <p className="text-xs text-text-secondary leading-relaxed bg-bg-elevated/40 p-3 rounded border border-border/10">
              {s.citationNote}
            </p>
          )}
          {s.relatedClaim && (
            <div className="text-xs text-text-secondary/90 border-l-2 border-accent/40 pl-3 py-1 italic">
              ข้อความที่อ้างถึง: &ldquo;{s.relatedClaim}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export function SourcesBrowser({ sources }: { sources: SourceItemWithId[] }) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | "all">("all");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  const debouncedQuery = useDebounce(query, 200);
  const q = debouncedQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    return sources.filter((s) => {
      // กรองตามประเภท
      if (selectedType !== "all" && s.sourceType !== selectedType) {
        return false;
      }

      // กรองตามการค้นหา
      if (q) {
        const inTitle = s.title.toLowerCase().includes(q);
        const inAuthor = s.author?.toLowerCase().includes(q) || false;
        const inYear = s.year?.toLowerCase().includes(q) || false;
        const inNote = s.citationNote?.toLowerCase().includes(q) || false;
        const inClaim = s.relatedClaim?.toLowerCase().includes(q) || false;

        if (!inTitle && !inAuthor && !inYear && !inNote && !inClaim) {
          return false;
        }
      }

      return true;
    });
  }, [sources, selectedType, q]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedSources = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <div className="space-y-6">
      {/* กรองและค้นหา */}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        {/* ค้นหา */}
        <div className="flex items-center gap-3 rounded-lg border border-text-heading/12 bg-bg-card/60 px-4 py-2.5 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20 transition-colors">
          <SearchIcon className="h-5 w-5 text-accent" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อหนังสือ ผู้เขียน ปี หรือคำสำคัญ..."
            aria-label="ค้นหาแหล่งอ้างอิง"
            className="w-full bg-transparent text-sm text-text-heading focus-visible:outline-none placeholder:text-text-secondary/50"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPage(1);
              }}
              aria-label="ล้างคำค้น"
              className="rounded-md p-1 text-text-secondary hover:text-accent hover:bg-bg-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            >
              <CloseIcon className="h-4.5 w-4.5" />
            </button>
          ) : null}
        </div>

        {/* เลือกประเภทแหล่ง */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setPage(1);
          }}
          aria-label="กรองตามระดับแหล่งอ้างอิง"
          className="rounded-lg border border-text-heading/12 bg-bg-card/60 px-3 py-2.5 text-sm text-text-heading focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none focus:border-accent/45 transition-colors"
        >
          <option value="all">ระดับแหล่งอ้างอิงทั้งหมด</option>
          <option value="primary-source">Primary Source / แหล่งต้นทาง</option>
          <option value="secondary-source">Secondary Source / งานอธิบาย</option>
          <option value="editorial-interpretation">Interpretation / การตีความ</option>
        </select>
      </div>

      {/* ผลลัพธ์ */}
      <div className="text-xs text-text-secondary/60">
        พบแหล่งอ้างอิง {filtered.length} รายการ
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-text-heading/10 bg-bg-card/30 p-12 text-center text-text-secondary/50">
          ไม่พบข้อมูลอ้างอิงที่ตรงตามเงื่อนไข
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {paginatedSources.map((s) => (
            <SourceCard key={s.id} s={s} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
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
      )}
    </div>
  );
}
