import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  PsychologyIcon,
  MythologyIcon,
  PhilosophyIcon,
  ScienceIcon,
  SymbolismIcon,
  LanguageIcon,
  AuthorPenIcon,
  ConceptIcon,
  ScholarIcon,
  SynthesisIcon,
} from "@/components/icons";
import { RecentlyViewed } from "@/components/recently-viewed";
import { CardCarousel } from "@/components/card-carousel";
import { VesicaPattern } from "@/components/hero/vesica-pattern";
import type { Cosmology } from "@/lib/content/cosmology";

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

type AtlasItem = {
  no: string;
  kicker: string;
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
  accent: string;
  cosmology: Cosmology;
};

const ATLAS: AtlasItem[] = [
  { no: "01", kicker: "แนวคิด", title: "จิตวิทยาเชิงลึก", desc: "สำรวจชั้นที่อยู่ใต้ความรู้สึกตัว แรงขับ และโครงสร้างภายในของจิต", Icon: PsychologyIcon, accent: "#6E93A8", cosmology: "psyche" },
  { no: "02", kicker: "ทฤษฎี", title: "จิตวิเคราะห์", desc: "อ่านความฝัน ความขัดแย้ง และภาษาของจิตไร้สำนึกตามสายงานต้นทาง", Icon: MythologyIcon, accent: "#B9C2CE", cosmology: "prima" },
  { no: "03", kicker: "ปรัชญา", title: "ปรัชญา", desc: "ตั้งคำถามต่อความหมาย เสรีภาพ และการดำรงอยู่ของมนุษย์", Icon: PhilosophyIcon, accent: "#CBA45A", cosmology: "sapientia" },
  { no: "04", kicker: "วิทยาศาสตร์", title: "ประสาทวิทยาศาสตร์", desc: "เชื่อมประสบการณ์ภายในเข้ากับการทำงานของสมองและระบบประสาท", Icon: ScienceIcon, accent: "#7FB08A", cosmology: "mercurius" },
  { no: "05", kicker: "สัญลักษณ์", title: "สัญลักษณ์และตำนาน", desc: "ถอดรหัสภาพแทน เรื่องเล่า และแบบแผนร่วมของมนุษยชาติ", Icon: SymbolismIcon, accent: "#C9A24A", cosmology: "sapientia" },
  { no: "06", kicker: "ภาษา", title: "ภาษาและการตีความ", desc: "เข้าใจว่าความหมายถูกสร้าง ส่งผ่าน และตีความอย่างไร", Icon: LanguageIcon, accent: "#8AA395", cosmology: "mercurius" },
];

export default function HomePage() {
  return (
    <main>
        <section 
          className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center text-mist"
          style={{
            background: "radial-gradient(circle at center, var(--color-deep-navy) 30%, var(--color-surface-container-lowest) 100%)"
          }}
        >
          {/* Ambient Glow: แสงเรืองรองจางๆ (ไม่มี Animation) */}
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
          <div className="relative z-10 mx-auto max-w-5xl py-24">
            {/* Tagline แบรนด์ */}
            <span className="scroll-reveal mb-5 block font-serif text-xl italic text-soft-gold sm:text-2xl">
              a living library of human understanding
            </span>
            {/* Positioning: คลังที่มีชีวิต ตั้งแต่จุดกำเนิดผ่านกาลเวลา (แทนคำว่า “สำนัก”) */}
            <span className="scroll-reveal mb-8 block text-xs font-semibold tracking-[0.15em] text-lumen/90">
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
                className="group relative overflow-hidden rounded-2xl border border-slate-boundary/40 bg-white/[0.02] p-6 text-left transition-all duration-500 hover:-translate-y-1.5 hover:border-[#6E93A8]/50 hover:shadow-[0_26px_52px_-28px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#6E93A8]/35 bg-[#6E93A8]/10 text-[#6E93A8]">
                  <ConceptIcon className="h-[22px] w-[22px]" />
                </span>
                <span className="mt-4 flex items-center justify-between font-serif text-xl text-ivory">
                  สำรวจคลังแนวคิด
                  <span className="text-[#6E93A8] transition-transform duration-300 group-hover:translate-x-1">→</span>
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
        <section className="mx-auto max-w-[1200px] px-6 py-28 md:py-36">
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
        <section className="relative overflow-hidden border-y border-slate-boundary/30 bg-surface-container-lowest px-6 py-20">
          {/* Vesica pattern — สื่อการเชื่อมโยงของศาสตร์ (cosmology: prima = แผนที่/สัญลักษณ์) */}
          <VesicaPattern
            cosmology="prima"
            className="absolute inset-0 h-full w-full"
          />
          <div className="relative z-10 mx-auto max-w-[1200px]">
            <div className="mb-20 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
              <div className="md:col-span-8">
                <span className="mb-4 block text-xs font-semibold tracking-[0.05em] text-burnished-gold/60">
                  แผนที่ความรู้
                </span>
                <h2 className="mb-6 font-serif text-fluid-h2 font-medium text-on-surface">
                  แผนที่ความรู้ของจิตใจมนุษย์
                </h2>
                <p className="max-w-2xl text-lg text-on-surface-variant/70">
                  หกหมวดหลักที่เชื่อมโยงกันเป็นระบบ ดั่งคลังเอกสารและหอดูดาวของชีวิตภายในที่สะท้อนถึงการดำรงอยู่ของเรา
                </p>
              </div>
              <div className="md:col-span-4 md:text-right">
                <Link
                  href="/concepts"
                  className="group inline-flex items-center gap-3 border-b border-burnished-gold/0 pb-2 text-xs font-semibold tracking-[0.05em] text-burnished-gold transition-all duration-500 hover:border-burnished-gold/40"
                >
                  เปิดคลังแนวคิดทั้งหมด
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1.5">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
            <CardCarousel ariaLabel="แผนที่ความรู้ — หกแขนงของการศึกษาจิตใจมนุษย์">
              {ATLAS.map((c) => {
                const Icon = c.Icon;
                return (
                  <Link
                    key={c.no}
                    href="/concepts"
                    className={`archron-card archron-card--${c.cosmology} group relative flex h-full w-full min-h-[300px] flex-col justify-between p-10 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none`}
                  >
                    <div>
                      <span
                        className="mb-6 block text-[10px] font-semibold tracking-[0.1em]"
                        style={{ color: "var(--cosmology-accent)" }}
                      >
                        {c.no} / {c.kicker}
                      </span>
                      <h4 className="mb-4 font-serif text-[24px] text-on-surface">{c.title}</h4>
                      <p className="text-base leading-relaxed text-on-surface-variant/70">{c.desc}</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <span
                        className="opacity-80 transition-transform duration-500 group-hover:scale-110"
                        style={{ color: "var(--cosmology-accent)" }}
                      >
                        <Icon className="h-8 w-8" />
                      </span>
                      <span className="material-symbols-outlined -translate-x-4 text-burnished-gold opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                        arrow_right_alt
                      </span>
                    </div>
                  </Link>
                );
              })}
            </CardCarousel>
          </div>
        </section>


        {/* Recently Viewed — continue reading */}
        <RecentlyViewed />

        {/* Manifesto quote */}
        <section className="scroll-reveal mx-auto max-w-5xl px-6 py-32 text-center md:py-40">
          <div className="mb-12">
            <span className="material-symbols-outlined text-[64px] text-burnished-gold/30">
              format_quote
            </span>
          </div>
          <h2 className="mb-12 font-serif text-[32px] italic leading-[1.6] text-on-surface">
            “ARCHRON ไม่ได้ถามว่าควรคิดอะไร แต่ถามว่ามนุษย์เรียนรู้ที่จะคิดมาอย่างไร”
          </h2>
          <div className="mx-auto mb-12 h-px w-16 bg-burnished-gold/20" />
          <p className="mx-auto mb-16 max-w-3xl text-lg leading-[1.9] text-on-surface-variant/80">
            ARCHRON ไม่ได้ให้คำตอบสุดท้าย แต่ให้คำถามที่ดีกว่า แผนที่ความรู้ที่ดีกว่า
            และภาษาสำหรับเข้าใจตนเองและโลกที่ดีกว่า — โดยวางแนวคิดไว้ในบริบทเดิมของมัน
            พร้อมเปิดพื้นที่ให้การเปรียบเทียบและการตั้งคำถามเกิดขึ้นอย่างรับผิดชอบ
          </p>
          <Link
            href="/manifesto"
            className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.05em] text-burnished-gold transition-all hover:text-primary"
          >
            อ่าน Manifesto ฉบับเต็ม
            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-2">
              arrow_right_alt
            </span>
          </Link>
        </section>
    </main>
  );
}
