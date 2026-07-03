"use client";

import { useMemo, useState } from "react";
import type { SourceItem } from "@/types/content";

interface SourceItemWithId extends SourceItem {
  id: string;
}

const TYPE_LABEL: Record<string, string> = {
  "primary-source": "Primary Source / แหล่งต้นทาง",
  "secondary-source": "Secondary Source / งานอธิบาย",
  "editorial-interpretation": "Interpretation / การตีความ",
};

const TYPE_ACCENT: Record<string, string> = {
  "primary-source": "#C79A4A", // Sapientia Gold
  "secondary-source": "#6E93A8", // Psyche Blue
  "editorial-interpretation": "#8AA395", // Mercurius Green
};

const TYPE_ICON_3D: Record<string, string> = {
  "primary-source": "source-primary",
  "secondary-source": "source-secondary",
  "editorial-interpretation": "interpretation",
};

export function SourcesBrowser({ sources }: { sources: SourceItemWithId[] }) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | "all">("all");

  const q = query.trim().toLowerCase();

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

  return (
    <div className="space-y-6">
      {/* กรองและค้นหา */}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        {/* ค้นหา */}
        <div className="flex items-center gap-3 rounded-md border border-ink/12 bg-surface-container/60 px-4 py-2.5 focus-within:border-burnished-gold/45">
          <span className="material-symbols-outlined text-[20px] text-burnished-gold">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อหนังสือ ผู้เขียน ปี หรือคำสำคัญ..."
            aria-label="ค้นหาแหล่งอ้างอิง"
            className="w-full bg-transparent text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 placeholder:text-on-surface-variant/50"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} className="text-on-surface-variant hover:text-soft-gold">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
        </div>

        {/* เลือกประเภทแหล่ง */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          aria-label="กรองตามระดับแหล่งอ้างอิง"
          className="rounded-md border border-ink/12 bg-surface-container/60 px-3 py-2.5 text-sm text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus:border-burnished-gold/45"
        >
          <option value="all">ระดับแหล่งอ้างอิงทั้งหมด</option>
          <option value="primary-source">Primary Source / แหล่งต้นทาง</option>
          <option value="secondary-source">Secondary Source / งานอธิบาย</option>
          <option value="editorial-interpretation">Interpretation / การตีความ</option>
        </select>
      </div>

      {/* ผลลัพธ์ */}
      <div className="text-xs text-on-surface-variant/60">
        พบแหล่งอ้างอิง {filtered.length} รายการ
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-md border border-ink/10 bg-surface-container/30 p-12 text-center text-on-surface-variant/50">
          ไม่พบข้อมูลอ้างอิงที่ตรงตามเงื่อนไข
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((s) => {
            const accent = TYPE_ACCENT[s.sourceType] || "#B9C2CE";
            const iconId = TYPE_ICON_3D[s.sourceType] || "source-primary";
            const label = TYPE_LABEL[s.sourceType] || s.sourceType;

            return (
              <div
                key={s.id}
                className="relative overflow-hidden archron-card flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:gap-6"
              >
                {/* แถบข้างระบุสี cosmology */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ backgroundColor: accent }}
                />

                {/* 3D ICON GRID */}
                <span
                  className="icon-tile shrink-0 scale-100"
                  style={{ borderColor: `color-mix(in srgb, ${accent} 26%, var(--color-slate-boundary))` }}
                >
                  <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": accent } as React.CSSProperties}>
                    <use href={`/icons/archron-icons.svg#${iconId}`} />
                  </svg>
                </span>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        color: accent,
                        backgroundColor: `${accent}16`,
                        border: `1px solid ${accent}33`,
                      }}
                    >
                      {label}
                    </span>
                    {s.year && (
                      <span className="text-xs font-mono text-on-surface-variant/50">ปีพิมพ์: {s.year}</span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-semibold leading-snug text-ivory">
                    {s.title}
                  </h3>

                  {s.author && (
                    <p className="text-sm text-soft-ivory">
                      ผู้สร้างสรรค์: <span className="text-soft-gold font-medium">{s.author}</span>
                    </p>
                  )}

                  {s.citationNote && (
                    <p className="text-xs text-on-surface-variant/80 leading-relaxed bg-white/[0.01] border border-slate-boundary/10 rounded p-2.5">
                      {s.citationNote}
                    </p>
                  )}

                  {s.relatedClaim && (
                    <p className="text-xs text-muted">
                      ◦ <span className="font-medium text-burnished-gold/80">ขอบเขตเนื้อหา:</span> {s.relatedClaim}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
