import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";

export const metadata: Metadata = {
  title: "ปฐมบท ARCHRON — Manifesto & Founding Codex | ARCHRON",
  description:
    "ปฐมบทและรากฐานของ ARCHRON สำนักศึกษามนุษย์ที่เชื่อมศาสตร์ที่ถูกแยกขาดให้กลับมาเข้าใจมนุษย์อย่างเป็นองค์รวม — จุดยืน วิธีวิทยา คุณค่าแกน สัญลักษณ์ และหลักการก่อตั้ง",
};

const PURPOSE = [
  { field: "จิตวิทยา", studies: "ศึกษาจิตใจ" },
  { field: "ปรัชญา", studies: "ศึกษาความจริง" },
  { field: "มานุษยวิทยา", studies: "ศึกษาวัฒนธรรม" },
  { field: "ภาษาศาสตร์", studies: "ศึกษาภาษา" },
  { field: "ประวัติศาสตร์", studies: "ศึกษาอารยธรรม" },
  { field: "ประสาทวิทยาศาสตร์", studies: "ศึกษาสมอง" },
  { field: "ศาสนา", studies: "ศึกษาภาวะเหนือพ้น" },
];

const METHOD = [
  "อ่านจากต้นฉบับ",
  "เข้าใจบริบททางประวัติศาสตร์",
  "เปรียบเทียบข้ามศาสตร์",
  "วิเคราะห์โครงสร้างมโนทัศน์",
  "สังเคราะห์กรอบความคิดใหม่",
  "ทดสอบกับหลักฐาน",
  "ทบทวนเมื่อจำเป็น",
];

const VALUES = [
  "ความอยากรู้เชิงปัญญา",
  "ความถ่อมตนเชิงปัญญา",
  "หลักฐานมาก่อนอุดมการณ์",
  "บทสนทนาเหนือลัทธิ",
  "สำนึกทางประวัติศาสตร์",
  "ความแม่นยำเชิงมโนทัศน์",
  "การบูรณาการข้ามศาสตร์",
  "การสืบค้นอย่างต่อเนื่อง",
];

const LEXICON = [
  "มนุษย์",
  "ความหมาย",
  "สัญลักษณ์",
  "ภาษา",
  "แบบแผน",
  "ต้นกำเนิด",
  "การแปรเปลี่ยน",
  "การสืบค้น",
  "อารยธรรม",
  "จิต",
  "ตำนาน",
  "บทสนทนา",
];

const AVOID = [
  "self-help สำเร็จรูป",
  "แรงจูงใจฉาบฉวย",
  "manifestation",
  "productivity",
  "guru",
  "การตื่นรู้แบบสำเร็จรูป",
  "ความจริงสัมบูรณ์",
];

const FORMULA = ["มนุษย์", "วัฒนธรรม", "ภาษา", "สัญลักษณ์", "ความหมาย", "ความเข้าใจ"];

function SectionTitle({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-baseline gap-3">
      <span className="font-serif text-sm text-burnished-gold/60">{no}</span>
      <h2 className="font-serif text-[26px] font-medium leading-snug text-on-surface md:text-[30px]">
        {children}
      </h2>
    </div>
  );
}

export default function ManifestoPage() {
  return (
    <main className="pb-24">
      <PageHeader
        kicker="ARCHRON · ปฐมบท"
        title="สำนักศึกษามนุษย์ ข้ามผ่านห้วงเวลาและศาสตร์วิชา"
      />

      <div className="mx-auto max-w-2xl space-y-20 px-6">
        {/* นำ */}
        <section className="scroll-reveal space-y-6 text-lg leading-loose text-soft-ivory">
          <p>
            ARCHRON ไม่ใช่สำนักจิตวิทยา — ARCHRON คือ{" "}
            <strong className="text-on-surface">สำนักศึกษามนุษย์</strong>{" "}
            ที่สืบค้นต่อเนื่องถึงต้นกำเนิด การเปลี่ยนผ่าน และการก่อรูปของความเข้าใจที่มนุษย์
            มีต่อตนเอง ตลอดอารยธรรมและกาลเวลา
          </p>
          <p>
            ชื่อ ARCHRON มาจากรากศัพท์กรีกสองคำ — <em>archē</em> (ต้นกำเนิด หลักการแรก) และ{" "}
            <em>chronos</em> (กาลเวลา) ARCHRON ไม่สังกัดนักคิด ปรัชญา ศาสนา หรืออารยธรรมใดเพียงหนึ่งเดียว
            แต่เป็นพื้นที่ที่ทุกธรรมเนียมความคิดเข้ามาเป็นส่วนหนึ่งของบทสนทนาที่ใหญ่กว่า
          </p>
        </section>

        {/* เหตุที่ดำรงอยู่ */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๑">เหตุที่ ARCHRON ดำรงอยู่</SectionTitle>
          <p className="mb-8 text-lg leading-loose text-soft-ivory">
            ความรู้ของมนุษย์ถูกแยกออกเป็นเสี้ยวส่วน แต่ละศาสตร์ศึกษามนุษย์คนละด้าน
          </p>
          <dl className="mb-8 grid grid-cols-1 gap-x-8 gap-y-3 border-y border-ink/12 py-6 sm:grid-cols-2">
            {PURPOSE.map((p) => (
              <div key={p.field} className="flex items-baseline justify-between gap-4">
                <dt className="font-serif text-on-surface">{p.field}</dt>
                <dd className="text-sm text-on-surface-variant/70">{p.studies}</dd>
              </div>
            ))}
          </dl>
          <p className="text-lg leading-loose text-soft-ivory">
            ทว่ามนุษย์ไม่เคยดำรงอยู่เป็นเสี้ยวส่วน ARCHRON จึงดำรงอยู่เพื่อเชื่อมศาสตร์ที่ถูกแยกขาด
            เหล่านี้ให้กลับมาเป็นความเข้าใจมนุษย์ที่ต่อเนื่องเป็นองค์รวม
          </p>
        </section>

        {/* วิสัยทัศน์ + พันธกิจ */}
        <section className="scroll-reveal grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-[0.05em] text-burnished-gold/70">
              วิสัยทัศน์
            </h3>
            <p className="text-lg leading-relaxed text-soft-ivory">
              เป็นคลังความเข้าใจมนุษย์ที่มีชีวิตของโลก
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-xs font-semibold tracking-[0.05em] text-burnished-gold/70">
              พันธกิจ
            </h3>
            <p className="text-lg leading-relaxed text-soft-ivory">
              วิจัย เปรียบเทียบ สังเคราะห์ และจัดระเบียบความรู้สะสมของมนุษยชาติ
              ให้เป็นกรอบความคิดที่วิวัฒน์ได้ ซึ่งทำให้เราเข้าใจความเป็นมนุษย์ได้ลึกขึ้น
            </p>
          </div>
        </section>

        {/* ความเชื่อแกน */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๒">ความเชื่อแกน</SectionTitle>
          <p className="mb-6 text-lg leading-loose text-soft-ivory">
            ARCHRON ไม่เชื่อว่านักคิดคนใดถือครองความจริงทั้งหมด ไม่ใช่ Jung ไม่ใช่ Freud
            ไม่ใช่ Adler ไม่ใช่ Lacan ไม่ใช่ Nietzsche ไม่ใช่ Laozi และไม่ใช่วิทยาศาสตร์สมัยใหม่
          </p>
          <blockquote className="border-l-2 border-antique-gold/40 bg-surface-container py-5 pl-6 pr-5 font-serif text-lg leading-relaxed text-on-surface">
            ทุกธรรมเนียมเผยให้เห็นความเป็นมนุษย์เพียงด้านหนึ่ง ความจริงปรากฏขึ้นผ่านบทสนทนา
            การเปรียบเทียบ การวิพากษ์ การสังเคราะห์ และการสืบค้นที่ไม่สิ้นสุด
          </blockquote>
        </section>

        {/* สิ่งที่มอบ */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๓">สิ่งที่ ARCHRON มอบให้สังคม</SectionTitle>
          <p className="mb-6 text-lg leading-loose text-soft-ivory">
            ARCHRON ไม่ได้ให้คำตอบสุดท้าย แต่ให้สิ่งที่ทำให้เราคิดต่อได้ดีขึ้น
          </p>
          <ul className="space-y-3 text-lg text-soft-ivory">
            <li className="flex gap-3">
              <span className="text-burnished-gold">—</span> คำถามที่ดีกว่า
            </li>
            <li className="flex gap-3">
              <span className="text-burnished-gold">—</span> แผนที่ความรู้ที่ดีกว่า
            </li>
            <li className="flex gap-3">
              <span className="text-burnished-gold">—</span> ภาษาสำหรับเข้าใจตนเองและโลกที่ดีกว่า
            </li>
          </ul>
          <p className="mt-6 text-lg leading-loose text-soft-ivory">
            ที่อื่นเชี่ยวชาญเฉพาะทาง — ARCHRON บูรณาการ ที่อื่นปกป้องธรรมเนียม — ARCHRON เปรียบเทียบ
            ที่อื่นรับมรดกความรู้ — ARCHRON จัดระเบียบความรู้นั้นขึ้นใหม่
          </p>
        </section>

        {/* วิธีวิทยา */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๔">วิธีวิทยาของ ARCHRON</SectionTitle>
          <ol className="space-y-3">
            {METHOD.map((m, i) => (
              <li key={m} className="flex items-baseline gap-4 text-lg text-soft-ivory">
                <span className="font-serif text-sm text-burnished-gold/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {m}
              </li>
            ))}
          </ol>
        </section>

        {/* คุณค่าแกน */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๕">คุณค่าแกน</SectionTitle>
          <div className="flex flex-wrap gap-2.5">
            {VALUES.map((v) => (
              <span
                key={v}
                className="rounded-full border border-ink/12 px-4 py-1.5 text-sm text-on-surface-variant/85"
              >
                {v}
              </span>
            ))}
          </div>
        </section>

        {/* ภาษาของสำนัก */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๖">ภาษาของสำนัก</SectionTitle>
          <h3 className="mb-3 text-xs font-semibold tracking-[0.05em] text-burnished-gold/70">
            มโนทัศน์แกน
          </h3>
          <p className="mb-8 font-serif text-lg leading-relaxed text-on-surface">
            {LEXICON.join(" · ")}
          </p>
          <h3 className="mb-3 text-xs font-semibold tracking-[0.05em] text-on-surface-variant/50">
            คำที่เลี่ยงไม่ให้เป็นแกนของแบรนด์
          </h3>
          <p className="text-sm leading-relaxed text-on-surface-variant/55">
            {AVOID.join(" · ")}
          </p>
        </section>

        {/* คำขวัญ */}
        <section className="scroll-reveal text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-burnished-gold/30" />
          <p className="mx-auto max-w-xl font-serif text-2xl leading-relaxed text-on-surface md:text-[28px]">
            “ARCHRON ไม่ได้ถามว่าควรคิดอะไร แต่ถามว่ามนุษย์เรียนรู้ที่จะคิดมาอย่างไร”
          </p>
          <p className="mt-6 text-sm tracking-[0.05em] text-burnished-gold/70">
            เข้าใจมนุษย์ ข้ามผ่านห้วงเวลา
          </p>
          <div className="mx-auto mt-8 h-px w-16 bg-burnished-gold/30" />
        </section>

        {/* สัญลักษณ์ */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๗">สัญลักษณ์</SectionTitle>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <figure className="flex flex-col items-center gap-4 text-center">
              <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
                <circle
                  cx="32"
                  cy="32"
                  r="22"
                  fill="none"
                  stroke="#B08D57"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="118 21"
                  transform="rotate(-58 32 32)"
                />
              </svg>
              <figcaption className="text-sm leading-relaxed text-on-surface-variant/75">
                <span className="block font-serif text-on-surface">วงกลมเปิด</span>
                ความรู้ไม่มีวันสมบูรณ์ การสืบค้นไม่สิ้นสุด ทุกข้อสรุปเปิดให้ทบทวนเสมอ
              </figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-4 text-center">
              <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
                <circle cx="32" cy="32" r="22" fill="none" stroke="#1F2A44" strokeWidth="2" />
                <circle cx="32" cy="32" r="3.5" fill="#B08D57" />
              </svg>
              <figcaption className="text-sm leading-relaxed text-on-surface-variant/75">
                <span className="block font-serif text-on-surface">จุดศูนย์กลาง ⊙</span>
                ศูนย์กลางคือมนุษย์ วงคืออารยธรรม การเดินทางคือจากความหลากหลายสู่ความเข้าใจที่ลึกขึ้น
              </figcaption>
            </figure>
            <figure className="flex flex-col items-center gap-4 text-center">
              <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
                <circle cx="25" cy="32" r="18" fill="none" stroke="#4F7C82" strokeWidth="2" />
                <circle cx="39" cy="32" r="18" fill="none" stroke="#B08D57" strokeWidth="2" />
              </svg>
              <figcaption className="text-sm leading-relaxed text-on-surface-variant/75">
                <span className="block font-serif text-on-surface">จุดตัด</span>
                ความรู้เกิดขึ้นที่รอยต่อของศาสตร์ — จิตวิทยา×ปรัชญา วิทยาศาสตร์×ตำนาน ภาษา×วัฒนธรรม
              </figcaption>
            </figure>
          </div>
        </section>

        {/* สูตรแบรนด์ */}
        <section className="scroll-reveal">
          <SectionTitle no="๐๘">เส้นทางของความเข้าใจ</SectionTitle>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3 font-serif text-lg text-on-surface">
            {FORMULA.map((f, i) => (
              <span key={f} className="flex items-center gap-3">
                {f}
                {i < FORMULA.length - 1 ? (
                  <span className="text-burnished-gold/60">→</span>
                ) : null}
              </span>
            ))}
          </div>
          <p className="mt-6 text-base leading-relaxed text-on-surface-variant/70">
            ทุกบทความ กรอบความคิด และโครงการของ ARCHRON ควรสืบย้อนกลับมายังโครงสร้างนี้ได้
          </p>
        </section>

        {/* หลักการก่อตั้ง */}
        <section className="scroll-reveal space-y-6 border-t border-ink/12 pt-12 text-lg leading-loose text-soft-ivory">
          <p>ARCHRON ไม่ใช่จุดหมายปลายทาง แต่เป็นบทสนทนาที่วิวัฒน์ไปข้ามอารยธรรม</p>
          <p className="font-serif text-on-surface">
            ทุกชั่วรุ่นได้รับมรดกเป็นคำถามของมนุษยชาติ และทุกชั่วรุ่นต้องถามคำถามเหล่านั้นใหม่อีกครั้ง
          </p>
        </section>
      </div>

      <PageNav current="/manifesto" />
    </main>
  );
}
