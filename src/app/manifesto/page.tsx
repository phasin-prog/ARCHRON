import type { Metadata } from "next";
import { PageNav } from "@/components/page-nav";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  PreambleIcon,
  WhyExistIcon,
  WhatStudyIcon,
  WhatBelieveIcon,
  OurMethodIcon,
  WhatRejectIcon,
  WhatOfferIcon,
  OurResponsibilityIcon,
  OurLegacyIcon,
  ClosingDeclIcon,
} from "@/components/icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ปฏิญญาก่อตั้ง ARCHRON — The Founding Manifesto | ARCHRON",
  description:
    "ปฏิญญาก่อตั้งของ ARCHRON สำนักศึกษามนุษย์ — เจตนารมณ์ว่าด้วยการเชื่อมศาสตร์ที่ถูกแยกขาด การปกป้องความซื่อสัตย์ทางปัญญา และการแสวงหาความเข้าใจที่ไม่สิ้นสุด",
};

const icons = {
  preamble: <PreambleIcon className="h-6 w-6" />,
  why: <WhyExistIcon className="h-6 w-6" />,
  study: <WhatStudyIcon className="h-6 w-6" />,
  believe: <WhatBelieveIcon className="h-6 w-6" />,
  method: <OurMethodIcon className="h-6 w-6" />,
  reject: <WhatRejectIcon className="h-6 w-6" />,
  offer: <WhatOfferIcon className="h-6 w-6" />,
  responsibility: <OurResponsibilityIcon className="h-6 w-6" />,
  legacy: <OurLegacyIcon className="h-6 w-6" />,
  closing: <ClosingDeclIcon className="h-6 w-6" />,
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
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-accent/25 bg-accent/[0.06] text-accent">
          {icon}
        </span>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent/70">
            {kicker}
          </span>
          <h2 className="font-heading text-2xl font-semibold leading-snug text-text-heading md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <div className="space-y-5 text-base leading-relaxed text-text-body">{children}</div>
    </section>
  );
}

export default async function ManifestoPage() {
  const dbManifesto = await getPublicEntryBySlug("manifesto");

  if (dbManifesto && dbManifesto.bodyMarkdown) {
    return (
      <main className="min-h-screen py-24">
        <div className="mx-auto max-w-prose px-6">
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              ARCHRON · เจตนารมณ์
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-text-heading md:text-5xl">
              {dbManifesto.title}
            </h1>
          </div>
          <div className="text-base leading-relaxed text-text-body">
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
    <main className="min-h-screen py-24">
      <div className="mx-auto max-w-prose px-6">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            ARCHRON · เจตนารมณ์
          </p>
          <h1 className="mt-5 font-heading text-4xl font-bold leading-tight text-text-heading md:text-5xl">
            ปฏิญญาก่อตั้ง ARCHRON
          </h1>
          <p className="mt-4 font-heading text-base italic tracking-[0.05em] text-accent/70">
            สำนักศึกษามนุษย์ · The School of Human Inquiry
          </p>
        </div>

        <div className="space-y-20">
          <Movement kicker="Preamble" title="อารัมภบท" icon={icons.preamble}>
            <p className="font-heading text-xl leading-relaxed text-text-heading md:text-2xl">
              มนุษย์ได้สร้างอารยธรรมขึ้นจากคำถาม
            </p>
            <div className="border-l-2 border-accent/30 pl-6 font-heading text-lg leading-relaxed text-text-heading">
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

          <Movement kicker="Why We Exist" title="เหตุที่เราดำรงอยู่" icon={icons.why}>
            <p>เราไม่ได้ก่อตั้ง ARCHRON เพราะโลกขาดข้อมูล โลกมีข้อมูลมากกว่าที่มนุษย์จะอ่านได้หมด</p>
            <p>สิ่งที่โลกขาด คือ ความสามารถในการเชื่อมโยง การเปรียบเทียบ การตีความ และการสร้างความหมายจากองค์ความรู้ที่กระจัดกระจาย</p>
            <p>
              ARCHRON จึงไม่ได้เกิดขึ้นเพื่อเพิ่มข้อมูลอีกหนึ่งกอง
              แต่เพื่อสร้างภาษาที่ทำให้ความรู้ต่างแขนงสามารถสนทนากันได้อีกครั้ง
            </p>
          </Movement>

          <Movement kicker="What We Study" title="เราศึกษาอะไร" icon={icons.study}>
            <p className="text-text-secondary">
              ARCHRON ไม่ได้ศึกษาจิตวิทยาเพียงอย่างเดียว ไม่ได้ศึกษาปรัชญาเพียงอย่างเดียว
              ไม่ได้ศึกษาศาสนา ประวัติศาสตร์ ภาษาศาสตร์ หรือมานุษยวิทยาเพียงอย่างเดียว
            </p>
            <p className="font-heading text-3xl font-semibold leading-snug text-text-heading md:text-4xl">
              เราศึกษา <span className="text-accent">มนุษย์</span>
            </p>
            <p>และทุกศาสตร์ที่เกิดจากความพยายามของมนุษย์ในการเข้าใจตนเอง</p>
          </Movement>

          <Movement kicker="What We Believe" title="สิ่งที่เราเชื่อ" icon={icons.believe}>
            <p>เราไม่เชื่อในผู้เผยความจริงเพียงหนึ่งเดียว เราไม่เชื่อในตำราที่สมบูรณ์ที่สุด และเราไม่เชื่อว่ามีทฤษฎีใดอธิบายมนุษย์ได้ทั้งหมด</p>
            <p>
              เรามองทุกระบบความคิด ทุกศาสนา ทุกอารยธรรม ทุกภาษา ทุกตำนาน ทุกทฤษฎี
              ในฐานะความพยายามของมนุษย์ที่จะเข้าใจความเป็นมนุษย์
            </p>
            <blockquote className="border-l-2 border-accent/40 bg-bg-card py-5 pl-6 pr-5 font-heading text-xl leading-relaxed text-text-heading">
              ไม่มีระบบใดสมบูรณ์ แต่ไม่มีระบบใดไร้คุณค่า
            </blockquote>
          </Movement>

          <Movement kicker="Our Method" title="วิธีของเรา" icon={icons.method}>
            <p>เราเริ่มต้นจากต้นฉบับ เราเคารพบริบท เราเปรียบเทียบอย่างซื่อสัตย์</p>
            <p>เราแยกข้อเท็จจริงออกจากการตีความ และเปิดเผยข้อจำกัดของทุกแนวคิด รวมถึงของเราเอง</p>
            <p>เราเชื่อมโยงศาสตร์ เราสังเคราะห์กรอบใหม่เมื่อหลักฐานรองรับ</p>
            <p>และเราพร้อมแก้ไขสิ่งที่เราเคยเชื่อ หากเหตุผลและหลักฐานชี้ไปในทิศทางที่ดีกว่า</p>
          </Movement>

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
                  <span className="select-none text-accent">—</span>
                  <span>เราปฏิเสธ{x}</span>
                </li>
              ))}
            </ul>
          </Movement>

          <Movement kicker="What We Offer" title="สิ่งที่เรามอบ" icon={icons.offer}>
            <p>ARCHRON ไม่ได้มอบคำตอบสุดท้าย เรามอบเครื่องมือในการตั้งคำถามที่ดีขึ้น</p>
            <p>เรามอบ แผนที่ · ภาษา · แนวคิด · โครงสร้าง · และบทสนทนา</p>
            <p>เพื่อให้แต่ละคนสร้างความเข้าใจของตนเองอย่างมีเหตุผลและมีความรับผิดชอบ</p>
          </Movement>

          <Movement kicker="Our Responsibility" title="ความรับผิดชอบของเรา" icon={icons.responsibility}>
            <p>เราไม่ใช่เจ้าของความจริง เราเป็นเพียงผู้ดูแลบทสนทนาของมนุษยชาติ</p>
            <p>หน้าที่ของเราไม่ใช่การปกป้องทฤษฎี แต่คือการปกป้องความซื่อสัตย์ทางปัญญา</p>
            <p>
              เพราะความรู้ที่ไม่ยอมรับการตรวจสอบ ย่อมกลายเป็นความเชื่อ
              และความเชื่อที่ไม่ยอมรับการวิพากษ์ ย่อมกลายเป็นลัทธิ
            </p>
            <blockquote className="border-l-2 border-accent/40 bg-bg-card py-5 pl-6 pr-5 font-heading text-xl leading-relaxed text-text-heading">
              ARCHRON จะไม่กลายเป็นลัทธิ แม้แต่ลัทธิของตัวเอง
            </blockquote>
          </Movement>

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

          <section className="scroll-reveal text-center">
            <span className="mx-auto mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.06] text-accent">
              {icons.closing}
            </span>
            <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.18em] text-accent/70">
              Closing Declaration
            </span>
            <div className="space-y-2 font-heading text-2xl font-medium leading-relaxed text-text-heading md:text-3xl">
              <p>ARCHRON is not a destination.</p>
              <p>It is an invitation.</p>
              <p className="text-text-secondary">Not to believe. But to inquire.</p>
              <p className="text-text-secondary">
                Not to inherit certainty. But to cultivate understanding.
              </p>
            </div>
            <p className="mt-10 font-heading text-lg italic tracking-[0.04em] text-accent">
              The inquiry continues.
            </p>
            <div className="mx-auto mt-10 h-px w-16 bg-accent/30" />
          </section>
        </div>
      </div>

      <PageNav current="/manifesto" />
    </main>
  );
}
