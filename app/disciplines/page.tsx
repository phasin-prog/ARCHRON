import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { LoopCarousel } from "@/components/loop-carousel";
import { DISCIPLINE_META, type DisciplineKey } from "@/components/discipline-meta";

export const metadata: Metadata = {
  title: "ศาสตร์ที่เราศึกษา — ARCHRON",
  description:
    "สิบสองแขนงของการเข้าใจมนุษย์ — จิตวิทยา ปรัชญา มานุษยวิทยา ประวัติศาสตร์ ภาษา ตำนาน ศาสนา วิทยาศาสตร์ สัญลักษณ์ ศิลปะ ปัญญาประดิษฐ์ และอารยธรรม",
};

type DisciplineEntry = { key: DisciplineKey; en: string; desc: string };

// เนื้อหาแต่ละแขนง — อธิบายว่าศึกษาอะไร (label/ไอคอน/สี ดึงจาก discipline-meta)
const DISCIPLINES: DisciplineEntry[] = [
  { key: "psychology", en: "Psychology", desc: "ศึกษาโครงสร้างและกลไกของจิต ทั้งส่วนที่รู้ตัวและไร้สำนึก แรงขับ อารมณ์ และรูปแบบของพฤติกรรม" },
  { key: "philosophy", en: "Philosophy", desc: "ตั้งคำถามต่อความจริง ความรู้ ความหมาย จริยธรรม และการดำรงอยู่ของมนุษย์" },
  { key: "anthropology", en: "Anthropology", desc: "ศึกษามนุษย์ในฐานะสิ่งมีวัฒนธรรม — โครงสร้างสังคม พิธีกรรม และวิถีการให้ความหมายร่วมกัน" },
  { key: "history", en: "History", desc: "ตามรอยความคิดและเหตุการณ์ในบริบทของเวลา เพื่อเข้าใจว่าแนวคิดถือกำเนิดและแปรเปลี่ยนอย่างไร" },
  { key: "language", en: "Language", desc: "ศึกษาว่าความหมายถูกสร้าง ส่งผ่าน และตีความอย่างไรผ่านภาษา สัญญะ และการอ่าน" },
  { key: "mythology", en: "Mythology", desc: "อ่านเรื่องเล่าและแบบแผนร่วมของมนุษยชาติ ที่สะท้อนโครงสร้างภายในของจิตและวัฒนธรรม" },
  { key: "religion", en: "Religion", desc: "ศึกษาระบบความเชื่อ ประสบการณ์ต่อสิ่งศักดิ์สิทธิ์ และการแสวงหาความหมายสูงสุดของมนุษย์" },
  { key: "science", en: "Science", desc: "เชื่อมประสบการณ์ภายในกับหลักฐานเชิงประจักษ์ โดยเฉพาะประสาทวิทยาศาสตร์ของจิตและสมอง" },
  { key: "symbol", en: "Symbolism", desc: "ถอดรหัสภาพแทนและระบบสัญลักษณ์ที่มนุษย์ใช้บรรจุและส่งผ่านความหมายข้ามยุคสมัย" },
  { key: "art", en: "Art", desc: "ศึกษาการแสดงออกทางสุนทรียะในฐานะภาษาของจิตและวัฒนธรรม ที่พูดสิ่งซึ่งถ้อยคำพูดไม่ได้" },
  { key: "ai-future", en: "AI & Future", desc: "สำรวจว่าปัญญาที่ไม่ใช่มนุษย์ท้าทายและขยายความเข้าใจเรื่องจิต ตัวตน และความหมายอย่างไร" },
  { key: "civilization", en: "Civilization", desc: "มองภาพรวมว่าความรู้ ความคิด และสถาบันของมนุษย์ประกอบกันขึ้นเป็นอารยธรรมอย่างไร" },
];

export default function DisciplinesPage() {
  return (
    <main className="pb-24">
      <PageHeader
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          { label: "คลังความรู้", href: "/knowledge" },
          { label: "ศาสตร์ที่เราศึกษา" },
        ]}
        kicker="แผนที่ความรู้"
        title="สิบสองแขนงของการเข้าใจมนุษย์"
        lead="การเข้าใจมนุษย์ไม่อาจอาศัยศาสตร์เดียว — ARCHRON เดินข้ามพรมแดนวิชา แล้ววางแต่ละแขนงไว้ในแผนที่เดียวกัน ด้านล่างคือสิ่งที่แต่ละแขนงศึกษา และมุมที่เราใช้อ่านมัน"
      />

      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        <LoopCarousel ariaLabel="สิบสองแขนงของการเข้าใจมนุษย์ — เลื่อนวนได้">
          {DISCIPLINES.map((d) => {
            const meta = DISCIPLINE_META[d.key];
            const Icon = meta.Icon;
            return (
              <article
                key={d.key}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-boundary/25 bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-burnished-gold/40 hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.7)]"
              >
                {/* แถบ accent ซ้าย (ขึ้นเมื่อ hover) */}
                <span
                  className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
                  style={{ backgroundColor: meta.accent }}
                  aria-hidden="true"
                />
                {/* แสงเรืองมุมบนขวา */}
                <span
                  className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                  style={{
                    background: `radial-gradient(circle, color-mix(in srgb, ${meta.accent} 18%, transparent), transparent 70%)`,
                  }}
                  aria-hidden="true"
                />
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-xl border transition-transform duration-500 group-hover:scale-105"
                  style={{
                    color: meta.accent,
                    borderColor: `color-mix(in srgb, ${meta.accent} 30%, transparent)`,
                    backgroundColor: `color-mix(in srgb, ${meta.accent} 10%, transparent)`,
                  }}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <span
                  className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.14em] opacity-85"
                  style={{ color: meta.accent }}
                >
                  {d.en}
                </span>
                <h2 className="mt-1 font-serif text-[22px] leading-snug text-on-surface">{meta.label}</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-on-surface-variant/80">{d.desc}</p>
              </article>
            );
          })}
        </LoopCarousel>

        <p className="mt-6 text-center text-xs text-muted">
          ลากซ้าย–ขวา หรือกดปุ่มลูกศร · การ์ดจะวนกลับมาเรื่อย ๆ ไม่มีจุดสิ้นสุด
        </p>
      </section>

      <PageNav current="/knowledge" />
    </main>
  );
}
