import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  AuthorPenIcon,
  ConceptIcon,
  ScholarIcon,
  SynthesisIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { RecentlyViewed } from "@/components/recently-viewed";
import { LoopCarousel } from "@/components/loop-carousel";
import { DisciplineCard } from "@/components/discipline-card";
import { DISCIPLINES } from "@/lib/content/disciplines";
import { VesicaPattern } from "@/components/hero/vesica-pattern";
import { LayerBadge } from "@/components/layer-badge";
import { TimelineConstellation } from "@/components/timeline/timeline-constellation";

type Pillar = {
  Icon: ComponentType<{ className?: string }>;
  accent: string;
  title: ReactNode;
  desc: ReactNode;
};

// สามเสาหลัก “สิ่งที่เราทำ” — การ์ดมีลูกเล่น + ไอคอนเส้นเฉพาะ + เน้นคำสำคัญ (สีทอง)
const PILLARS: Pillar[] = [
  {
    Icon: ConceptIcon,
    accent: "#C79A4A",
    title: (
      <>
        เชื่อม<span className="text-accent">ศาสตร์ที่ถูกแยกขาด</span>
      </>
    ),
    desc: (
      <>
        จิตวิทยาศึกษาจิตใจ ปรัชญาศึกษาความจริง ภาษาศาสตร์ศึกษาภาษา แต่มนุษย์ไม่เคยดำรงอยู่เป็น
        <span className="font-medium text-accent">เสี้ยวส่วน</span> — ARCHRON เชื่อมกลับเป็น
        <span className="font-medium text-accent">องค์รวม</span>
      </>
    ),
  },
  {
    Icon: ScholarIcon,
    accent: "#6E93A8",
    title: (
      <>
        อ่านต้นฉบับ <span className="text-accent">เข้าใจบริบท</span>
      </>
    ),
    desc: (
      <>
        อ่านจากงาน<span className="font-medium text-accent">ต้นทาง</span>ในบริบทประวัติศาสตร์ของมัน แยก
        <span className="font-medium text-accent">ข้อเท็จจริง แหล่งที่มา และการตีความ</span>ออกจากกัน
        เพื่อให้ความรู้ไม่กลายเป็นคำกล่าวลอย ๆ ที่ไร้น้ำหนัก
      </>
    ),
  },
  {
    Icon: SynthesisIcon,
    accent: "#8AA395",
    title: (
      <>
        เปรียบเทียบ <span className="text-accent">สังเคราะห์</span> ตั้งคำถามใหม่
      </>
    ),
    desc: (
      <>
        ความจริงปรากฏผ่านการ<span className="font-medium text-accent">เปรียบเทียบ วิพากษ์ และสังเคราะห์</span> —
        ARCHRON บูรณาการและจัดระเบียบความรู้ขึ้นใหม่
      </>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="atmo-observatory">
        <section 
          className="relative flex min-h-[80vh] sm:min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 text-center text-text-heading"
          style={{
            background: "radial-gradient(circle at center, var(--color-bg) 30%, var(--color-bg) 100%)"
          }}
        >
          {/* Ambient Glow: แสงเรืองรองจางๆ จากศูนย์กลางหอสมุด */}
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(199, 154, 74, 0.08) 0%, rgba(110, 147, 168, 0.03) 50%, rgba(199, 154, 74, 0) 70%)",
            }}
          />

          {/* Layer A: Hellenistic Colonnade (เสมหินระเบียงหอสมุดอเล็กซานเดรีย) */}
          <div className="colonnade-pillar left-[10%] hidden md:block" />
          <div className="colonnade-pillar left-[25%] hidden lg:block" />
          <div className="colonnade-pillar right-[25%] hidden lg:block" />
          <div className="colonnade-pillar right-[10%] hidden md:block" />

          {/* Layer B: Esoteric Symbols Parallax (สัญลักษณ์ปรัชญาฉากหลังสี Psyche & Sapientia) */}
          <div 
            className="symbol-parallax text-7xl sm:text-8xl md:text-[14rem] lg:text-[18rem] text-concept opacity-[0.035]"
            style={{ top: "10%", left: "4%" }}
            aria-hidden="true"
          >
            Ψ
          </div>
          <div 
            className="symbol-parallax text-8xl sm:text-9xl md:text-[16rem] lg:text-[22rem] text-accent opacity-[0.035]"
            style={{ bottom: "8%", right: "5%" }}
            aria-hidden="true"
          >
            Φ
          </div>
          <div 
            className="symbol-parallax text-6xl sm:text-7xl md:text-[12rem] lg:text-[14rem] text-concept opacity-[0.025]"
            style={{ top: "55%", right: "12%" }}
            aria-hidden="true"
          >
            Ω
          </div>
          <div 
            className="symbol-parallax text-6xl sm:text-7xl md:text-[12rem] lg:text-[16rem] text-accent opacity-[0.03]"
            style={{ bottom: "20%", left: "12%" }}
            aria-hidden="true"
          >
            Α
          </div>
          <div 
            className="symbol-parallax text-7xl sm:text-8xl md:text-[14rem] lg:text-[20rem] text-accent opacity-[0.02]"
            style={{ top: "6%", left: "45%" }}
            aria-hidden="true"
          >
            Χ
          </div>

          {/* Layer C: The Astrolabe Centerpiece (วงแหวนดาราศาสตร์โบราณและคัมภีร์) */}
          <div className="pointer-events-none absolute left-1/2 top-[45%] z-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2">
            <div className="astrolabe-ring h-[280px] w-[280px] opacity-25" />
            <div className="astrolabe-ring h-[220px] w-[220px] opacity-20 border-dashed" />
            <div className="astrolabe-ring h-[160px] w-[160px] opacity-30 border-[var(--color-accent)]" />
            
            {/* หนังสือโบราณ — สัญลักษณ์ living library */}
            <svg
              className="absolute left-1/2 top-1/2 h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 opacity-35"
              viewBox="0 0 120 120"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M60 40C50 32 36 29 22 31v54c14-2 28 1 38 9 10-8 24-11 38-9V31c-14-2-28 1-38 9z" />
              <path d="M60 40v54" />
            </svg>
          </div>
          <div className="relative z-10 mx-auto max-w-5xl py-16 sm:py-24">
            {/* Layer Badge — เปลี่ยนตาม cosmology ปัจจุบัน */}
            <LayerBadge className="scroll-reveal mb-6 mx-auto" />
            {/* Tagline แบรนด์ */}
            <span className="scroll-reveal mb-5 block font-serif text-xl italic text-accent sm:text-2xl">
              a living library of human understanding
            </span>
            {/* Positioning: คลังที่มีชีวิต ตั้งแต่จุดกำเนิดผ่านกาลเวลา (แทนคำว่า “สำนัก”) */}
            <span className="scroll-reveal mb-8 block text-sm font-semibold tracking-[0.15em] text-accent/90">
              คลังความเข้าใจมนุษย์ที่มีชีวิต · ตั้งแต่จุดกำเนิด ผ่านกาลเวลา
            </span>
            <h1 className="scroll-reveal stagger-1 mb-8 font-serif text-fluid-h1 font-semibold leading-[1.15] text-text-heading md:tracking-[-0.02em]">
              จากความมืดของสิ่งที่ยังไม่รู้{" "}
              <span className="italic text-accent">สู่แสงแห่งความเข้าใจ</span>
            </h1>
            <p className="scroll-reveal stagger-2 mx-auto mb-8 max-w-3xl text-lg leading-[1.8] text-text-heading/75">
              การทำความเข้าใจมนุษย์ ไม่อาจอาศัยศาสตร์ใดศาสตร์หนึ่งเพียงลำพัง — ARCHRON คือคลังที่ผมค่อย ๆ
              เขียนและรวบรวม เชื่อมจิตวิทยา ปรัชญา มานุษยวิทยา ภาษา ประวัติศาสตร์ ตำนาน ศาสนา และวิทยาศาสตร์
              ให้ค้นได้ เชื่อมโยงกัน และเติบโตต่อเนื่อง
            </p>
            {/* แถบรากศัพท์ — ที่มาของชื่อ ARCHRON (จุดจำ) */}
            <div className="scroll-reveal stagger-2 mx-auto mb-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-secondary/70">
              <span className="flex items-baseline gap-2">
                <span className="font-serif text-lg text-accent">ἀρχή</span> ARCHĒ — จุดกำเนิด
              </span>
              <span className="text-accent">+</span>
              <span className="flex items-baseline gap-2">
                <span className="font-serif text-lg text-accent">Χρόνος</span> CHRONOS — กาลเวลา
              </span>
              <span className="text-accent">=</span>
              <span className="tracking-[0.2em] text-text-heading">ARCHRON</span>
            </div>
            {/* CTA — การ์ดลิงก์ (แทนปุ่มแบน) */}
            <div className="scroll-reveal stagger-3 mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/articles"
                className="group relative overflow-hidden rounded-2xl border border-accent/40 bg-accent/10 p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_26px_52px_-28px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent/35 bg-accent/10 text-accent">
                  <AuthorPenIcon className="h-[22px] w-[22px]" />
                </span>
                <span className="mt-4 flex items-center justify-between font-serif text-xl text-text-heading">
                  อ่านงานเขียน
                  <span className="text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-1.5 block text-sm text-text-secondary/70">บทความและบทวิเคราะห์จากปลายปากกา</span>
              </Link>
              <Link
                href="/concepts"
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-text-heading/[0.02] p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-concept/50 hover:shadow-[0_26px_52px_-28px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-concept/35 bg-concept/10 text-concept">
                  <ConceptIcon className="h-[22px] w-[22px]" />
                </span>
                <span className="mt-4 flex items-center justify-between font-serif text-xl text-text-heading">
                  สำรวจคลังแนวคิด
                  <span className="text-concept transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-1.5 block text-sm text-text-secondary/70">แผนที่ความรู้ที่เชื่อมโยงถึงกัน</span>
              </Link>
            </div>
            {/* Byline — วางตัวเป็นนักเขียน */}
            <div className="scroll-reveal mt-10 text-sm italic text-text-secondary/70">
              บันทึกโดย{" "}
              <span className="font-semibold not-italic tracking-[0.12em] text-accent">Archeon</span> — ผู้แสวงหาต้นกำเนิด
            </div>
          </div>
        </section>

        {/* Pillars — สิ่งที่เราทำ (การ์ด + ไอคอนเส้นเฉพาะ + เน้นคำ) */}
        <section className="relative mx-auto max-w-[1200px] px-4 sm:px-6 py-20 sm:py-28 md:py-36" aria-labelledby="pillars-heading">
          <h2 id="pillars-heading" className="sr-only">เสาหลักของ ARCHRON</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <article
                  key={i}
                  className={`group relative overflow-hidden rounded-2xl border border-border/25 bg-text-heading/[0.02] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.7)] scroll-reveal stagger-${i + 1}`}
                >
                  {/* แถบ accent ซ้าย (ขึ้นเมื่อ hover) */}
                  <span
                    className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-500 group-hover:scale-y-100"
                    style={{ backgroundColor: p.accent }}
                    aria-hidden="true"
                  />
                  {/* แสงเรืองมุมบนขวา */}
                  <span
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-90"
                    style={{ background: `radial-gradient(circle, color-mix(in srgb, ${p.accent} 20%, transparent), transparent 70%)` }}
                    aria-hidden="true"
                  />
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-xl border transition-transform duration-500 group-hover:scale-105"
                    style={{
                      color: p.accent,
                      borderColor: `color-mix(in srgb, ${p.accent} 30%, transparent)`,
                      backgroundColor: `color-mix(in srgb, ${p.accent} 10%, transparent)`,
                    }}
                  >
                    <Icon className="h-7 w-7" />
                  </span>
                  <h3 className="mt-6 font-serif text-[24px] font-medium leading-snug text-text-heading">{p.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-text-secondary/80">{p.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Chronological Constellation — Timeline แนวนอนสไตล์ Codex Layer 04 */}
        <section className="scroll-reveal py-20 sm:py-28">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="mb-10 border-b border-border/30 pb-6">
              <span className="mb-2 block text-xs font-semibold tracking-[0.2em] text-accent">LAYER 04 : INFORMATION ARCHITECTURE</span>
              <h2 className="font-heading text-3xl font-bold text-text-heading">Chronological Constellation</h2>
              <p className="mt-2 max-w-md text-sm text-text-secondary/70">เส้นเวลาปัญญามนุษย์ — โฮเวอร์เหนือจุดเพื่ออ่านปราชญ์สัญลักษณ์</p>
            </div>
            <TimelineConstellation
              events={[
                { year: "384 BC", label: "Aristotle", domain: "reason", description: "วางรากฐานอภิปรัชญาและตรรกศาสตร์ การจำแนกโครงสร้างความจริง (Primary Ontology)" },
                { year: "1781", label: "Kant", domain: "reason", description: "ปฏิวัติปรัชญาการรับรู้และญาณวิทยา (Critique of Pure Reason) — เราเห็นสิ่งต่าง ๆ ผ่านกรอบการรับรู้ของเรา" },
                { year: "1913", label: "Jung", domain: "concept", description: "แยกตัวจาก Freud และก่อตั้งจิตวิทยาเชิงวิเคราะห์ (Analytical Psychology) — จิตไร้สำนึกร่วมและต้นแบบสากล" },
                { year: "1949", label: "Campbell", domain: "collective", description: "ตีพิมพ์ The Hero with a Thousand Faces ถอดรหัสตำนานสากล (Monomyth) — การเดินทางของวีรบุรุษ" },
                { year: "1960", label: "Ricoeur", domain: "semiotics", description: "ปรัชญาการตีความสัญลักษณ์และภาษาศาสตร์เชิงลึก (Hermeneutics) — สัญลักษณ์คือสะพานสู่ความหมาย" },
                { year: "2026", label: "ARCHRON", domain: "synthetic", description: "การสังเคราะห์ปัญญาประดิษฐ์เข้ากับอภิปรัชญาและโครงสร้างมนุษย์ (Synthetic Sapience)" },
              ]}
            />
          </div>
        </section>

        {/* Knowledge Atlas */}
        <section className="relative overflow-hidden border-y border-border/30 bg-bg px-4 sm:px-6 py-16 sm:py-20">
          {/* Vesica pattern — สื่อการเชื่อมโยงของศาสตร์ (cosmology: prima = แผนที่/สัญลักษณ์) */}
          <VesicaPattern
            cosmology="prima"
            className="absolute inset-0 h-full w-full"
          />
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-12 max-w-2xl">
              <span className="mb-4 block text-xs font-semibold tracking-[0.05em] text-accent/60">
                แผนที่ความรู้
              </span>
              <h2 className="mb-6 font-serif text-fluid-h2 font-medium text-text-heading">
                สิบสองแขนงของการเข้าใจมนุษย์
              </h2>
              <p className="text-lg text-text-secondary/70">
                การเข้าใจมนุษย์ไม่อาจอาศัยศาสตร์เดียว — แต่ละแขนงส่องสว่างซึ่งกันและกัน วางอยู่ในแผนที่เดียวที่เชื่อมโยงถึงกัน
              </p>
            </div>
            <LoopCarousel ariaLabel="สิบสองแขนงของการเข้าใจมนุษย์ — เลื่อนวนได้">
              {DISCIPLINES.map((d) => (
                <DisciplineCard key={d.key} entry={d} href={`/disciplines/${d.key}`} />
              ))}
            </LoopCarousel>
            {/* CTA ท้ายส่วน — จัดกลาง ตามลำดับ typography */}
            <div className="mt-14 flex justify-center">
              <Link
                href="/disciplines"
                className="group inline-flex items-center gap-3 border-b border-accent/30 pb-2 text-sm font-semibold tracking-[0.05em] text-accent transition-all duration-500 hover:border-accent/60"
              >
                ดูศาสตร์ทั้งหมด
                <ArrowRightIcon className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </section>


        {/* Recently Viewed — continue reading */}
        <RecentlyViewed />

        {/* ปฏิญญา — คำคมให้จดจำ (เน้นคำแก่นด้วยสีทอง) */}
        <section className="scroll-reveal relative mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center md:py-28">
          <div className="mb-4 font-serif text-[clamp(40px,8vw,64px)] leading-[0.3] text-accent/35" aria-hidden="true">
            “
          </div>
          <h2 className="font-serif text-fluid-h2 font-medium leading-[1.5] text-text-heading">
            ARCHRON ไม่ได้ถามว่า<span className="text-accent">ควรคิดอะไร</span> แต่ถามว่ามนุษย์
            <span className="text-accent">เรียนรู้ที่จะคิด</span>มาอย่างไร
          </h2>
          <div className="mx-auto my-8 h-px w-16 bg-accent/30" />
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-[1.9] text-text-secondary/80">
            ARCHRON ไม่ได้ให้<span className="text-accent">คำตอบสุดท้าย</span> แต่ให้
            <span className="text-accent">คำถามที่ดีกว่า</span> แผนที่ความรู้ที่ดีกว่า
            และภาษาสำหรับเข้าใจตนเองและโลกที่ดีกว่า — โดยวางแนวคิดไว้ใน
            <span className="text-accent">บริบทเดิม</span>ของมัน พร้อมเปิดพื้นที่ให้การเปรียบเทียบและการตั้งคำถามอย่างรับผิดชอบ
          </p>
          <Link
            href="/manifesto"
            className="group inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-accent transition-all hover:gap-3"
          >
            อ่านปฏิญญาฉบับเต็ม
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
    </main>
  );
}
