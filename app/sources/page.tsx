import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิง — ARCHRON",
};

const SOURCE_GROUPS = [
  { title: "Primary Sources", desc: "งานต้นทางของนักคิดโดยตรง" },
  { title: "Secondary Sources", desc: "งานอธิบายหรือศึกษาต่อยอด" },
  { title: "Interpretation / Editorial", desc: "การตีความของเว็บ แยกออกจากข้อเท็จจริงและแหล่งต้นทาง" },
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
            <article key={g.title} className="rounded-md border border-ink/10 bg-white/40 p-6">
              <h2 className="font-serif text-lg text-ivory">{g.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{g.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-md border border-ink/10 bg-surface-1/50 p-10 text-center">
          <p className="text-soft-ivory">ยังไม่มีบันทึกแหล่งอ้างอิงเผยแพร่</p>
        </div>
      </section>
      <PageNav current="/sources" />
    </main>
  );
}
