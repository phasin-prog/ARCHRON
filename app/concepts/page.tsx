import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { conceptRegistry, type NodeType } from "@/lib/content/concept-registry";
import { ConceptCard } from "@/components/concepts/concept-card";

export const metadata: Metadata = {
  title: "คลังแนวคิด — ARCHRON",
};

// ป้ายชนิด node (ภาษาไทย) — ใช้สรุปภาพรวมว่าคลังแนวคิดเป็น "ระบบความรู้" หลายชนิด
const NODE_LABEL: Record<NodeType, string> = {
  concept: "แนวคิด",
  person: "นักคิด",
  book: "หนังสือ",
  school: "สำนักคิด",
  symbol: "สัญลักษณ์",
  term: "คำศัพท์",
};

const NODE_ORDER: NodeType[] = ["concept", "person", "book", "school", "symbol", "term"];

export default function ConceptsPage() {
  // นับจำนวนตามชนิด node เพื่อแสดงภาพรวมของระบบความรู้ (ไม่ใช่แค่รายการบทความ)
  const counts = conceptRegistry.reduce<Record<string, number>>((acc, c) => {
    acc[c.nodeType] = (acc[c.nodeType] ?? 0) + 1;
    return acc;
  }, {});
  const breakdown = NODE_ORDER.filter((t) => counts[t]).map(
    (t) => `${NODE_LABEL[t]} ${counts[t]}`,
  );

  return (
    <main className="pb-24">
      <PageHeader
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          { label: "คลังความรู้", href: "/knowledge" },
          { label: "คลังแนวคิด" },
        ]}
        kicker="คลังแนวคิด / Wiki"
        title="แผนที่ความรู้ของจิตใจมนุษย์"
        lead="ไม่ใช่หมวดบทความ แต่เป็นระบบความรู้แบบเชื่อมโยง ที่พาผู้อ่านเดินจากแนวคิดหนึ่งไปยังอีกแนวคิดอย่างมีเหตุผล"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        {/* ภาพรวมระบบความรู้ — จำนวนรวมและองค์ประกอบตามชนิด node */}
        <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-slate-boundary/20 pb-4">
          <span className="text-sm text-soft-ivory">
            รวม {conceptRegistry.length} รายการในระบบความรู้
          </span>
          {breakdown.length > 0 ? (
            <span className="text-xs text-muted">{breakdown.join(" · ")}</span>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conceptRegistry.map((c) => (
            <ConceptCard key={c.slug} c={c} />
          ))}
        </div>
      </section>
      <PageNav current="/concepts" />
    </main>
  );
}
