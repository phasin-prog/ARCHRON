"use client";

import { useMemo, useState } from "react";
import type { ConceptRegistryItem, NodeType } from "@/lib/content/concept-registry";
import { ConceptCard } from "@/components/concepts/concept-card";

interface ConceptsBrowserProps {
  concepts: ConceptRegistryItem[];
  publishedSlugs: string[];
}

const NODE_LABEL: Record<NodeType, string> = {
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

export function ConceptsBrowser({ concepts, publishedSlugs }: ConceptsBrowserProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<NodeType | "all">("all");
  const [showStubs, setShowStubs] = useState(true);

  const publishedSet = useMemo(() => new Set(publishedSlugs), [publishedSlugs]);
  const q = query.trim().toLowerCase();

  // กรองรายการทั้งหมดตามเงื่อนไข
  const filtered = useMemo(() => {
    return concepts.filter((c) => {
      // กรองตามประเภท node
      if (selectedType !== "all" && c.nodeType !== selectedType) {
        return false;
      }

      // กรองตามคำค้นหา
      if (q) {
        const inTitle = c.title.toLowerCase().includes(q);
        const inThai = c.thaiTitle?.toLowerCase().includes(q) || false;
        const inDesc = c.description?.toLowerCase().includes(q) || false;
        if (!inTitle && !inThai && !inDesc) return false;
      }

      return true;
    });
  }, [concepts, selectedType, q]);

  // แยกกลุ่มเนื้อหาจริง vs โครงร่าง
  const { realConcepts, stubConcepts } = useMemo(() => {
    const real: ConceptRegistryItem[] = [];
    const stub: ConceptRegistryItem[] = [];

    for (const c of filtered) {
      if (publishedSet.has(c.slug)) {
        real.push(c);
      } else {
        stub.push(c);
      }
    }

    // เรียงลำดับตามความสำคัญและตัวอักษร
    const sortFn = (a: ConceptRegistryItem, b: ConceptRegistryItem) => a.title.localeCompare(b.title, "th");
    return {
      realConcepts: real.sort(sortFn),
      stubConcepts: stub.sort(sortFn),
    };
  }, [filtered, publishedSet]);

  return (
    <div className="space-y-8">
      {/* แท่งค้นหาและตัวกรอง */}
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        {/* ค้นหา */}
        <div className="flex items-center gap-3 rounded-lg border border-ink/12 bg-surface-container/60 px-4 py-2.5 focus-within:border-burnished-gold/40 focus-within:ring-1 focus-within:ring-burnished-gold/20 transition-colors">
          <span className="material-symbols-outlined text-[20px] text-burnished-gold" aria-hidden="true">search</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อแนวคิด คำแปล หรือคำอธิบายย่อ..."
            aria-label="ค้นหาแนวคิด"
            className="w-full bg-transparent text-sm text-on-surface focus-visible:outline-none placeholder:text-on-surface-variant/50"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="ล้างคำค้น" className="rounded-md p-1 text-on-surface-variant hover:text-soft-gold hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-burnished-gold/40 focus-visible:outline-none">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
        </div>

        {/* เลือกประเภท */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          aria-label="กรองตามประเภท"
          className="rounded-lg border border-ink/12 bg-surface-container/60 px-3 py-2.5 text-sm text-on-surface focus-visible:ring-2 focus-visible:ring-burnished-gold/30 focus-visible:outline-none focus:border-burnished-gold/45 transition-colors"
        >
          <option value="all">ประเภททั้งหมด</option>
          {(Object.keys(NODE_LABEL) as NodeType[]).map((t) => (
            <option key={t} value={t}>
              {NODE_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      {/* สถิติตัวกรองปัจจุบัน */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-on-surface-variant/60 border-b border-slate-boundary/10 pb-4">
        <p>
          แสดง {filtered.length} รายการ (มีเนื้อหาแล้ว {realConcepts.length} · โครงร่าง {stubConcepts.length})
        </p>
        <button
          type="button"
          onClick={() => setShowStubs((prev) => !prev)}
          className="flex items-center gap-1.5 rounded border border-slate-boundary/30 bg-surface-container/40 px-2.5 py-1 transition-colors hover:border-burnished-gold/40 hover:text-soft-gold"
        >
          <span className="material-symbols-outlined text-[16px]">
            {showStubs ? "visibility_off" : "visibility"}
          </span>
          {showStubs ? "ซ่อนโครงร่างรอเขียน" : "แสดงโครงร่างรอเขียน"}
        </button>
      </div>

      {/* ส่วนที่ 1: รายการที่มีเนื้อหาแล้ว (เผยแพร่แล้ว) */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-burnished-gold flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">verified</span>
          ชิ้นความรู้ที่เรียบเรียงแล้ว ({realConcepts.length})
        </h2>
        {realConcepts.length === 0 ? (
          <p className="rounded-md border border-ink/10 bg-surface-container/20 p-8 text-center text-sm text-on-surface-variant/50">
            ยังไม่มีชิ้นความรู้ในกลุ่มนี้ที่ได้รับการเผยแพร่ (ค้นหาในกลุ่มโครงร่างเพิ่มเติมด้านล่าง)
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {realConcepts.map((c) => (
              <ConceptCard key={c.slug} c={c} hasRealContent={true} />
            ))}
          </div>
        )}
      </div>

      {/* ส่วนที่ 2: โครงร่างรอเขียน (Stubs) */}
      {showStubs && stubConcepts.length > 0 && (
        <div className="mt-12 space-y-4 border-t border-slate-boundary/20 pt-8">
          <h2 className="font-serif text-lg font-semibold text-muted flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">hourglass_empty</span>
            โครงร่างและบันทึกความรู้ย่อ ({stubConcepts.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stubConcepts.map((c) => (
              <ConceptCard key={c.slug} c={c} hasRealContent={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
