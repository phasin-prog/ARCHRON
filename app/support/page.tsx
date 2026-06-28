import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "สนับสนุน — ARCHRON",
};

const WAYS = [
  { title: "อ่านอย่างตั้งใจ", desc: "ใช้เวลากับเนื้อหา อ่านแหล่งอ้างอิง และแยกข้อเท็จจริงจากการตีความ" },
  { title: "แบ่งปันอย่างมีบริบท", desc: "ส่งต่อแนวคิดพร้อมบริบทเดิม ไม่ตัดทอนให้กลายเป็นคำคม" },
  { title: "ตั้งคำถามและทักท้วง", desc: "ช่วยให้คลังความรู้นี้รับผิดชอบต่อความถูกต้องมากขึ้น" },
];

export default function SupportPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="สนับสนุน"
        title="สนับสนุนการเป็นคลังความรู้"
        lead="การสนับสนุนที่มีค่าที่สุดคือการอ่าน คิด และใช้ความรู้อย่างมีความรับผิดชอบ"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {WAYS.map((w) => (
            <article key={w.title} className="rounded-md border border-ink/10 bg-white/40 p-6">
              <h2 className="font-serif text-lg text-ivory">{w.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{w.desc}</p>
            </article>
          ))}
        </div>
      </section>
      <PageNav current="/support" />
    </main>
  );
}
