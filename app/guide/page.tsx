import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jungian Type Analysis — วิเคราะห์ประเภททางจิต | The Soul's Compass",
  description:
    "บริการวิเคราะห์โครงสร้าง Ego ผ่านกรอบ Jungian Psychological Types — อ่านแนวโน้มการรับรู้โลกอย่างมีบริบท ไม่ใช่การวินิจฉัยทางการแพทย์หรือการทำนายอนาคต",
};

const SCOPE = [
  { icon: "compare_arrows", title: "Object / Subject Orientation", desc: "แนวโน้มว่า Ego ให้น้ำหนักกับโลกภายนอกหรือโลกภายในมากกว่า" },
  { icon: "psychology", title: "Principal Function", desc: "ฟังก์ชันหลักที่ใช้รับและตัดสินข้อมูลเป็นทางหลัก" },
  { icon: "stacks", title: "Function Stack", desc: "ลำดับการทำงาน: Dominant / Auxiliary / Inferior" },
  { icon: "bolt", title: "Ego Pattern", desc: "รูปแบบของ Ego และแนวโน้มการรับมือแรงกดดัน" },
  { icon: "description", title: "รายงานสรุป", desc: "เอกสารสรุปผลประมาณ 2–3 หน้า" },
  { icon: "schedule", title: "เวลาพูดคุย", desc: "เซสชันสนทนาประมาณ 1 ชั่วโมง 30 นาที" },
];

const STEPS = [
  { no: "01", title: "ติดต่อ / นัดหมาย", desc: "ทักผ่านช่องทางด้านล่างเพื่อเลือกวันเวลาที่สะดวก" },
  { no: "02", title: "ยืนยันการชำระเงิน", desc: "ชำระและส่งหลักฐานการโอนเพื่อยืนยันการนัดหมาย" },
  { no: "03", title: "เซสชันพูดคุย", desc: "สนทนาเชิงลึกประมาณ 1 ชม. 30 นาที ตามกรอบทฤษฎี" },
  { no: "04", title: "รับรายงานสรุป", desc: "ได้เอกสารสรุปแนวโน้มของ Ego ประมาณ 2–3 หน้า" },
];

const BOUNDARIES = [
  "เป็นการสะท้อนโครงสร้างบุคลิกภาพและรูปแบบการรับรู้โลกตามแนว Jungian Psychological Types",
  "ไม่ใช่การวินิจฉัยทางการแพทย์ จิตเวช หรือการบำบัด",
  "ไม่ใช่การทำนายอนาคต และไม่ใช่การทายโชค",
  "ผลลัพธ์มีไว้เพื่อช่วยให้เข้าใจตนเอง เห็น pattern ของ Ego และนำไปสะท้อนตนเองอย่างมีสติ",
];

const CONTACTS = [
  { icon: "call", label: "โทรศัพท์", value: "081-538-2404", href: "tel:0815382404", external: false },
  { icon: "chat", label: "LINE", value: "phasin_pasumart", href: "https://line.me/ti/p/~phasin_pasumart", external: true },
  { icon: "person", label: "Facebook ส่วนตัว", value: "Phasin", href: "https://www.facebook.com/phasin.phasin.7", external: true },
  { icon: "groups", label: "Facebook Page", value: "The Soul's Compass", href: "https://www.facebook.com/profile.php?id=61561438596973", external: true },
];

export default function GuidePage() {
  return (
    <main>
      {/* Hero */}
      <section className="scroll-reveal relative overflow-hidden border-b border-slate-boundary/30 px-6 py-24 md:py-32">
        <div className="hero-gradient pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-burnished-gold/80">
            The Soul&apos;s Compass · Moonlight
          </span>
          <h1 className="mt-5 font-serif text-4xl font-bold text-on-surface md:text-5xl">
            Jungian Type Analysis
          </h1>
          <p className="mt-3 text-base text-on-surface-variant/70">
            วิเคราะห์โครงสร้าง Ego ผ่านกรอบ Jungian Psychological Types
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant/80">
            อ่าน “แนวโน้ม” ว่า Ego ของคุณรับโลกอย่างไร ให้ความสำคัญกับ Object หรือ Subject มากกว่า
            ใช้ Function ใดเป็นทางหลัก และมีแนวโน้มรับมือแรงกดดันอย่างไร — อย่างมีบริบทและอ้างอิงกรอบทฤษฎี
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-burnished-gold px-9 py-4 text-sm font-semibold tracking-[0.05em] text-deep-navy transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            >
              นัดหมาย / สอบถาม
              <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1.5">
                arrow_forward
              </span>
            </a>
            <span className="text-sm text-on-surface-variant/70">
              ราคาทดลอง <span className="font-semibold text-burnished-gold">249 บาท</span> · ถึง 30 มิ.ย. 2569
            </span>
          </div>
        </div>
      </section>

      {/* Scope */}
      <section className="scroll-reveal mx-auto max-w-5xl px-6 py-20">
        <h2 className="font-serif text-3xl text-on-surface">ขอบเขตการวิเคราะห์</h2>
        <p className="mt-3 text-on-surface-variant/70">สิ่งที่คุณจะได้รับจากการวิเคราะห์หนึ่งครั้ง</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCOPE.map((s) => (
            <div
              key={s.title}
              className="rounded-md border border-slate-boundary/40 bg-surface-container p-6"
            >
              <span className="material-symbols-outlined text-[32px] text-burnished-gold">{s.icon}</span>
              <h3 className="mt-3 font-serif text-lg text-on-surface">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="scroll-reveal border-y border-slate-boundary/30 bg-surface-container-lowest px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-serif text-3xl text-on-surface">ขั้นตอนการเข้ารับบริการ</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.no}>
                <span className="font-serif text-3xl text-burnished-gold/50">{step.no}</span>
                <div className="mt-3 mb-4 h-px w-10 bg-burnished-gold/30" />
                <h3 className="font-serif text-lg text-on-surface">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boundaries / academic scope */}
      <section className="scroll-reveal mx-auto max-w-3xl px-6 py-20">
        <div className="rounded-md border border-burnished-gold/30 bg-surface-container p-8 md:p-10">
          <h2 className="font-serif text-2xl text-on-surface">กรอบวิชาการ และสิ่งที่บริการนี้ “ไม่ทำ”</h2>
          <ul className="mt-5 space-y-3">
            {BOUNDARIES.map((b) => (
              <li key={b} className="flex gap-3 text-base leading-relaxed text-on-surface-variant/80">
                <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-burnished-gold">
                  check_small
                </span>
                {b}
              </li>
            ))}
          </ul>
          <p className="mt-6 border-l-2 border-burnished-gold/40 pl-4 text-sm italic leading-relaxed text-on-surface-variant/70">
            “ไม่ใช่การทายโชค แต่เป็นการสะท้อนโครงสร้าง Ego และรูปแบบการรับรู้โลกของคุณ”
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="scroll-reveal mx-auto max-w-3xl px-6 pb-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-burnished-gold/40 bg-surface-container-low p-7">
            <span className="text-xs font-semibold tracking-[0.05em] text-burnished-gold">ราคาทดลอง</span>
            <p className="mt-3 font-serif text-4xl text-on-surface">249<span className="ml-1 text-lg text-on-surface-variant/70">บาท / ครั้ง</span></p>
            <p className="mt-2 text-sm text-on-surface-variant/60">ใช้ได้ถึง 30 มิถุนายน 2569</p>
          </div>
          <div className="rounded-md border border-slate-boundary/40 bg-surface-container-low p-7">
            <span className="text-xs font-semibold tracking-[0.05em] text-on-surface-variant/60">ราคาปกติ</span>
            <p className="mt-3 font-serif text-4xl text-on-surface-variant/80">399<span className="ml-1 text-lg text-on-surface-variant/60">บาท / ครั้ง</span></p>
            <p className="mt-2 text-sm text-on-surface-variant/60">เริ่ม 1 กรกฎาคม 2569</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-reveal mt-12 border-t border-slate-boundary/30 bg-surface-container-low px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-on-surface">นัดหมาย / สอบถาม</h2>
          <p className="mx-auto mt-3 max-w-xl text-on-surface-variant/70">
            เลือกช่องทางที่สะดวก — นัดหมาย ชำระเงิน และยืนยันการรับบริการผ่านช่องทางติดต่อโดยตรง
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 rounded-md border border-slate-boundary/40 bg-surface-container p-5 text-left transition-colors hover:border-burnished-gold/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-burnished-gold/30 text-burnished-gold">
                  <span className="material-symbols-outlined text-[20px]">{c.icon}</span>
                </span>
                <span className="flex flex-col">
                  <span className="text-xs tracking-[0.04em] text-on-surface-variant/60">{c.label}</span>
                  <span className="text-base text-on-surface group-hover:text-burnished-gold">{c.value}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm text-on-surface-variant/60">
            อยากเข้าใจพื้นฐานทฤษฎีก่อน?{" "}
            <Link href="/concepts/psychological-types" className="text-burnished-gold hover:underline">
              อ่านแนวคิด Psychological Types
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
