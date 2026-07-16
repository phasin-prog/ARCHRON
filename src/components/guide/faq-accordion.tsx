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
    <section className="border-b border-border/30 bg-bg px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            คำถามที่พบบ่อย (FAQ)
          </h2>
          <p className="mt-3 text-sm text-text-secondary/85 md:text-base">
            ข้อสงสัยเกี่ยวกับบริการ กรอบวิชาการ และขั้นตอนการทำงานของทีมวิเคราะห์
          </p>
        </div>

        <div className="mt-12">
          <Accordion items={accordionItems} single={true} />
        </div>

        <div className="mt-10 rounded-lg border border-border/40 bg-bg-card/60 p-6 text-center">
          <p className="text-xs text-text-secondary/85">
            มีคำถามอื่นๆ ที่ไม่ได้ระบุไว้ในรายการนี้? คุณสามารถพูดคุยสอบถามกับเราได้โดยตรงทาง LINE Official ก่อนการจองโดยไม่มีเงื่อนไขผูกมัดใดๆ
          </p>
        </div>
      </div>
    </section>
  );
}
