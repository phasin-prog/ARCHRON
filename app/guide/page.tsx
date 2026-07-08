"use client";

import { useState } from "react";
import Link from "next/link";

const SCOPE = [
  { icon: "compare_arrows", title: "Object / Subject Orientation", desc: "แนวโน้มว่า Ego ให้น้ำหนักกับโลกภายนอก (Extraversion) หรือโลกภายใน (Introversion) มากกว่ากัน" },
  { icon: "psychology", title: "Principal Function", desc: "ฟังก์ชันหลัก (Thinking, Feeling, Sensation, Intuition) ที่จิตสำนึกใช้รับและตัดสินข้อมูลเป็นช่องทางหลัก" },
  { icon: "stacks", title: "Function Stack", desc: "ลำดับการทำงานและน้ำหนักของโครงสร้างจิตสำนึก: Dominant (ฟังก์ชันหลัก) / Auxiliary (ฟังก์ชันช่วย) / Inferior (ฟังก์ชันด้อย)" },
  { icon: "bolt", title: "Ego Pattern", desc: "รูปแบบพฤติกรรมการป้องกันตัวของ Ego และแนวโน้มทิศทางเมื่อต้องรับมือแรงกดดันจากภายนอก" },
  { icon: "description", title: "รายงานสรุปจิตวิเคราะห์", desc: "เอกสารรายงานสรุปโครงสร้างจิตและการวิเคราะห์ Ego ความยาวประมาณ 2–3 หน้า" },
  { icon: "schedule", title: "เวลาสนทนาเชิงลึก", desc: "เซสชันสัมภาษณ์และพูดคุยวิเคราะห์แบบตัวต่อตัวความยาวประมาณ 1 ชั่วโมง 30 นาที" },
];

const STEPS = [
  { no: "01", title: "นัดหมายทางออนไลน์", desc: "เลือกช่องทางติดต่อด้านล่างเพื่อพูดคุยเลือกวันเวลาที่สะดวกสำหรับคุณ" },
  { no: "02", title: "ยืนยันบริการ", desc: "ชำระเงินและแจ้งหลักฐานโอนเพื่อล็อคคิวนัดหมายวิเคราะห์ล่วงหน้า" },
  { no: "03", title: "เซสชันสัมภาษณ์เชิงลึก", desc: "เข้าสนทนาสดออนไลน์ประมาณ 90 นาที เพื่อสำรวจโครงสร้างและแบบแผนของ Ego" },
  { no: "04", title: "รับเอกสารรายงาน", desc: "รับรายงานสรุปทฤษฎีแนวโน้มการทำงานและ stack ฟังก์ชันจิตวิทยาความยาว 2-3 หน้า" },
];

const BOUNDARIES = [
  "เป็นการสะท้อนโครงสร้างบุคลิกภาพและรูปแบบการรับรู้โลกตามแนว Jungian Psychological Types ดั้งเดิม",
  "ไม่ใช่การวินิจฉัยทางการแพทย์ จิตเวช ทางคลินิก หรือกระบวนการจิตบำบัดรักษาโรค",
  "ไม่ใช่การทำนายอนาคต การทายโชคชะตา หรือการพยากรณ์เชิงโหราศาสตร์ใดๆ",
  "ผลลัพธ์มีขึ้นเพื่อช่วยให้บุคคลเข้าใจแบบแผนของ Ego ตระหนักรู้กลไกป้องกันตัว และนำไปพัฒนาตนเองอย่างมีสติ",
];

const CONTACTS = [
  { icon: "call", label: "โทรศัพท์", value: "081-538-2404", href: "tel:0815382404", external: false },
  { icon: "chat", label: "LINE", value: "phasin_pasumart", href: "https://line.me/ti/p/~phasin_pasumart", external: true },
  { icon: "person", label: "Facebook ส่วนตัว", value: "Phasin", href: "https://www.facebook.com/phasin.phasin.7", external: true },
  { icon: "groups", label: "Facebook Page", value: "ARCHRON", href: "https://www.facebook.com/profile.php?id=61561438596973", external: true },
];

type PsycheFunction = "thinking" | "feeling" | "sensation" | "intuition" | "ego";

const COMPASS_DETAILS: Record<PsycheFunction, { title: string; subtitle: string; desc: string; stack: string }> = {
  thinking: {
    title: "Thinking (T) — การคิด",
    subtitle: "Rational & Logical Evaluation",
    desc: "การประเมินและตัดสินใจด้วยเหตุผลเชิงระบบ การวิเคราะห์หลักการทั่วไป ความถูกต้องเป็นสากล และการแยกแยะจัดหมวดหมู่ข้อมูลอย่างเป็นวัตถุวิสัย (Objective Analysis)",
    stack: "แกนหลักในการจัดระบบโครงสร้างความคิดและการใช้ตรรกวิทยาเพื่อสร้างระบบระเบียบ",
  },
  feeling: {
    title: "Feeling (F) — ความรู้สึก",
    subtitle: "Valuation & Relation Evaluation",
    desc: "การตัดสินคุณค่า (Value) ด้วยความสำคัญต่อบุคคลหรือสังคม จิตวิญญาณแห่งความเชื่อมโยง ความสอดคล้องกลมกลืน และการวัดน้ำหนักทางจริยธรรมของทางเลือก (Ethical Evaluation)",
    stack: "ฟังก์ชันที่ทำงานตรงข้ามกับ Thinking ในการประเมินสิ่งที่คู่ควรแก่คุณค่าของมนุษย์",
  },
  sensation: {
    title: "Sensation (S) — การรับรู้สัมผัส",
    subtitle: "Reality & Detail Perception",
    desc: "การเปิดรับข้อมูลตามความจริงผ่านประสาทสัมผัสทั้งห้า ความเป็นจริงตรงหน้าในปัจจุบัน รายละเอียดที่จับต้องได้ ประสบการณ์ในอดีต และความจริงเชิงประจักษ์ (Concrete Reality)",
    stack: "ฟังก์ชันสังเกตการณ์ที่เน้นข้อมูลที่เกิดขึ้นจริง ณ ปัจจุบันขณะและการจัดเก็บรายละเอียด",
  },
  intuition: {
    title: "Intuition (N) — การหยั่งรู้",
    subtitle: "Possibility & Pattern Perception",
    desc: "การรับรู้ผ่านการเชื่อมโยงความสัมพันธ์ที่มองไม่เห็นด้วยตา ความเป็นไปได้ในอนาคต ภาพรวมเชิงระบบ ความหมายเบื้องหลังสัญลักษณ์ และจินตนาการวิสัยทัศน์ (Hidden Patterns)",
    stack: "ฟังก์ชันสังเกตการณ์ที่มองข้ามความเป็นจริงตรงหน้าเพื่อเข้าหาศักยภาพและแนวโน้มถัดไป",
  },
  ego: {
    title: "Ego / Self Axis — ศูนย์กลางจิตวิทยา",
    subtitle: "Conscious Center & Total Psyche",
    desc: "จุดสมดุลระหว่าง Ego (จิตสำนึก) และ Self (องค์รวมของจิต) ซึ่งเป็นแกนกลางของการหลอมรวมฟังก์ชันด้านต่างๆ เพื่อให้จิตใจสามารถเติบโตเป็นหนึ่งเดียว (Individuation)",
    stack: "เป้าหมายหลักของการวิเคราะห์แบบแผน Ego เพื่อนำทางไปสู่ความสมบูรณ์แบบภายในตัวตน",
  },
};

export default function GuidePage() {
  const [activeFunc, setActiveFunc] = useState<PsycheFunction>("ego");

  return (
    <main className="atmo-temple min-h-screen bg-bg pb-24 text-text-heading">
      {/* Hero & Interactive Compass Container */}
      <section className="relative overflow-hidden border-b border-border/30 px-6 py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(199,154,74,0.06)_0%,transparent_70%)]" />
        
        <div className="mx-auto max-w-6xl">
          <nav aria-label="เส้นทางนำทาง" className="mb-8 flex flex-wrap items-center gap-1 text-xs text-text-secondary">
            <Link href="/" className="rounded px-2 py-1.5 transition-colors hover:text-accent focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:text-accent focus-visible:outline-none">
              หน้าแรก
            </Link>
            <span className="material-symbols-outlined text-[16px] text-text-secondary" aria-hidden="true">chevron_right</span>
            <span className="px-2 py-1.5 text-text-body">Jungian Type Analysis</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="text-left lg:col-span-7">
              <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                ARCHRON · Dynamic Typology
              </span>
              <h1 className="mt-4 font-serif text-fluid-h1 font-bold leading-tight text-text-heading">
                Jungian Type Analysis
              </h1>
              <p className="mt-2 text-lg text-accent font-serif italic">
                วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง
              </p>
              
              <p className="mt-6 max-w-xl text-base leading-relaxed text-text-body/90">
                สแกนและอ่านโครงสร้างความโน้มเอียงของ Ego ในการรับและตัดสินข้อมูล เพื่อทำความเข้าใจทิศทางพลังงานจิต (Introversion / Extraversion) พร้อมประเมิน Function Stack ค้นหากลไกป้องกันตัวและการตอบสนองยามตกอยู่ภายใต้ความเครียดเชิงลึกอย่างมีสติ
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded bg-gradient-to-br from-accent to-accent px-8 py-4 text-sm font-semibold tracking-[0.05em] text-text-inverse transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  จองเวลา / สอบถามคิว
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </a>
                <a
                  href="#pricing"
                  className="rounded border border-border/50 bg-bg-card/30 px-6 py-4 text-sm font-medium text-text-body transition-colors hover:bg-bg-card/60 hover:text-text-heading focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                >
                  ตรวจสอบราคาปกติ
                </a>
              </div>
            </div>

            {/* Right Interactive SVG Compass Widget */}
            <div className="flex flex-col items-center justify-center lg:col-span-5">
              <div className="relative h-[320px] w-[320px] rounded-full border border-border/30 bg-bg/40 p-4 backdrop-blur-sm">
                {/* SVG Compass Map */}
                <svg viewBox="0 0 320 320" className="h-full w-full">
                  <defs>
                    <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#C79A4A" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#C79A4A" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Outer Concentric Dotted Circle (Unconscious Shadow) */}
                  <circle cx="160" cy="160" r="130" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Ego Consciousness boundary circle */}
                  <circle cx="160" cy="160" r="90" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.6" />
                  
                  {/* Center Circle */}
                  <circle cx="160" cy="160" r="45" fill="none" stroke="var(--color-border)" strokeWidth="1" opacity="0.3" />

                  {/* Axis lines */}
                  <line x1="160" y1="30" x2="160" y2="290" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />
                  <line x1="30" y1="160" x2="290" y2="160" stroke="var(--color-border)" strokeWidth="1" opacity="0.4" />

                  {/* Active node highlight path */}
                  {activeFunc === "thinking" && <line x1="160" y1="30" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}
                  {activeFunc === "feeling" && <line x1="160" y1="290" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}
                  {activeFunc === "intuition" && <line x1="30" y1="160" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}
                  {activeFunc === "sensation" && <line x1="290" y1="160" x2="160" y2="160" stroke="var(--color-accent)" strokeWidth="1.5" />}

                  {/* Active Glowing Backdrop */}
                  {activeFunc === "thinking" && <circle cx="160" cy="30" r="24" fill="url(#gold-glow)" />}
                  {activeFunc === "feeling" && <circle cx="160" cy="290" r="24" fill="url(#gold-glow)" />}
                  {activeFunc === "intuition" && <circle cx="30" cy="160" r="24" fill="url(#gold-glow)" />}
                  {activeFunc === "sensation" && <circle cx="290" cy="160" r="24" fill="url(#gold-glow)" />}
                  {activeFunc === "ego" && <circle cx="160" cy="160" r="30" fill="url(#gold-glow)" />}

                  {/* Nodes */}
                  {/* Thinking (Top) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveFunc("thinking")}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveFunc("thinking")}
                    aria-label="Thinking function"
                  >
                    <circle cx="160" cy="30" r="14" fill="#080B16" stroke={activeFunc === "thinking" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
                    <text x="160" y="34" textAnchor="middle" fill={activeFunc === "thinking" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="11" fontWeight="bold" fontFamily="monospace">T</text>
                  </g>

                  {/* Feeling (Bottom) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveFunc("feeling")}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveFunc("feeling")}
                    aria-label="Feeling function"
                  >
                    <circle cx="160" cy="290" r="14" fill="#080B16" stroke={activeFunc === "feeling" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
                    <text x="160" y="294" textAnchor="middle" fill={activeFunc === "feeling" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="11" fontWeight="bold" fontFamily="monospace">F</text>
                  </g>

                  {/* Intuition (Left) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveFunc("intuition")}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveFunc("intuition")}
                    aria-label="Intuition function"
                  >
                    <circle cx="30" cy="160" r="14" fill="#080B16" stroke={activeFunc === "intuition" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
                    <text x="30" y="164" textAnchor="middle" fill={activeFunc === "intuition" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="11" fontWeight="bold" fontFamily="monospace">N</text>
                  </g>

                  {/* Sensation (Right) */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveFunc("sensation")}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveFunc("sensation")}
                    aria-label="Sensation function"
                  >
                    <circle cx="290" cy="160" r="14" fill="#080B16" stroke={activeFunc === "sensation" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="1.5" />
                    <text x="290" y="164" textAnchor="middle" fill={activeFunc === "sensation" ? "var(--color-accent)" : "var(--color-text-heading)"} fontSize="11" fontWeight="bold" fontFamily="monospace">S</text>
                  </g>

                  {/* Ego Center Node */}
                  <g
                    className="cursor-pointer"
                    onClick={() => setActiveFunc("ego")}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveFunc("ego")}
                    aria-label="Ego center"
                  >
                    <circle cx="160" cy="160" r="18" fill="#121826" stroke={activeFunc === "ego" ? "var(--color-accent)" : "var(--color-border)"} strokeWidth="2" />
                    <circle cx="160" cy="160" r="4" fill="var(--color-accent)" />
                  </g>
                </svg>

                <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-bg-card px-2 py-0.5 text-[9px] font-semibold tracking-wider text-text-secondary/80 uppercase">
                  Psyche Compass
                </span>
              </div>

              {/* Compass Interactive Description Panel */}
              <div className="mt-6 w-full max-w-[340px] rounded-md border border-border/30 bg-bg-card/40 p-4 text-center backdrop-blur-sm">
                <h4 className="font-serif text-sm font-semibold text-accent">
                  {COMPASS_DETAILS[activeFunc].title}
                </h4>
                <p className="text-[11px] uppercase tracking-wider text-text-secondary/75">
                  {COMPASS_DETAILS[activeFunc].subtitle}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-text-body/90">
                  {COMPASS_DETAILS[activeFunc].desc}
                </p>
                <p className="mt-2 border-t border-border/20 pt-2 text-[11px] italic text-accent/80">
                  {COMPASS_DETAILS[activeFunc].stack}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scope Section */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center lg:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/85">
            Scope of Analysis
          </span>
          <h2 className="mt-2 font-serif text-3xl text-text-heading">ขอบเขตหัวข้อการวิเคราะห์</h2>
          <p className="mt-3 text-sm text-text-secondary/70">
            สิ่งที่จะได้รับการตรวจสอบและสะท้อนกลับในคู่มือรายงานรายบุคคล
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SCOPE.map((s) => (
            <div
              key={s.title}
              className="rounded-lg border border-border/20 bg-bg-card/40 p-6 transition-all hover:border-border/50 hover:bg-bg-card/60 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/20 bg-bg text-accent">
                <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-text-heading">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Process Section */}
      <section className="border-y border-border/30 bg-bg px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/85">
              Service Flow
            </span>
            <h2 className="mt-2 font-serif text-3xl text-text-heading">ขั้นตอนและกระบวนการรับคำวิเคราะห์</h2>
          </div>

          <div className="relative space-y-12 before:absolute before:left-4 before:top-2 before:h-[90%] before:w-px before:bg-border/50 md:before:left-1/2 md:before:-translate-x-1/2">
            {STEPS.map((step, idx) => (
              <div
                key={step.no}
                className={`relative flex flex-col md:flex-row md:justify-between items-start ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Connector Dot */}
                <div className="absolute left-4 top-2 h-4 w-4 -translate-x-1.5 rounded-full border-2 border-accent bg-bg md:left-1/2 md:top-2 md:-translate-x-2" />

                {/* Left/Right Container */}
                <div className="w-full pl-10 md:w-[45%] md:pl-0 md:text-right">
                  {idx % 2 === 0 ? (
                    <div className="md:pr-4">
                      <span className="font-serif text-3xl font-bold text-accent/40">{step.no}</span>
                      <h3 className="mt-2 font-serif text-lg font-semibold text-text-heading">{step.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary/70">{step.desc}</p>
                    </div>
                  ) : null}
                </div>

                <div className="w-full pl-10 md:w-[45%] md:pl-0 md:text-left">
                  {idx % 2 === 1 ? (
                    <div className="md:pl-4">
                      <span className="font-serif text-3xl font-bold text-accent/40">{step.no}</span>
                      <h3 className="mt-2 font-serif text-lg font-semibold text-text-heading">{step.title}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary/70">{step.desc}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Anniversary Promotion */}
      <section id="pricing" className="mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent/85">
            Rates & Promotion
          </span>
          <h2 className="mt-2 font-serif text-3xl text-text-heading">ค่าบริการและการวิเคราะห์ข้อมูล</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-12 md:items-stretch">
          {/* Regular Price */}
          <div className="rounded-lg border border-border/40 bg-bg-card/30 p-8 text-center flex flex-col justify-between md:col-span-5">
            <div>
              <span className="text-xs font-semibold tracking-wider text-text-secondary/60 uppercase">ราคาปกติ</span>
              <p className="mt-4 font-serif text-5xl font-bold text-text-heading">399<span className="ml-1 text-sm text-text-secondary/60">บาท / ครั้ง</span></p>
              <div className="mt-2 text-xs text-text-secondary/75">
                (ผ่านพ้นกำหนดโปรโมชั่นราคาทดลอง 249 บาท เมื่อวันที่ 30 มิถุนายน 2569 แล้ว)
              </div>
            </div>
            <div className="mt-6 border-t border-border/20 pt-4 text-xs text-text-secondary/70">
              ครอบคลุมเซสชันสัมภาษณ์ 90 นาที และรายงานสรุปทัศนคติ Ego 2–3 หน้า
            </div>
          </div>

          {/* Birthday Special Promotion Banner */}
          <div className="rounded-lg border border-accent/50 bg-gradient-to-br from-bg via-bg-card/30 to-bg p-8 flex flex-col justify-between md:col-span-7">
            <div>
              <span className="inline-block rounded bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                กิจกรรมพิเศษวันเกิดแบรนด์
              </span>
              <h3 className="mt-3 font-serif text-xl font-bold text-text-heading">
                วิเคราะห์ฟรีสิทธิ์พิเศษ (16 กรกฎาคม)
              </h3>
              <p className="mt-2 text-xs text-accent/80 font-serif">
                จำนวนจำกัด 5 สิทธิ์อิงตามลำดับเวลาในการทำกิจกรรมครบถ้วน
              </p>
              
              <div className="mt-4 space-y-2.5 border-t border-border/20 pt-4 text-left">
                <div className="flex gap-2 text-xs text-text-body">
                  <span className="material-symbols-outlined text-[16px] text-accent shrink-0">check_circle</span>
                  <span>อวยพรวันเกิดเพจในโพสต์กิจกรรมวันที่ 16 กรกฎาคม 2569</span>
                </div>
                <div className="flex gap-2 text-xs text-text-body">
                  <span className="material-symbols-outlined text-[16px] text-accent shrink-0">check_circle</span>
                  <span>แชร์โพสต์โปรโมตกิจกรรมการรีแบรนด์ (Rebranding) จากชื่อเดิม <strong>The Soul&apos;s Compass - Moonlight</strong> สู่ชื่อใหม่ <strong>Archron</strong> ไปยังโปรไฟล์ส่วนตัวของคุณ</span>
                </div>
                <div className="flex gap-2 text-xs text-text-body">
                  <span className="material-symbols-outlined text-[16px] text-accent shrink-0">check_circle</span>
                  <span>ตกลงส่งรีวิวสะท้อนผลสัมภาษณ์ตามความเป็นจริงผ่านหน้าเพจ Archron หลังเสร็จสิ้นเซสชันการวิเคราะห์</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-xs text-text-secondary/75 italic">
              * กิจกรรมนี้จัดทำขึ้นโดยตรงผ่านช่องทางหลักของ Archron เท่านั้น
            </div>
          </div>
        </div>
      </section>

      {/* Limitations / Boundaries callout */}
      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-lg border border-accent/30 bg-bg-card/30 p-8 backdrop-blur-sm">
          <h3 className="font-serif text-xl text-text-heading">กรอบขอบเขตทางวิชาการและข้อตกลง</h3>
          <ul className="mt-4 space-y-3.5">
            {BOUNDARIES.map((b) => (
              <li key={b} className="flex gap-3 text-xs leading-relaxed text-text-secondary/80">
                <span className="material-symbols-outlined shrink-0 text-[18px] text-accent">
                  check_small
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-border/30 bg-bg-card/20 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-text-heading">ติดต่อสอบถาม &amp; นัดคิววิเคราะห์</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary/70">
            ติดต่อผ่านช่องทางหลักของทีมวิเคราะห์เพื่อตรวจรับสิทธิ์ จองคิวสัมภาษณ์ หรือสอบถามกติกาเพิ่มเติมได้โดยตรง
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 rounded-md border border-border/30 bg-bg-card/40 p-4 text-left transition-colors hover:border-accent/50 hover:bg-bg-card/60 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-bg text-accent">
                  <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-[10px] tracking-wider text-text-secondary/50 uppercase">{c.label}</span>
                  <span className="text-sm font-semibold text-text-heading group-hover:text-accent">{c.value}</span>
                </span>
              </a>
            ))}
          </div>

          <p className="mt-10 text-xs text-text-secondary/60">
            ต้องการศึกษาทฤษฎีจิตวิทยาก่อนสัมภาษณ์?{" "}
            <Link href="/concepts/psychological-types" className="text-accent hover:underline focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:outline-none rounded px-1.5 py-0.5">
              อ่านข้อมูล Psychological Types เพิ่มเติม
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
