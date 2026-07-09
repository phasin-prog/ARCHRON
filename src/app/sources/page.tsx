import type { Metadata } from "next";
import { colors } from "@/lib/content/colors";
import { PageScaffold } from "@/components/page-scaffold";
import { SOURCES } from "@/lib/content/sources";
import { SourcesBrowser } from "@/components/sources/sources-browser";

export const metadata: Metadata = {
  title: "แหล่งอ้างอิง — ARCHRON",
  description:
    "ฐานข้อมูลอ้างอิง คัมภีร์ เอกสารประวัติศาสตร์ และเอกสารวิชาการ เพื่อให้ผู้อ่านตรวจสอบย้อนกลับความเป็นจริงกับการตีความได้ตลอดเวลา",
};

const METHOD = [
  { title: "เริ่มจากต้นฉบับ", desc: "อ้างอิงจากตัวบทชั้นต้นก่อนเสมอ และระบุฉบับ/คำแปลที่ใช้" },
  { title: "เคารพบริบท", desc: "ไม่ตัดข้อความออกจากบริบทเพื่อสนับสนุนข้อสรุปที่เตรียมไว้" },
  { title: "แยกข้อเท็จจริงจากการตีความ", desc: "ระบุชัดว่าส่วนใดคือหลักฐาน ส่วนใดคือการตีความของเรา" },
];

function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 mt-12 flex items-center gap-3.5">
      <span className="text-xs tabular-nums tracking-[0.15em] text-accent/70">{num}</span>
      <span className="whitespace-nowrap font-serif text-[15px] font-semibold text-text-heading">{children}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-border/40 to-transparent" />
    </div>
  );
}

export default function SourcesPage() {
  return (
    <PageScaffold
      className="atmo-dictionary"
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "แหล่งอ้างอิง" },
      ]}
      kicker="แหล่งอ้างอิง"
      title="ฐานความรู้และการอ้างอิง"
      lead="ทุกแนวคิดควรมีฐานรองรับ ที่นี่เราแยกแหล่งต้นทาง งานอธิบาย และการตีความออกจากกันอย่างชัดเจน เพื่อให้ผู้อ่านตรวจสอบย้อนกลับได้เสมอว่าสิ่งใดคือหลักฐาน และสิ่งใดคือการตีความของเรา"
      ambient
      navCurrent="/sources"
    >
      <div className="tpl-reference">
        {/* 01 · ชั้นของแหล่งความรู้ */}
        <section className="scroll-reveal">
          <SectionLabel num="01">ชั้นของแหล่งความรู้ (Epistemic Tiers)</SectionLabel>
          <div className="grid gap-[18px] md:grid-cols-3">
            {[
              {
                num: "01",
                title: "แหล่งต้นทาง (Primary Sources)",
                accent: colors.goldAccent,
                desc: "งานต้นฉบับของนักคิดโดยตรง — ตัวบท คำแปลจากต้นฉบับ จดหมาย บันทึก และงานเขียนชั้นต้น (เช่น Collected Works ของ Jung)",
                icon: "source-primary",
              },
              {
                num: "02",
                title: "งานอธิบาย (Secondary Sources)",
                accent: colors.concept,
                desc: "งานศึกษา วิเคราะห์ และอธิบายต่อยอดจากแหล่งต้นทาง โดยนักวิชาการหรือผู้เชี่ยวชาญ (เช่น งานวิเคราะห์ตำนานของ von Franz)",
                icon: "source-secondary",
              },
              {
                num: "03",
                title: "การตีความ (Interpretation / Editorial)",
                accent: colors.quote,
                desc: "การตีความและการเชื่อมโยงใหม่ของกองบรรณาธิการ ARCHRON เอง เพื่อประยุกต์และแปลความให้เหมาะสมกับผู้อ่านร่วมสมัย",
                icon: "interpretation",
              },
            ].map((t) => (
              <article key={t.num} className="archron-card relative overflow-hidden p-6 flex flex-col justify-between">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 opacity-80"
                  style={{ backgroundColor: t.accent }}
                />
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="inline-flex items-center justify-center w-11 h-11 flex-none border border-border/40 rounded-[0.9rem_0.3rem] bg-bg-card scale-90"
                      style={{ borderColor: `color-mix(in srgb, ${t.accent} 26%, var(--color-border))` }}
                    >
                      <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": t.accent } as React.CSSProperties}>
                        <use href={`/icons/archron-icons.svg#${t.icon}`} />
                      </svg>
                    </span>
                    <span className="text-xs tabular-nums tracking-[0.1em] text-text-secondary/40 font-mono">
                      Tier {t.num}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-base font-semibold" style={{ color: t.accent }}>
                    {t.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-text-body">{t.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 02 · ค้นหาแหล่งอ้างอิงจริง */}
        <section className="scroll-reveal mt-12">
          <SectionLabel num="02">ดัชนีแหล่งอ้างอิงระบบความรู้</SectionLabel>
          <SourcesBrowser sources={SOURCES} />
        </section>

        {/* 03 · หลักการอ้างอิงของเรา */}
        <section className="scroll-reveal mt-12">
          <SectionLabel num="03">หลักการจัดการความรู้ของเรา</SectionLabel>
          <div className="grid gap-6 md:grid-cols-3">
            {METHOD.map((m) => (
              <div key={m.title} className="border-l-2 border-accent/30 pl-4 space-y-1">
                <h4 className="font-serif text-[15px] font-semibold text-text-heading">{m.title}</h4>
                <p className="text-xs leading-relaxed text-text-body">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageScaffold>
  );
}
