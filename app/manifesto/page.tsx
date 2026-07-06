import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { getPublicEntryBySlug } from "@/lib/content/public-source";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ปฏิญญาก่อตั้ง ARCHRON — The Founding Manifesto | ARCHRON",
  description:
    "ปฏิญญาก่อตั้งของ ARCHRON สำนักศึกษามนุษย์ — เจตนารมณ์ว่าด้วยการเชื่อมศาสตร์ที่ถูกแยกขาด การปกป้องความซื่อสัตย์ทางปัญญา และการแสวงหาความเข้าใจที่ไม่สิ้นสุด",
};

/* ─────────────────────────────────────────────────────────────
   Movement icons — line-art (stroke = currentColor, inherits
   burnished-gold from the badge). โทน "นักคิด / นักเขียน" +
   คลังความรู้ (ไม่ใช่สายมู). ทุกไอคอนใช้ token สีผ่าน currentColor.
   ───────────────────────────────────────────────────────────── */
const svgProps = {
  className: "h-6 w-6",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons = {
  preamble: (
    <svg {...svgProps}>
      <path d="M12 6c-1.6-1.2-3.8-1.6-6-1.4v12c2.2-.2 4.4.2 6 1.4 1.6-1.2 3.8-1.6 6-1.4v-12c-2.2-.2-4.4.2-6 1.4Z" />
      <path d="M12 6v12" />
    </svg>
  ),
  why: (
    <svg {...svgProps}>
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="18" cy="8" r="2.2" />
      <circle cx="9" cy="18" r="2.2" />
      <path d="M7.9 7.3 16.1 6.8M7.4 8 8.6 15.9M10.9 16.7 16.2 9.8" />
    </svg>
  ),
  study: (
    <svg {...svgProps}>
      <path d="M15.5 20v-2.2a5.5 5.5 0 1 0-7 0V20" />
      <path d="M12 12.2c1.1 0 1.8-.9 1.8-2 0-1-.7-1.9-1.8-1.9s-1.8.9-1.8 1.9c0 1.1.7 2 1.8 2Z" />
    </svg>
  ),
  believe: (
    <svg {...svgProps}>
      <path d="M12 4v3M4.5 8h15M6.8 8l-2.3 5.2M17.2 8l2.3 5.2" />
      <path d="M2.6 13.2a3.4 2 0 0 0 3.8 0M17.6 13.2a3.4 2 0 0 0 3.8 0" />
      <path d="M9 19h6M12 7v12" />
    </svg>
  ),
  method: (
    <svg {...svgProps}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l4.5 4.5" />
      <path d="M10.5 7.5v6M7.5 10.5h6" />
    </svg>
  ),
  reject: (
    <svg {...svgProps}>
      <path d="M12 3.5 5 6.2v5c0 4.3 3 7 7 9.3 4-2.3 7-5 7-9.3v-5L12 3.5Z" />
      <path d="M9.3 9.3l5.4 5.4M14.7 9.3l-5.4 5.4" />
    </svg>
  ),
  offer: (
    <svg {...svgProps}>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  ),
  responsibility: (
    <svg {...svgProps}>
      <path d="M12 21c-4-2.2-7-5-7-9.3v-5L12 3.9l7 2.8v5C19 16 16 18.8 12 21Z" />
      <path d="M9 11.6l2.1 2.1L15 9.9" />
    </svg>
  ),
  legacy: (
    <svg {...svgProps}>
      <path d="M12 20v-8" />
      <path d="M12 12c0-2.8-2.2-5-5-5 0 2.8 2.2 5 5 5Z" />
      <path d="M12 12c0-3.3 2.7-6 6-6 0 3.3-2.7 6-6 6Z" />
      <path d="M8.5 20h7" />
    </svg>
  ),
  closing: (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.2 8.8 10.8 10.8 8.8 15.2 13.2 13.2 Z" />
      <circle cx="12" cy="12" r="1" />
    </svg>
  ),
};

function Movement({
  kicker,
  title,
  icon,
  children,
}: {
  kicker: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-reveal">
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-burnished-gold/25 bg-burnished-gold/[0.06] text-burnished-gold">
          {icon}
        </span>
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-burnished-gold/70">
            {kicker}
          </span>
          <h2 className="font-serif text-[26px] font-semibold leading-snug text-on-surface md:text-[30px]">
            {title}
          </h2>
        </div>
      </div>
      <div className="space-y-5 text-lg leading-[1.9] text-soft-ivory">{children}</div>
    </section>
  );
}

export default async function ManifestoPage() {
  const dbManifesto = await getPublicEntryBySlug("manifesto");

  if (dbManifesto && dbManifesto.bodyMarkdown) {
    return (
      <main className="atmo-observatory pb-24">
        <PageHeader
          kicker="ARCHRON · เจตนารมณ์"
          title={dbManifesto.title}
        />
        <div className="mx-auto max-w-2xl px-6 mt-10">
          <div className="markdown-body prose prose-invert text-soft-ivory/90 leading-loose text-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {dbManifesto.bodyMarkdown}
            </ReactMarkdown>
          </div>
        </div>
        <PageNav current="/manifesto" />
      </main>
    );
  }

  return (
    <main className="atmo-observatory pb-24">
      <PageHeader
        kicker="ARCHRON · เจตนารมณ์"
        title="ปฏิญญาก่อตั้ง ARCHRON"
      />

      <div className="mx-auto max-w-2xl px-6">
        <p className="mb-16 text-center font-serif text-base italic tracking-[0.05em] text-burnished-gold/80">
          สำนักศึกษามนุษย์ · The School of Human Inquiry
        </p>

        <div className="space-y-20">
          {/* Preamble */}
          <Movement kicker="Preamble" title="อารัมภบท" icon={icons.preamble}>
            <p className="font-serif text-[22px] leading-relaxed text-on-surface md:text-[24px]">
              มนุษย์ได้สร้างอารยธรรมขึ้นจากคำถาม
            </p>
            <div className="border-l-2 border-antique-gold/30 pl-[26px] font-serif text-[1.2rem] leading-[1.85] text-on-surface md:text-[1.35rem]">
              <p>ก่อนที่เราจะมีวิทยาศาสตร์ เรามีตำนาน</p>
              <p>ก่อนที่เราจะมีปรัชญา เรามีสัญลักษณ์</p>
              <p>ก่อนที่เราจะมีจิตวิทยา เรามีความฝัน</p>
              <p>ก่อนที่เราจะมีภาษา เรามีความหมายที่พยายามจะถูกเอ่ยออกมา</p>
            </div>
            <p>
              ประวัติศาสตร์ของมนุษย์ จึงไม่ใช่เพียงประวัติศาสตร์ของเหตุการณ์
              แต่คือประวัติศาสตร์ของการแสวงหาความเข้าใจ
            </p>
            <p>
              ARCHRON ถือกำเนิดขึ้นจากความเชื่อว่า ศาสตร์ทั้งหลายไม่เคยเป็นศัตรูกัน
              มนุษย์ต่างหากที่แบ่งแยกมันออกจากกัน
            </p>
          </Movement>

          {/* Why We Exist */}
          <Movement kicker="Why We Exist" title="เหตุที่เราดำรงอยู่" icon={icons.why}>
            <p>เราไม่ได้ก่อตั้ง ARCHRON เพราะโลกขาดข้อมูล โลกมีข้อมูลมากกว่าที่มนุษย์จะอ่านได้หมด</p>
            <p>สิ่งที่โลกขาด คือ ความสามารถในการเชื่อมโยง การเปรียบเทียบ การตีความ และการสร้างความหมายจากองค์ความรู้ที่กระจัดกระจาย</p>
            <p>
              ARCHRON จึงไม่ได้เกิดขึ้นเพื่อเพิ่มข้อมูลอีกหนึ่งกอง
              แต่เพื่อสร้างภาษาที่ทำให้ความรู้ต่างแขนงสามารถสนทนากันได้อีกครั้ง
            </p>
          </Movement>

          {/* What We Study */}
          <Movement kicker="What We Study" title="เราศึกษาอะไร" icon={icons.study}>
            <p className="text-on-surface-variant/80">
              ARCHRON ไม่ได้ศึกษาจิตวิทยาเพียงอย่างเดียว ไม่ได้ศึกษาปรัชญาเพียงอย่างเดียว
              ไม่ได้ศึกษาศาสนา ประวัติศาสตร์ ภาษาศาสตร์ หรือมานุษยวิทยาเพียงอย่างเดียว
            </p>
            <p className="font-serif text-[28px] font-semibold leading-snug text-on-surface md:text-[38px]">
              เราศึกษา <span className="text-burnished-gold">มนุษย์</span>
            </p>
            <p>และทุกศาสตร์ที่เกิดจากความพยายามของมนุษย์ในการเข้าใจตนเอง</p>
          </Movement>

          {/* What We Believe */}
          <Movement kicker="What We Believe" title="สิ่งที่เราเชื่อ" icon={icons.believe}>
            <p>เราไม่เชื่อในผู้เผยความจริงเพียงหนึ่งเดียว เราไม่เชื่อในตำราที่สมบูรณ์ที่สุด และเราไม่เชื่อว่ามีทฤษฎีใดอธิบายมนุษย์ได้ทั้งหมด</p>
            <p>
              เรามองทุกระบบความคิด ทุกศาสนา ทุกอารยธรรม ทุกภาษา ทุกตำนาน ทุกทฤษฎี
              ในฐานะความพยายามของมนุษย์ที่จะเข้าใจความเป็นมนุษย์
            </p>
            <blockquote className="border-l-2 border-antique-gold/40 bg-surface-container py-5 pl-6 pr-5 font-serif text-[1.35rem] leading-relaxed text-on-surface md:text-[1.55rem]">
              ไม่มีระบบใดสมบูรณ์ แต่ไม่มีระบบใดไร้คุณค่า
            </blockquote>
          </Movement>

          {/* Our Method */}
          <Movement kicker="Our Method" title="วิธีของเรา" icon={icons.method}>
            <p>เราเริ่มต้นจากต้นฉบับ เราเคารพบริบท เราเปรียบเทียบอย่างซื่อสัตย์</p>
            <p>เราแยกข้อเท็จจริงออกจากการตีความ และเปิดเผยข้อจำกัดของทุกแนวคิด รวมถึงของเราเอง</p>
            <p>เราเชื่อมโยงศาสตร์ เราสังเคราะห์กรอบใหม่เมื่อหลักฐานรองรับ</p>
            <p>และเราพร้อมแก้ไขสิ่งที่เราเคยเชื่อ หากเหตุผลและหลักฐานชี้ไปในทิศทางที่ดีกว่า</p>
          </Movement>

          {/* What We Reject */}
          <Movement kicker="What We Reject" title="สิ่งที่เราปฏิเสธ" icon={icons.reject}>
            <ul className="space-y-3">
              {[
                "ลัทธิบูชาบุคคล",
                "การเลือกอุดมการณ์มาก่อนข้อเท็จจริง",
                "การตัดข้อความออกจากบริบทเพื่อสนับสนุนข้อสรุปที่เตรียมไว้แล้ว",
                "การแบ่งโลกออกเป็นคู่ตรงข้ามอย่างง่ายดาย",
                "การลดทอนมนุษย์ให้เหลือเพียงสูตรเดียว",
              ].map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="select-none text-burnished-gold">—</span>
                  <span>เราปฏิเสธ{x}</span>
                </li>
              ))}
            </ul>
          </Movement>

          {/* What We Offer */}
          <Movement kicker="What We Offer" title="สิ่งที่เรามอบ" icon={icons.offer}>
            <p>ARCHRON ไม่ได้มอบคำตอบสุดท้าย เรามอบเครื่องมือในการตั้งคำถามที่ดีขึ้น</p>
            <p>เรามอบ แผนที่ · ภาษา · แนวคิด · โครงสร้าง · และบทสนทนา</p>
            <p>เพื่อให้แต่ละคนสร้างความเข้าใจของตนเองอย่างมีเหตุผลและมีความรับผิดชอบ</p>
          </Movement>

          {/* Our Responsibility */}
          <Movement kicker="Our Responsibility" title="ความรับผิดชอบของเรา" icon={icons.responsibility}>
            <p>เราไม่ใช่เจ้าของความจริง เราเป็นเพียงผู้ดูแลบทสนทนาของมนุษยชาติ</p>
            <p>หน้าที่ของเราไม่ใช่การปกป้องทฤษฎี แต่คือการปกป้องความซื่อสัตย์ทางปัญญา</p>
            <p>
              เพราะความรู้ที่ไม่ยอมรับการตรวจสอบ ย่อมกลายเป็นความเชื่อ
              และความเชื่อที่ไม่ยอมรับการวิพากษ์ ย่อมกลายเป็นลัทธิ
            </p>
            <blockquote className="border-l-2 border-antique-gold/40 bg-surface-container py-5 pl-6 pr-5 font-serif text-[1.35rem] leading-relaxed text-on-surface md:text-[1.55rem]">
              ARCHRON จะไม่กลายเป็นลัทธิ แม้แต่ลัทธิของตัวเอง
            </blockquote>
          </Movement>

          {/* Our Legacy */}
          <Movement kicker="Our Legacy" title="มรดกของเรา" icon={icons.legacy}>
            <p>เราไม่ได้หวังให้ทุกคนเห็นด้วยกับเรา เราไม่ได้หวังให้ ARCHRON เป็นคำตอบสุดท้าย</p>
            <p>
              สิ่งที่เราปรารถนา คือการทำให้มนุษย์รุ่นต่อไปมีภาษาที่ดีกว่าเดิม
              ในการเข้าใจตนเอง เข้าใจผู้อื่น และเข้าใจโลก
            </p>
            <p>
              หากวันหนึ่ง มีผู้สร้างกรอบความคิดที่ดีกว่า ARCHRON และสามารถอธิบายมนุษย์ได้อย่างซื่อสัตย์
              รอบด้าน และลึกซึ้งกว่า เราหวังว่าเขาจะทำได้
            </p>
            <p>
              เพราะเป้าหมายของ ARCHRON ไม่ใช่การคงอยู่ของชื่อ
              แต่คือความก้าวหน้าของความเข้าใจเกี่ยวกับมนุษย์
            </p>
          </Movement>

          {/* Closing Declaration */}
          <section className="scroll-reveal text-center">
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-burnished-gold/25 bg-burnished-gold/[0.06] text-burnished-gold">
              {icons.closing}
            </span>
            <span className="mb-6 block text-[11px] font-semibold uppercase tracking-[0.28em] text-burnished-gold/70">
              Closing Declaration
            </span>
            <div className="space-y-2 font-serif text-2xl font-medium leading-relaxed text-on-surface md:text-[29px]">
              <p>ARCHRON is not a destination.</p>
              <p>It is an invitation.</p>
              <p className="text-on-surface-variant/80">Not to believe. But to inquire.</p>
              <p className="text-on-surface-variant/80">
                Not to inherit certainty. But to cultivate understanding.
              </p>
            </div>
            <p className="mt-10 font-serif text-lg italic tracking-[0.04em] text-burnished-gold">
              The inquiry continues.
            </p>
            <div className="mx-auto mt-10 h-px w-16 bg-burnished-gold/30" />
          </section>
        </div>
      </div>

      <PageNav current="/manifesto" />
    </main>
  );
}
