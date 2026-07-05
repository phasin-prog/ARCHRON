import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";

export const metadata: Metadata = {
  title: "สนับสนุน — ARCHRON",
  description:
    "วิธีการสนับสนุนคลังความรู้ ARCHRON ทั้งผ่านการอ่านอย่างตั้งใจ การร่วมเป็นนักเขียนผู้ร่วมสรรค์สร้าง หรือผ่านบริการวิเคราะห์บุคลิกภาพเชิงจิตวิทยา",
};

const WAYS = [
  { title: "อ่านอย่างตั้งใจ", desc: "ใช้เวลากับเนื้อหา อ่านแหล่งอ้างอิง และแยกข้อเท็จจริงจากการตีความ" },
  { title: "แบ่งปันอย่างมีบริบท", desc: "ส่งต่อแนวคิดพร้อมบริบทเดิม ไม่ตัดทอนให้กลายเป็นคำคมสั้น" },
  { title: "ตั้งคำถามและทักท้วง", desc: "ช่วยทักท้วงหรือเพิ่มเติมข้อมูลอ้างอิง เพื่อให้คลังความรู้นี้ถูกต้องสมบูรณ์ยิ่งขึ้น" },
];

export default function SupportPage() {
  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "สนับสนุนโครงการ" },
      ]}
      kicker="สนับสนุน"
      title="สนับสนุนการเป็นคลังความรู้"
      lead="การสนับสนุนที่มีค่าที่สุดคือการอ่าน คิด และประยุกต์ใช้ความรู้อย่างมีความรับผิดชอบต่อตนเองและผู้อื่น"
      ambient
      navCurrent="/support"
    >
      <section className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {WAYS.map((w) => (
            <article key={w.title} className="archron-panel p-6">
              <h3 className="font-serif text-lg text-ivory">{w.title}</h3>
              <p className="mt-2.5 text-xs leading-relaxed text-soft-ivory">{w.desc}</p>
            </article>
          ))}
        </div>

        {/* ลงมือสนับสนุน — ช่องทางที่ลงมือได้จริง */}
        <h2 className="mt-14 mb-5 font-serif text-2xl text-ivory">ลงมือสนับสนุนโครงการ</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Action 1: Guide */}
          <Link
            href="/guide"
            className="archron-card group flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45 border-burnished-gold/25"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-slate-boundary/40 rounded-[0.9rem_0.3rem] bg-surface-container-low scale-100" style={{ borderColor: "color-mix(in srgb, var(--color-burnished-gold) 26%, var(--color-slate-boundary))" }}>
                  <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": "var(--color-burnished-gold)" } as React.CSSProperties}>
                    <use href="/icons/archron-icons.svg#lantern" />
                  </svg>
                </span>
                <span className="rounded bg-burnished-gold/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-burnished-gold border border-burnished-gold/25">
                  Guiding Light
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl text-ivory group-hover:text-burnished-gold">
                รับการวิเคราะห์เชิงลึก (Jungian Guide)
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-soft-ivory/85">
                สนับสนุนโครงการโดยตรงผ่านบริการวิเคราะห์บุคลิกภาพเชิงจิตวิทยาเชิงลึก (Psychological Type Guide) — รายได้ทั้งหมดใช้หล่อเลี้ยงระบบและเซิร์ฟเวอร์คลังความรู้
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-burnished-gold">
              ดูรายละเอียดบริการ
              <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </span>
          </Link>

          {/* Action 2: Writer */}
          <Link
            href="/studio"
            className="archron-card group flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="inline-flex items-center justify-center w-11 h-11 flex-none border border-slate-boundary/40 rounded-[0.9rem_0.3rem] bg-surface-container-low scale-100" style={{ borderColor: "color-mix(in srgb, var(--cosmology-accent) 26%, var(--color-slate-boundary))" }}>
                  <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": "var(--cosmology-accent)" } as React.CSSProperties}>
                    <use href="/icons/archron-icons.svg#interpretation" />
                  </svg>
                </span>
                <span className="rounded bg-white/[0.03] px-2 py-0.5 text-[9px] uppercase tracking-wider text-muted border border-slate-boundary/20">
                  Collaborator
                </span>
              </div>
              <h3 className="mt-4 font-serif text-xl text-ivory group-hover:text-burnished-gold">
                สมัครเข้าร่วมเป็นนักเขียนความรู้
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-soft-ivory/85">
                แบ่งปันบทความ ความรู้ และแนวคิดที่ได้รับการตรวจสอบอ้างอิงอย่างประณีต สมัครเป็นนักเขียนของเว็บร่วมอ้างอิงเพื่อช่วยพัฒนาคลังความรู้นี้ให้เติบโตอย่างมั่นคง
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-burnished-gold">
              เข้าสู่ห้องทำงานผู้เขียน (Studio)
              <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5">
                arrow_forward
              </span>
            </span>
          </Link>
        </div>
      </section>
    </PageScaffold>
  );
}
