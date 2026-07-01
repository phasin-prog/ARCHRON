import Link from "next/link";
import type { ComponentType } from "react";
import {
  PsychologyIcon,
  MythologyIcon,
  PhilosophyIcon,
  ScienceIcon,
  SymbolismIcon,
  LanguageIcon,
} from "@/components/icons";
import { RecentlyViewed } from "@/components/recently-viewed";
import { CardCarousel } from "@/components/card-carousel";
import { VesicaPattern } from "@/components/hero/vesica-pattern";
import type { Cosmology } from "@/lib/content/cosmology";

const PILLARS = [
  {
    icon: "account_tree",
    title: "เชื่อมศาสตร์ที่ถูกแยกขาด",
    desc: "จิตวิทยาศึกษาจิตใจ ปรัชญาศึกษาความจริง ภาษาศาสตร์ศึกษาภาษา แต่มนุษย์ไม่เคยดำรงอยู่เป็นเสี้ยวส่วน ARCHRON เชื่อมศาสตร์เหล่านี้กลับเป็นองค์รวม",
  },
  {
    icon: "history_edu",
    title: "อ่านต้นฉบับ เข้าใจบริบท",
    desc: "อ่านจากงานต้นทางในบริบทประวัติศาสตร์ของมัน แยกข้อเท็จจริง แหล่งที่มา และการตีความออกจากกัน เพื่อให้ความรู้ไม่กลายเป็นคำกล่าวลอย ๆ ที่ไร้น้ำหนัก",
  },
  {
    icon: "all_inclusive",
    title: "เปรียบเทียบ สังเคราะห์ ตั้งคำถามใหม่",
    desc: "ความจริงปรากฏผ่านการเปรียบเทียบ การวิพากษ์ และการสังเคราะห์ ที่อื่นเชี่ยวชาญเฉพาะทาง — ARCHRON บูรณาการและจัดระเบียบความรู้ขึ้นใหม่",
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
          </div>
          <div className="relative z-10 mx-auto max-w-5xl py-24">
            <span className="scroll-reveal mb-8 block text-xs font-semibold tracking-[0.05em] text-lumen/90">
              สำนักศึกษามนุษย์ ข้ามผ่านห้วงเวลาและศาสตร์วิชา
            </span>
            <h1 className="scroll-reveal stagger-1 mb-10 font-serif text-fluid-h1 font-semibold leading-[1.15] text-mist md:tracking-[-0.02em]">
              จากความมืดของสิ่งที่ยังไม่รู้{" "}
              <span className="italic text-lumen">สู่แสงแห่งความเข้าใจ</span>
            </h1>
            <p className="scroll-reveal stagger-2 mx-auto mb-12 max-w-3xl text-lg leading-[1.8] text-mist/75">
              ARCHRON คือสำนักศึกษามนุษย์ที่เชื่อมจิตวิทยา จิตวิเคราะห์ ปรัชญา ประวัติศาสตร์ ภาษา
              และประสาทวิทยาศาสตร์เข้าด้วยกัน โดยแยกแหล่งที่มา ข้อเท็จจริง และการตีความออกจากกัน
            </p>
            <div className="scroll-reveal stagger-3 flex flex-col justify-center gap-6 sm:flex-row">
              <Link
                href="/articles"
                className="group flex items-center justify-center gap-3 bg-sapientia px-10 py-5 text-xs font-semibold tracking-[0.05em] text-prima transition-all duration-500 hover:shadow-[0_0_34px_rgba(231, 215, 166,0.28)] focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                เริ่มอ่านบทความ
                <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1.5">
                  arrow_forward
                </span>
              </Link>
              <Link
                href="/concepts"
                className="flex items-center justify-center gap-3 border border-lumen/40 px-10 py-5 text-xs font-semibold tracking-[0.05em] text-lumen transition-all duration-500 hover:bg-lumen/10 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none"
              >
                เปิดแผนที่แนวคิด
                <span className="material-symbols-outlined text-[18px]">map</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="mx-auto max-w-[1200px] px-6 py-32 md:py-40">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-12 md:gap-x-12">
            {PILLARS.map((p, i) => (
              <div key={p.title} className={`group scroll-reveal stagger-${i + 1} md:col-span-4`}>
                <div className="mb-8 h-px w-12 bg-burnished-gold/30" />
                <div className="flex flex-col gap-6">
                  <span className="material-symbols-outlined text-[40px] text-burnished-gold transition-transform duration-500 group-hover:scale-110">
                    {p.icon}
                  </span>
                  <h3 className="font-serif text-[26px] font-medium text-on-surface">{p.title}</h3>
                  <p className="text-lg leading-relaxed text-on-surface-variant/80">{p.desc}</p>
                </div>
              </div>
            ))}
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
