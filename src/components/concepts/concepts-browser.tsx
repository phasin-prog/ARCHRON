"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { ConceptRegistryItem, NodeType } from "@/lib/content/core/registry";
import { ConceptCard } from "@/components/concepts/concept-card";
import { SearchIcon, CloseIcon } from "@/components/icons";

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
  const debouncedQuery = useDebounce(query, 200);
  const q = debouncedQuery.trim().toLowerCase();

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
        <div className="flex items-center gap-3 rounded-lg border border-text-heading/12 bg-bg-card/60 px-4 py-2.5 focus-within:border-accent/40 focus-within:ring-1 focus-within:ring-accent/20 transition-colors">
          <SearchIcon className="h-5 w-5 text-accent" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อแนวคิด คำแปล หรือคำอธิบายย่อ..."
            aria-label="ค้นหาแนวคิด"
            className="w-full bg-transparent text-sm text-text-heading focus-visible:outline-none placeholder:text-text-secondary/50"
          />
          {query ? (
            <button type="button" onClick={() => setQuery("")} aria-label="ล้างคำค้น" className="rounded-md p-1 text-text-secondary hover:text-accent hover:bg-bg-card focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none">
              <CloseIcon className="h-4.5 w-4.5" />
            </button>
          ) : null}
        </div>

        {/* เลือกประเภท */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as any)}
          aria-label="กรองตามประเภท"
          className="rounded-lg border border-text-heading/12 bg-bg-card/60 px-3 py-2.5 text-sm text-text-heading focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none focus:border-accent/45 transition-colors"
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
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary/60 border-b border-border/10 pb-4">
        <p>
          แสดง {filtered.length} รายการ (มีเนื้อหาแล้ว {realConcepts.length} · โครงร่าง {stubConcepts.length})
        </p>
        <button
          type="button"
          onClick={() => setShowStubs((prev) => !prev)}
          className="flex items-center gap-1.5 rounded border border-border/30 bg-bg-card/40 px-2.5 py-1 transition-colors hover:border-accent/40 hover:text-accent"
        >
          <span className="inline-flex items-center justify-center w-4 h-4 text-[16px]" aria-hidden="true">
            {showStubs ? "⊝" : "⊙"}
          </span>
          {showStubs ? "ซ่อนโครงร่างรอเขียน" : "แสดงโครงร่างรอเขียน"}
        </button>
      </div>

      {/* ส่วนที่ 1: รายการที่มีเนื้อหาแล้ว (เผยแพร่แล้ว) */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-semibold text-accent flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5" aria-hidden="true">✓</span>
          ชิ้นความรู้ที่เรียบเรียงแล้ว ({realConcepts.length})
        </h2>
        {realConcepts.length === 0 ? (
          <p className="rounded-md border border-text-heading/10 bg-bg-card/20 p-8 text-center text-sm text-text-secondary/50">
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
        <div className="mt-12 space-y-4 border-t border-border/20 pt-8">
          <h2 className="font-serif text-lg font-semibold text-text-secondary flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5" aria-hidden="true">⏳</span>
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
