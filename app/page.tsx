import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ConceptIcon, ScholarIcon, SynthesisIcon } from "@/components/icons";
import { RecentlyViewed } from "@/components/recently-viewed";
import { LoopCarousel } from "@/components/loop-carousel";
import { DisciplineCard } from "@/components/discipline-card";
import { DISCIPLINES } from "@/lib/content/disciplines";
import { VesicaPattern } from "@/components/hero/vesica-pattern";

type Pillar = {
  Icon: ComponentType<{ className?: string }>;
  accent: string; // CSS var จาก Cosmology tokens เท่านั้น
  title: ReactNode;
  desc: ReactNode;
};

// สามเสาหลัก "สิ่งที่เราทำ" — การ์ดหน้ากระดาษ (ทองเฉพาะจุดนำสายตาในหัวข้อ · เนื้อความเน้นด้วยงาช้าง)
const PILLARS: Pillar[] = [
  {
    Icon: ConceptIcon,
    accent: "var(--cos-sapientia)",
    title: (
      <>
        เชื่อม<span className="text-soft-gold">ศาสตร์ที่ถูกแยกขาด</span>
      </>
    ),
    desc: (
      <>
        จิตวิทยาศึกษาจิตใจ ปรัชญาศึกษาความจริง ภาษาศาสตร์ศึกษาภาษา แต่มนุษย์ไม่เคยดำรงอยู่เป็น
        <span className="font-medium text-ivory">เสี้ยวส่วน</span> — ARCHRON เชื่อมกลับเป็น
        <span className="font-medium text-ivory">องค์รวม</span>
      </>
    ),
  },
  {
    Icon: ScholarIcon,
    accent: "var(--cos-psyche)",
    title: (
      <>
        อ่านต้นฉบับ <span className="text-soft-gold">เข้าใจบริบท</span>
      </>
    ),
    desc: (
      <>
        อ่านจากงาน<span className="font-medium text-ivory">ต้นทาง</span>ในบริบทประวัติศาสตร์ของมัน แยก
        <span className="font-medium text-ivory">ข้อเท็จจริง แหล่งที่มา และการตีความ</span>ออกจากกัน
        เพื่อให้ความรู้ไม่กลายเป็นคำกล่าวลอย ๆ ที่ไร้น้ำหนัก
      </>
    ),
  },
  {
    Icon: SynthesisIcon,
    accent: "var(--cos-mercurius)",
    title: (
      <>
        เปรียบเทียบ <span className="text-soft-gold">สังเคราะห์</span> ตั้งคำถามใหม่
      </>
    ),
    desc: (
      <>
        ความจริงปรากฏผ่านการ<span className="font-medium text-ivory">เปรียบเทียบ วิพากษ์ และสังเคราะห์</span> —
        ARCHRON บูรณาการและจัดระเบียบความรู้ขึ้นใหม่
      </>
    ),
  },
];

// บันทึกขอบกระดาษ 4 มุมของเพลท (แสดงเฉพาะจอกว้าง)
const ANNOTATIONS: { corner: string; title: string; body: string }[] = [
  {
    corner: "left-14 top-16 text-left",
    title: "แผนที่ความรู้",
    body: "ทุกศาสตร์เชื่อมถึงกัน — แต่ละแขนงคือเลนส์ที่มนุษยชาติใช้เฝ้ามองตนเอง",
  },
  {
    corner: "right-14 top-16 text-right",
    title: "หอดูดาวแห่งแบบแผน",
    body: "สัญลักษณ์ ตำนาน และความคิด หวนคืนซ้ำข้ามกาลเวลา",
  },
  {
    corner: "bottom-28 left-14 text-left",
    title: "การวิเคราะห์เปรียบเทียบ",
    body: "เทียบตำนานกับพิธีกรรม ภาษากับสัญลักษณ์ จิตกับสสาร — โครงสร้างที่มองไม่เห็นจึงปรากฏ",
  },
  {
    corner: "bottom-28 right-14 text-right",
    title: "จดหมายเหตุที่มีชีวิต",
    body: "ทุกข้อความคือบทสนทนาข้ามเวลา ผู้อ่านทุกคนคือส่วนหนึ่งของคลัง",
  },
];

// ── ฉากหลังเพลท: กริดแผนที่ + วงโคจร + โครงข่ายดาว (SVG ล้วน ไม่มี JS/รูป) ──
function PlateSky() {
  return (
    <svg
      className="absolute inset-0 block h-full w-full"
      viewBox="0 0 1440 1000"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <path id="hero-arc" d="M 720 500 m -338 0 a 338 338 0 1 1 676 0" />
        {/* กริด 2 ชั้น: เส้นหลักทุก 120 · เส้นรองทุก 30 */}
        <pattern id="hero-grid" width="120" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M30 0v120M60 0v120M90 0v120M0 30h120M0 60h120M0 90h120"
            stroke="var(--color-ink)"
            strokeOpacity=".022"
            strokeWidth="1"
          />
          <path d="M120 0H0V120" stroke="var(--color-ink)" strokeOpacity=".055" strokeWidth="1" />
        </pattern>
        <radialGradient id="hero-grid-fade" cx="50%" cy="46%" r="72%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="78%" stopColor="#fff" stopOpacity=".55" />
          <stop offset="100%" stopColor="#fff" stopOpacity=".18" />
        </radialGradient>
        <mask id="hero-grid-mask">
          <rect width="1440" height="1000" fill="url(#hero-grid-fade)" />
        </mask>
      </defs>

      {/* ชั้นกริด (จางออกทางขอบ ไม่ตีกับบันทึกมุม) */}
      <rect width="1440" height="1000" fill="url(#hero-grid)" mask="url(#hero-grid-mask)" />

      {/* เส้นเล็งกลาง + กากบาทจุดตัด */}
      <g stroke="var(--color-gold)" strokeOpacity=".10">
        <path d="M720 40v880M60 500h1320" />
      </g>
      <g stroke="var(--color-gold)" strokeOpacity=".2">
        <path d="M720 484v32M704 500h32" />
      </g>

      {/* ขีดพิกัดตามขอบเพลท (ทุก 60px ทั้งสี่ด้าน) */}
      <g stroke="var(--color-gold)" strokeOpacity=".35">
        <path d="M60 26H1380" strokeWidth="7" strokeDasharray="1 59" />
        <path d="M60 974H1380" strokeWidth="7" strokeDasharray="1 59" />
        <path d="M26 80V920" strokeWidth="7" strokeDasharray="1 59" />
        <path d="M1414 80V920" strokeWidth="7" strokeDasharray="1 59" />
      </g>

      {/* วงโคจรศูนย์กลางสามชั้น */}
      <g stroke="var(--color-gold)">
        <circle cx="720" cy="500" r="392" strokeOpacity=".16" />
        <circle cx="720" cy="500" r="338" strokeOpacity=".22" />
        <circle cx="720" cy="500" r="285" strokeOpacity=".10" strokeDasharray="1 7" />
      </g>

      {/* อักษรโค้งตามวง — ornamental Latin (เนื้อหาจริงเป็นไทยกลางเพลท) */}
      <text
        fontSize="13"
        letterSpacing="7"
        fill="var(--color-gold)"
        fillOpacity=".55"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <textPath href="#hero-arc" startOffset="14%">
          TO KNOW HUMANITY IS TO ILLUMINATE THE ETERNAL PATTERN
        </textPath>
      </text>

      {/* ดาวประจำวง + ดาวเหนือ */}
      <g fill="var(--color-soft-gold)">
        <circle cx="720" cy="108" r="3" fillOpacity=".9" />
        <circle cx="382" cy="500" r="2.4" fillOpacity=".7" />
        <circle cx="1058" cy="500" r="2.4" fillOpacity=".7" />
      </g>
      <path
        d="M720 92l4 12 12 4-12 4-4 12-4-12-12-4 12-4z"
        fill="var(--color-soft-gold)"
        fillOpacity=".8"
      />

      {/* โครงข่ายดาว 4 กลุ่ม (โทน prima / psyche / mercurius / sapientia) */}
      <g stroke="var(--cos-prima)" strokeOpacity=".22">
        <path d="M150 130L245 96L330 150L288 235L180 210z M245 96L288 235 M330 150L430 120" />
      </g>
      <g fill="var(--color-ink)" fillOpacity=".55">
        <circle cx="150" cy="130" r="2" />
        <circle cx="245" cy="96" r="2.6" />
        <circle cx="330" cy="150" r="2" />
        <circle cx="288" cy="235" r="2.2" />
        <circle cx="180" cy="210" r="1.7" />
        <circle cx="430" cy="120" r="1.7" />
      </g>
      <g stroke="var(--cos-psyche)" strokeOpacity=".26">
        <path d="M1130 90L1215 140L1300 105 M1215 140L1245 225L1345 250 M1245 225L1150 200" />
      </g>
      <g fill="var(--color-gold)" fillOpacity=".6">
        <circle cx="1130" cy="90" r="2.2" />
        <circle cx="1215" cy="140" r="2.8" />
        <circle cx="1300" cy="105" r="1.8" />
        <circle cx="1245" cy="225" r="2.2" />
        <circle cx="1345" cy="250" r="1.8" />
        <circle cx="1150" cy="200" r="1.6" />
      </g>
      <g stroke="var(--cos-mercurius)" strokeOpacity=".22">
        <path d="M130 760L225 720L305 790L255 870 M225 720L255 870 M305 790L400 760" />
        <circle cx="165" cy="905" r="34" strokeDasharray="1 6" />
      </g>
      <g fill="var(--color-ink)" fillOpacity=".5">
        <circle cx="130" cy="760" r="1.8" />
        <circle cx="225" cy="720" r="2.4" />
        <circle cx="305" cy="790" r="2" />
        <circle cx="255" cy="870" r="1.8" />
        <circle cx="400" cy="760" r="1.6" />
      </g>
      <g stroke="var(--cos-prima)" strokeOpacity=".2">
        <path d="M1140 780L1230 740L1320 790L1305 880L1200 895z M1230 740L1305 880" />
      </g>
      <g stroke="var(--color-gold)" strokeOpacity=".22">
        <circle cx="1310" cy="640" r="40" />
        <path d="M1310 600l34.6 20v40l-34.6 20-34.6-20v-40z" />
      </g>
      <g fill="var(--color-soft-gold)" fillOpacity=".5">
        <circle cx="1140" cy="780" r="2" />
        <circle cx="1230" cy="740" r="2.6" />
        <circle cx="1320" cy="790" r="1.9" />
        <circle cx="1305" cy="880" r="2.1" />
        <circle cx="1200" cy="895" r="1.7" />
      </g>

      {/* ดาวหว่านละเอียด */}
      <g fill="var(--color-ink)" fillOpacity=".32">
        <circle cx="540" cy="150" r="1.2" />
        <circle cx="905" cy="130" r="1.4" />
        <circle cx="1010" cy="330" r="1.1" />
        <circle cx="450" cy="330" r="1.2" />
        <circle cx="95" cy="420" r="1.3" />
        <circle cx="1355" cy="430" r="1.2" />
        <circle cx="620" cy="925" r="1.3" />
        <circle cx="855" cy="940" r="1.2" />
        <circle cx="480" cy="850" r="1.1" />
        <circle cx="990" cy="860" r="1.4" />
      </g>
    </svg>
  );
}

// ── ปกเล่ม ARCHRON — tome ปิดจารตราเวสิกา (ลายเส้น SVG) ──
function TomeCover() {
  return (
    <svg
      viewBox="0 0 440 300"
      fill="none"
      stroke="var(--color-soft-gold)"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block h-auto w-full"
      aria-hidden="true"
    >
      <ellipse
        cx="220"
        cy="284"
        rx="132"
        ry="9"
        fill="var(--color-charcoal-ink)"
        fillOpacity=".55"
        stroke="none"
      />
      {/* บล็อกหน้ากระดาษ (ขอบขวา + ล่าง) */}
      <g strokeOpacity=".55" strokeWidth="1">
        <path d="M318 34l12 8v206l-12 8" />
        <path d="M322 40v210M326 44v204" />
        <path d="M126 256l10 7h182" />
      </g>
      {/* สันเล่มซ้าย */}
      <path
        d="M108 30h18v226h-18c-5-2-8-5-8-12V42c0-7 3-10 8-12z"
        fill="var(--color-paper-sunken)"
        strokeWidth="1.6"
        strokeOpacity=".9"
      />
      <g strokeOpacity=".6" strokeWidth="1">
        <path d="M104 66h22M104 150h22M104 234h22" />
      </g>
      {/* หน้าปก */}
      <rect
        x="126"
        y="30"
        width="192"
        height="226"
        fill="var(--color-surface-container-low)"
        strokeWidth="2"
        strokeOpacity=".95"
      />
      {/* กรอบจารคู่ + ขีดมุม (ล้อกรอบเพลทใหญ่) */}
      <rect x="140" y="46" width="164" height="194" strokeWidth="1" strokeOpacity=".7" />
      <rect x="146" y="52" width="152" height="182" strokeWidth="1" strokeOpacity=".3" strokeDasharray="1 4" />
      <g strokeWidth="1.2" strokeOpacity=".85">
        <path d="M140 58v-12h12M292 46h12v12M140 228v12h12M292 240h12v-12" />
      </g>
      {/* ดาวเหนือตรา */}
      <path
        d="M222 74l3 9 9 3-9 3-3 9-3-9-9-3 9-3z"
        fill="var(--color-soft-gold)"
        fillOpacity=".9"
        stroke="none"
      />
      {/* ตราเวสิกา — สองวงซ้อน = การเชื่อมของศาสตร์ */}
      <g strokeWidth="1.3">
        <circle cx="204" cy="138" r="32" strokeOpacity=".85" />
        <circle cx="240" cy="138" r="32" strokeOpacity=".85" />
      </g>
      <circle cx="222" cy="138" r="2.6" fill="var(--color-soft-gold)" stroke="none" />
      <circle cx="222" cy="138" r="44" strokeOpacity=".25" strokeDasharray="1 5" />
      {/* แกนลงสู่ป้ายชื่อ */}
      <path d="M222 186v14" strokeOpacity=".5" />
      <path d="M196 200h52" strokeOpacity=".4" strokeWidth="1" />
      {/* ชื่อบนปก */}
      <text
        x="222"
        y="219"
        textAnchor="middle"
        fontSize="14.5"
        letterSpacing="5.5"
        fill="var(--color-soft-gold)"
        fillOpacity=".95"
        stroke="none"
        style={{ fontFamily: "var(--font-wordmark)" }}
      >
        ARCHRON
      </text>
      <text
        x="222"
        y="233"
        textAnchor="middle"
        fontSize="7.5"
        letterSpacing="3.4"
        fill="var(--color-muted)"
        stroke="none"
        style={{ fontFamily: "var(--font-body)" }}
      >
        TEMPUS · ARCHIVUM · VERITAS
      </text>
    </svg>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* ── HERO: แผ่นจารดาราศาสตร์ ─────────────────────────────── */}
      <section
        className="relative min-h-screen overflow-hidden"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 38%, var(--color-surface-container-low) 0%, color-mix(in srgb, var(--color-surface-container-low) 55%, var(--color-paper-sunken)) 55%, var(--color-paper-sunken) 100%)",
        }}
      >
        {/* กรอบเพลทคู่ + ขีดมุม */}
        <div className="plate-frame z-[5]">
          <span className="plate-tick" data-corner="tl" />
          <span className="plate-tick" data-corner="tr" />
          <span className="plate-tick" data-corner="bl" />
          <span className="plate-tick" data-corner="br" />
        </div>

        <PlateSky />

        {/* บันทึกขอบกระดาษ 4 มุม (จอกว้างเท่านั้น) */}
        {ANNOTATIONS.map((a) => (
          <div key={a.title} className={`absolute z-[8] hidden max-w-[200px] xl:block ${a.corner}`}>
            <h4 className="mb-1.5 text-[11px] font-semibold leading-relaxed text-soft-gold">{a.title}</h4>
            <p className="text-xs leading-[1.75] text-muted/90">{a.body}</p>
          </div>
        ))}

        {/* แกนกลางเพลท */}
        <div className="relative z-10 mx-auto flex max-w-[960px] flex-col items-center px-6 pb-36 pt-24 text-center">
          <span className="scroll-reveal text-[10.5px] font-semibold uppercase tracking-[0.34em] text-soft-gold/75">
            Estd · MMXXIII
          </span>
          <p
            className="scroll-reveal stagger-1 mt-4 pl-[0.22em] font-wordmark text-[length:var(--text-display)] font-semibold leading-[1.1] tracking-[0.22em] text-soft-gold"
            style={{ textShadow: "0 0 46px color-mix(in srgb, var(--color-gold) 22%, transparent)" }}
          >
            ARCHRON
          </p>
          <span className="scroll-reveal stagger-1 mt-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/55">
            A Living Library of Human Understanding
          </span>

          <h1 className="scroll-reveal stagger-2 mt-7 font-serif text-[length:clamp(1.35rem,2.4vw,1.8rem)] font-semibold leading-[1.6] text-ivory">
            จากความมืดของสิ่งที่ยังไม่รู้ <em className="italic text-soft-gold">สู่แสงแห่งความเข้าใจ</em>
            <span className="mt-1 block text-[0.72em] font-normal text-ink/65">
              คลังความเข้าใจมนุษย์ที่มีชีวิต — ตั้งแต่จุดกำเนิด ผ่านกาลเวลา
            </span>
          </h1>

          {/* ปกเล่มจารตรา */}
          <div className="scroll-reveal stagger-2 mx-auto mt-9 w-[min(400px,74vw)]">
            <TomeCover />
          </div>

          {/* แถบรายชื่อศาสตร์ */}
          <p className="scroll-reveal stagger-3 mt-7 max-w-[560px] text-[12.5px] font-medium leading-[2.1] text-soft-gold/85">
            จิตวิทยา<span className="mx-2 text-burnished-gold/80">·</span>ปรัชญา
            <span className="mx-2 text-burnished-gold/80">·</span>มานุษยวิทยา
            <span className="mx-2 text-burnished-gold/80">·</span>ตำนานวิทยา
            <span className="mx-2 text-burnished-gold/80">·</span>ภาษาศาสตร์
            <br />
            ประวัติศาสตร์<span className="mx-2 text-burnished-gold/80">·</span>ศาสนา
            <span className="mx-2 text-burnished-gold/80">·</span>ประสาทวิทยาศาสตร์
            <span className="mx-2 text-burnished-gold/80">·</span>ระบบสัญลักษณ์
          </p>

          <div className="scroll-reveal stagger-3 mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <Link href="/articles" className="btn btn-primary">
              เริ่มอ่านงานเขียน →
            </Link>
            <Link href="/concepts" className="btn btn-ghost">
              สำรวจคลังแนวคิด
            </Link>
          </div>
        </div>

        {/* ท้ายเพลท: คำขวัญ + เลขโรมัน + ผู้บันทึก */}
        <div className="absolute inset-x-0 bottom-8 z-[8] text-center">
          <p className="text-[11px] font-semibold leading-relaxed text-burnished-gold/75">
            ความจริงคือแบบแผน · แบบแผนคือความทรงจำ · ความทรงจำเป็นนิรันดร์
          </p>
          <p className="mt-1 font-wordmark text-[10px] tracking-[0.5em] text-muted/60">I · V · IX · XII · XVII</p>
          <p className="mt-2 font-serif text-[0.82rem] italic text-muted/75">
            บันทึกโดย <span className="font-wordmark not-italic tracking-[0.16em] text-soft-gold">ARCHEON</span> —
            ผู้แสวงหาต้นกำเนิด
          </p>
        </div>
      </section>

      {/* ── Pillars — การ์ดหน้ากระดาษ (สิ่งที่เราทำ) ────────────── */}
      <section className="mx-auto max-w-[1200px] px-6 py-28 md:py-36">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.Icon;
            return (
              <article key={i} className={`card-plate scroll-reveal stagger-${i + 1}`}>
                <span className="plate-tick" data-corner="tl" aria-hidden="true" />
                <span className="plate-tick" data-corner="br" aria-hidden="true" />
                <span className="flex items-center gap-3" style={{ color: p.accent }}>
                  <Icon className="h-6 w-6" />
                  <span
                    className="h-px flex-1 opacity-25"
                    style={{ backgroundColor: "currentcolor" }}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-5 font-serif text-[22px] font-semibold leading-snug text-on-surface">
                  {p.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-on-surface-variant/80">{p.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Knowledge Atlas ─────────────────────────────────────── */}
      <section className="relative overflow-hidden border-y border-slate-boundary/30 bg-surface-container-lowest px-6 py-20">
        <VesicaPattern cosmology="prima" className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 mx-auto max-w-[1200px]">
          <div className="mb-12 max-w-2xl">
            <span className="kicker mb-4 block">แผนที่ความรู้</span>
            <h2 className="mb-6 font-serif text-fluid-h2 font-medium text-on-surface">
              สิบสองแขนงของการเข้าใจมนุษย์
            </h2>
            <p className="text-lg leading-[1.8] text-on-surface-variant/70">
              การเข้าใจมนุษย์ไม่อาจอาศัยศาสตร์เดียว — แต่ละแขนงส่องสว่างซึ่งกันและกัน
              วางอยู่ในแผนที่เดียวที่เชื่อมโยงถึงกัน
            </p>
          </div>
          <LoopCarousel ariaLabel="สิบสองแขนงของการเข้าใจมนุษย์ — เลื่อนวนได้">
            {DISCIPLINES.map((d) => (
              <DisciplineCard key={d.key} entry={d} href={`/disciplines/${d.key}`} />
            ))}
          </LoopCarousel>
          <div className="mt-14 flex justify-center">
            <Link href="/disciplines" className="btn btn-ghost">
              ดูศาสตร์ทั้งหมด
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Viewed — continue reading */}
      <RecentlyViewed />

      {/* ── ปฏิญญา — ทองเฉพาะจุดนำสายตาเดียว ────────────────────── */}
      <section className="scroll-reveal mx-auto max-w-4xl px-6 py-24 text-center md:py-28">
        <div className="mb-4 font-serif text-[64px] leading-[0.3] text-burnished-gold/35" aria-hidden="true">
          “
        </div>
        <h2 className="font-serif text-fluid-h2 font-medium leading-[1.5] text-ivory">
          ARCHRON ไม่ได้ถามว่าควรคิดอะไร แต่ถามว่ามนุษย์
          <span className="text-soft-gold">เรียนรู้ที่จะคิด</span>มาอย่างไร
        </h2>
        <div className="mx-auto my-8 h-px w-16 bg-burnished-gold/30" />
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-[1.9] text-on-surface-variant/80">
          ARCHRON ไม่ได้ให้คำตอบสุดท้าย แต่ให้<span className="font-medium text-ivory">คำถามที่ดีกว่า</span>{" "}
          แผนที่ความรู้ที่ดีกว่า และภาษาสำหรับเข้าใจตนเองและโลกที่ดีกว่า — โดยวางแนวคิดไว้ในบริบทเดิมของมัน
          พร้อมเปิดพื้นที่ให้การเปรียบเทียบและการตั้งคำถามอย่างรับผิดชอบ
        </p>
        <Link
          href="/manifesto"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-burnished-gold transition-all hover:gap-3"
        >
          อ่านปฏิญญาฉบับเต็ม
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            arrow_forward
          </span>
        </Link>
      </section>
    </main>
  );
}
