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
import { HeroGrid3D } from "@/components/hero/hero-grid-3d";

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
        เชื่อม<span className="text-soft-gold">ศาสตร์ที่ถูกแยกขาด</span>
      </>
    ),
    desc: (
      <>
        จิตวิทยาศึกษาจิตใจ ปรัชญาศึกษาความจริง ภาษาศาสตร์ศึกษาภาษา แต่มนุษย์ไม่เคยดำรงอยู่เป็น
        <span className="font-medium text-soft-gold">เสี้ยวส่วน</span> — ARCHRON เชื่อมกลับเป็น
        <span className="font-medium text-soft-gold">องค์รวม</span>
      </>
    ),
  },
  {
    Icon: ScholarIcon,
    accent: "#6E93A8",
    title: (
      <>
        อ่านต้นฉบับ <span className="text-soft-gold">เข้าใจบริบท</span>
      </>
    ),
    desc: (
      <>
        อ่านจากงาน<span className="font-medium text-soft-gold">ต้นทาง</span>ในบริบทประวัติศาสตร์ของมัน แยก
        <span className="font-medium text-soft-gold">ข้อเท็จจริง แหล่งที่มา และการตีความ</span>ออกจากกัน
        เพื่อให้ความรู้ไม่กลายเป็นคำกล่าวลอย ๆ ที่ไร้น้ำหนัก
      </>
    ),
  },
  {
    Icon: SynthesisIcon,
    accent: "#8AA395",
    title: (
      <>
        เปรียบเทียบ <span className="text-soft-gold">สังเคราะห์</span> ตั้งคำถามใหม่
      </>
    ),
    desc: (
      <>
        ความจริงปรากฏผ่านการ<span className="font-medium text-soft-gold">เปรียบเทียบ วิพากษ์ และสังเคราะห์</span> —
        ARCHRON บูรณาการและจัดระเบียบความรู้ขึ้นใหม่
      </>
    ),
  },
];

export default function HomePage() {
  return (
    <main className="atmo-base atmo-observatory">
        <section 
          className="relative flex min-h-[80vh] sm:min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 sm:px-6 text-center text-mist texture-grain"
          style={{
            background: "radial-gradient(circle at center, var(--color-deep-navy) 30%, var(--color-surface-container-lowest) 100%)"
          }}
        >
          {/* 3D Grid Background — พื้นหลัง Grid 3D แบบ full-page */}
          <HeroGrid3D />

          {/* Ambient Glow: แสงเรืองรองจางๆ */}
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(199, 154, 74, 0.07) 0%, rgba(199, 154, 74, 0) 70%)",
            }}
          />
          {/* ARCHRON Symbol Layer (เส้นวงกลมตัดกันลางๆ สื่อถึงจิตวิทยาและศาสตร์ต่างๆ - ไม่มี Animation) */}
          <div 
            className="pointer-events-none absolute left-1/2 top-[45%] z-0 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 opacity-15"
          >
            <div className="absolute top-0 left-[45px] w-[170px] h-[170px] border border-[var(--color-antique-gold)] rounded-full" />
            <div className="absolute bottom-0 left-[45px] w-[170px] h-[170px] border border-[var(--color-antique-gold)] rounded-full" />
            {/* หนังสือโบราณ — สัญลักษณ์ living library */}
            <svg
              className="absolute left-1/2 top-1/2 h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2"
              viewBox="0 0 120 120"
              fill="none"
              stroke="var(--color-soft-gold)"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M60 40C50 32 36 29 22 31v54c14-2 28 1 38 9 10-8 24-11 38-9V31c-14-2-28 1-38 9z" />
              <path d="M60 40v54" />
            </svg>
          </div>
          <div className="relative z-10 mx-auto max-w-5xl py-16 sm:py-24">
            {/* Tagline แบรนด์ */}
            <span className="scroll-reveal mb-5 block font-serif text-xl italic text-soft-gold sm:text-2xl">
              a living library of human understanding
            </span>
            {/* Positioning: คลังที่มีชีวิต ตั้งแต่จุดกำเนิดผ่านกาลเวลา (แทนคำว่า “สำนัก”) */}
            <span className="scroll-reveal mb-8 block text-sm font-semibold tracking-[0.15em] text-lumen/90">
              คลังความเข้าใจมนุษย์ที่มีชีวิต · ตั้งแต่จุดกำเนิด ผ่านกาลเวลา
            </span>
            <h1 className="scroll-reveal stagger-1 mb-8 font-serif text-fluid-h1 font-semibold leading-[1.15] text-mist md:tracking-[-0.02em]">
              จากความมืดของสิ่งที่ยังไม่รู้{" "}
              <span className="italic text-lumen">สู่แสงแห่งความเข้าใจ</span>
            </h1>
            <p className="scroll-reveal stagger-2 mx-auto mb-8 max-w-3xl text-lg leading-[1.8] text-mist/75">
              การทำความเข้าใจมนุษย์ ไม่อาจอาศัยศาสตร์ใดศาสตร์หนึ่งเพียงลำพัง — ARCHRON คือคลังที่ผมค่อย ๆ
              เขียนและรวบรวม เชื่อมจิตวิทยา ปรัชญา มานุษยวิทยา ภาษา ประวัติศาสตร์ ตำนาน ศาสนา และวิทยาศาสตร์
              ให้ค้นได้ เชื่อมโยงกัน และเติบโตต่อเนื่อง
            </p>
            {/* แถบรากศัพท์ — ที่มาของชื่อ ARCHRON (จุดจำ) */}
            <div className="scroll-reveal stagger-2 mx-auto mb-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-on-surface-variant/70">
              <span className="flex items-baseline gap-2">
                <span className="font-serif text-lg text-soft-gold">ἀρχή</span> ARCHĒ — จุดกำเนิด
              </span>
              <span className="text-burnished-gold">+</span>
              <span className="flex items-baseline gap-2">
                <span className="font-serif text-lg text-soft-gold">Χρόνος</span> CHRONOS — กาลเวลา
              </span>
              <span className="text-burnished-gold">=</span>
              <span className="tracking-[0.2em] text-ivory">ARCHRON</span>
            </div>
            {/* CTA — การ์ดลิงก์ (แทนปุ่มแบน) */}
            <div className="scroll-reveal stagger-3 mx-auto grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              <Link
                href="/articles"
                className="group relative overflow-hidden rounded-2xl border border-burnished-gold/40 bg-burnished-gold/10 p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-burnished-gold/60 hover:shadow-[0_26px_52px_-28px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-burnished-gold/35 bg-burnished-gold/10 text-burnished-gold">
                  <AuthorPenIcon className="h-[22px] w-[22px]" />
                </span>
                <span className="mt-4 flex items-center justify-between font-serif text-xl text-ivory">
                  อ่านงานเขียน
                  <span className="text-burnished-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-1.5 block text-sm text-on-surface-variant/70">บทความและบทวิเคราะห์จากปลายปากกา</span>
              </Link>
              <Link
                href="/concepts"
                className="group relative overflow-hidden rounded-2xl border border-slate-boundary/40 bg-white/[0.02] p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-psyche/50 hover:shadow-[0_26px_52px_-28px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-psyche/35 bg-psyche/10 text-psyche">
                  <ConceptIcon className="h-[22px] w-[22px]" />
                </span>
                <span className="mt-4 flex items-center justify-between font-serif text-xl text-ivory">
                  สำรวจคลังแนวคิด
                  <span className="text-psyche transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
                <span className="mt-1.5 block text-sm text-on-surface-variant/70">แผนที่ความรู้ที่เชื่อมโยงถึงกัน</span>
              </Link>
            </div>
            {/* Byline — วางตัวเป็นนักเขียน */}
            <div className="scroll-reveal mt-10 text-sm italic text-on-surface-variant/70">
              บันทึกโดย{" "}
              <span className="font-semibold not-italic tracking-[0.12em] text-soft-gold">Archeon</span> — ผู้แสวงหาต้นกำเนิด
            </div>
          </div>
        </section>

        {/* Pillars — สิ่งที่เราทำ (การ์ด + ไอคอนเส้นเฉพาะ + เน้นคำ) */}
        <section className="relative mx-auto max-w-[1200px] px-4 sm:px-6 py-20 sm:py-28 md:py-36 texture-parchment texture-glow-gold" aria-labelledby="pillars-heading">
          <h2 id="pillars-heading" className="sr-only">เสาหลักของ ARCHRON</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PILLARS.map((p, i) => {
              const Icon = p.Icon;
              return (
                <article
                  key={i}
                  className={`group relative overflow-hidden rounded-2xl border border-slate-boundary/25 bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-burnished-gold/40 hover:shadow-[0_28px_56px_-30px_rgba(0,0,0,0.7)] scroll-reveal stagger-${i + 1}`}
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
                  <h3 className="mt-6 font-serif text-[24px] font-medium leading-snug text-on-surface">{p.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-on-surface-variant/80">{p.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Knowledge Atlas */}
        <section className="relative overflow-hidden border-y border-slate-boundary/30 bg-surface-container-lowest px-4 sm:px-6 py-16 sm:py-20 texture-grain texture-vignette">
          {/* Vesica pattern — สื่อการเชื่อมโยงของศาสตร์ (cosmology: prima = แผนที่/สัญลักษณ์) */}
          <VesicaPattern
            cosmology="prima"
            className="absolute inset-0 h-full w-full"
          />
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-12 max-w-2xl">
              <span className="mb-4 block text-xs font-semibold tracking-[0.05em] text-burnished-gold/60">
                แผนที่ความรู้
              </span>
              <h2 className="mb-6 font-serif text-fluid-h2 font-medium text-on-surface">
                สิบสองแขนงของการเข้าใจมนุษย์
              </h2>
              <p className="text-lg text-on-surface-variant/70">
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
                className="group inline-flex items-center gap-3 border-b border-burnished-gold/30 pb-2 text-sm font-semibold tracking-[0.05em] text-burnished-gold transition-all duration-500 hover:border-burnished-gold/60"
              >
                ดูศาสตร์ทั้งหมด
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>


        {/* Recently Viewed — continue reading */}
        <RecentlyViewed />

        {/* ปฏิญญา — คำคมให้จดจำ (เน้นคำแก่นด้วยสีทอง) */}
        <section className="scroll-reveal relative mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center md:py-28 texture-glow-gold texture-parchment">
          <div className="mb-4 font-serif text-[clamp(40px,8vw,64px)] leading-[0.3] text-burnished-gold/35" aria-hidden="true">
            “
          </div>
          <h2 className="font-serif text-fluid-h2 font-medium leading-[1.5] text-ivory">
            ARCHRON ไม่ได้ถามว่า<span className="text-soft-gold">ควรคิดอะไร</span> แต่ถามว่ามนุษย์
            <span className="text-soft-gold">เรียนรู้ที่จะคิด</span>มาอย่างไร
          </h2>
          <div className="mx-auto my-8 h-px w-16 bg-burnished-gold/30" />
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-[1.9] text-on-surface-variant/80">
            ARCHRON ไม่ได้ให้<span className="text-soft-gold">คำตอบสุดท้าย</span> แต่ให้
            <span className="text-soft-gold">คำถามที่ดีกว่า</span> แผนที่ความรู้ที่ดีกว่า
            และภาษาสำหรับเข้าใจตนเองและโลกที่ดีกว่า — โดยวางแนวคิดไว้ใน
            <span className="text-soft-gold">บริบทเดิม</span>ของมัน พร้อมเปิดพื้นที่ให้การเปรียบเทียบและการตั้งคำถามอย่างรับผิดชอบ
          </p>
          <Link
            href="/manifesto"
            className="group inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-burnished-gold transition-all hover:gap-3"
          >
            อ่านปฏิญญาฉบับเต็ม
            <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
    </main>
  );
}
