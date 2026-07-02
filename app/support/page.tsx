import type { Metadata } from "next";
import Link from "next/link";
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

const ACTIONS = [
  {
    href: "/guide",
    icon: "psychology_alt",
    title: "รับการวิเคราะห์เชิงลึก",
    desc: "สนับสนุนโครงการโดยตรงผ่านบริการวิเคราะห์บุคลิกภาพเชิงจิตวิทยา (Psychological Type Guide) — รายได้ช่วยหล่อเลี้ยงการดูแลคลังความรู้",
    cta: "ดูบริการวิเคราะห์",
    primary: true,
  },
  {
    href: "/studio",
    icon: "edit_note",
    title: "ร่วมเป็นนักเขียน",
    desc: "แบ่งปันความรู้ที่ตรวจสอบได้ สมัครเป็นนักเขียนของคลัง แล้วช่วยขยายองค์ความรู้ให้ลึกและกว้างขึ้น",
    cta: "เข้าสู่ Studio",
    primary: false,
  },
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
            <article key={w.title} className="rounded-md border border-ink/10 bg-charcoal/40 p-6">
              <h2 className="font-serif text-lg text-ivory">{w.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-soft-ivory">{w.desc}</p>
            </article>
          ))}
        </div>

        {/* ลงมือสนับสนุน — ช่องทางที่ลงมือได้จริง */}
        <h2 className="mt-14 mb-5 font-serif text-xl text-ivory">ลงมือสนับสนุน</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`archron-card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45 ${
                a.primary ? "border-burnished-gold/35" : ""
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                  a.primary
                    ? "border-burnished-gold/45 bg-burnished-gold/12 text-burnished-gold"
                    : "border-slate-boundary/50 text-soft-ivory"
                }`}
              >
                <span className="material-symbols-outlined">{a.icon}</span>
              </span>
              <h3 className="mt-4 font-serif text-lg text-ivory group-hover:text-burnished-gold">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-soft-ivory/85">{a.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-burnished-gold">
                {a.cta}
                <span className="material-symbols-outlined text-[16px] transition-transform duration-300 group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
      <PageNav current="/support" />
    </main>
  );
}
