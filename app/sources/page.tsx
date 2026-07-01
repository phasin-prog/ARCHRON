import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิง — ARCHRON",
};

const SOURCE_GROUPS = [
  // สีตาม Material Cosmology: ต้นทาง=Sapientia(ปัญญาต้นฉบับ) · อธิบาย=Psyche(วิเคราะห์) · ตีความ=Mercurius(สะพาน/การแปร)
  { title: "Primary Sources", desc: "งานต้นทางของนักคิดโดยตรง", accent: "#CBA45A" },
  { title: "Secondary Sources", desc: "งานอธิบายหรือศึกษาต่อยอด", accent: "#6E93A8" },
  { title: "Interpretation / Editorial", desc: "การตีความของเว็บ แยกออกจากข้อเท็จจริงและแหล่งต้นทาง", accent: "#8AA395" },
];

export default function SourcesPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="แหล่งอ้างอิง"
        title="ฐานความรู้และการอ้างอิง"
        lead="ทุกแนวคิดควรมีฐานรองรับ ที่นี่เราแยกแหล่งต้นทาง งานอธิบาย และการตีความออกจากกันอย่างชัดเจน"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {SOURCE_GROUPS.map((g) => (
            <article
              key={g.title}
              className="archron-card p-6"
            >
              <h2 className="font-serif text-lg" style={{ color: g.accent }}>{g.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{g.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <EmptyState
            icon="menu_book"
            title="ยังไม่มีบันทึกแหล่งอ้างอิงเผยแพร่"
          />
        </div>
      </section>
      <PageNav current="/sources" />
    </main>
  );
}
