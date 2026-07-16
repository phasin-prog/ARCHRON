"use client";

import { FAQ_ITEMS } from "@/components/guide/types";
import { Accordion } from "@/components/accordion";

export function FAQSection() {
  const accordionItems = FAQ_ITEMS.map((item) => ({
    id: item.id,
    title: item.question,
    content: <p className="leading-relaxed text-text-secondary/90">{item.answer}</p>,
  }));

  return (
    <section className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            คำถามเกี่ยวกับบริการ
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            คำถามที่พบบ่อย
          </h2>
          <p className="mt-3 text-sm text-text-secondary/85 md:text-base">
            คำตอบเกี่ยวกับบริการ กรอบวิชาการ และขั้นตอนการทำงาน
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={accordionItems} single={true} />
        </div>

        <div className="mt-10 rounded-lg border border-border/40 bg-bg-card/60 p-6 text-center">
          <p className="text-xs text-text-secondary/85">
            หากมีคำถามเพิ่มเติม ติดต่อสอบถามผ่าน LINE Official ได้ก่อนจอง โดยไม่มีข้อผูกมัด
          </p>
        </div>
      </div>
    </section>
  );
}
