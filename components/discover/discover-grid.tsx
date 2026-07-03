"use client";

import { useState, useMemo } from "react";
import type { ContentEntry, Difficulty } from "@/types/content";
import { disciplineMeta, type DisciplineKey } from "@/components/discipline-meta";
import Link from "next/link";
import { ArrowRightIcon, BookIcon, ConceptIcon } from "@/components/icons";

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
  return "philosophy";
}

export function DiscoverGrid({ entries }: { entries: ContentEntry[] }) {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const disciplines: { id: string; label: string }[] = [
    { id: "all", label: "ทุกสาขาวิชา" },
    { id: "psychology", label: "จิตวิทยา & จิตวิเคราะห์" },
    { id: "philosophy", label: "ปรัชญา & อัตถิภาวนิยม" },
    { id: "symbol", label: "สัญลักษณ์ & ปรัมปราวิทยา" },
    { id: "science", label: "วิทยาศาสตร์ & ประสาทวิทยา" },
  ];

  const difficulties: { id: string; label: string }[] = [
    { id: "all", label: "ทุกระดับความยาก" },
    { id: "beginner", label: "ผู้เริ่มต้น (Beginner)" },
    { id: "intermediate", label: "ระดับกลาง (Intermediate)" },
    { id: "advanced", label: "อ่านเชิงลึก (Advanced)" },
  ];

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (selectedDiscipline !== "all") {
        const discKey = frameworkToDiscipline(e.framework);
        if (discKey !== selectedDiscipline) return false;
      }
      if (selectedDifficulty !== "all" && e.difficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    });
  }, [entries, selectedDiscipline, selectedDifficulty]);

  return (
    <div className="space-y-8">
      {/* Faceted Filter Bar */}
      <div className="grid gap-4 sm:grid-cols-2 rounded-xl bg-surface-container/40 p-4 border border-ink/10">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
            กรองตามสาขาวิชาหลัก
          </label>
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="w-full rounded-md border border-ink/20 bg-surface-container px-3 py-2 text-sm text-ivory outline-none focus:border-burnished-gold"
          >
            {disciplines.map((d) => (
              <option key={d.id} value={d.id}>{d.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-widest text-muted mb-1.5">
            ระดับความลึกซึ้งในการอ่าน
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full rounded-md border border-ink/20 bg-surface-container px-3 py-2 text-sm text-ivory outline-none focus:border-burnished-gold"
          >
            {difficulties.map((df) => (
              <option key={df.id} value={df.id}>{df.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* สถิติผลลัพธ์ */}
      <div className="flex items-center justify-between text-xs text-muted border-b border-ink/10 pb-2">
        <span>ค้นพบทั้งหมด {filteredEntries.length} รายการ</span>
        <span>จัดแสดงตามรหัสพันธุกรรม EDS.md (6-Layer Genome)</span>
      </div>

      {/* Grid การ์ดมาตรฐาน EDS.md */}
      {filteredEntries.length === 0 ? (
        <div className="rounded-xl border border-ink/10 bg-surface-container/30 p-12 text-center text-sm text-muted">
          ไม่พบเนื้อหาที่ตรงกับเงื่อนไขการค้นพบที่เลือก
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEntries.map((e) => {
            const discKey = frameworkToDiscipline(e.framework);
            const meta = disciplineMeta(discKey);
            const href = e.contentType === "concept" ? `/concepts/${e.slug}` : `/articles/${e.slug}`;

            return (
              <Link
                key={e.slug}
                href={href}
                className="archron-card group relative flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-burnished-gold/50"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-[3px] rounded-l"
                  style={{ backgroundColor: meta.accent }}
                />

                <div className="space-y-3">
                  {/* Layer 1: Identity */}
                  <div className="flex items-center justify-between gap-2 text-[11px] font-medium tracking-wider text-muted">
                    <span className="uppercase font-semibold" style={{ color: meta.accent }}>
                      {e.framework ?? e.contentType}
                    </span>
                    <span className="rounded bg-surface-container/80 px-2 py-0.5 text-[10px] text-on-surface-variant uppercase">
                      {e.difficulty}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg leading-snug text-ivory transition-colors group-hover:text-soft-gold">
                    {e.title}
                  </h3>

                  {/* Layer 2: Context */}
                  {e.subtitle && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                      {e.subtitle}
                    </p>
                  )}
                </div>

                {/* Layer 5 & 6: Evidence & Navigation */}
                <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-3 text-xs text-muted">
                  <span className="truncate max-w-[140px]">{e.mainThinkers?.[0] ?? "ARCHRON Library"}</span>
                  <span className="inline-flex items-center gap-1 text-soft-gold opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                    เข้าสู่เนื้อหา
                    <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
