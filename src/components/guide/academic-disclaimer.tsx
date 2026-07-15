"use client";

import { BOUNDARIES_ITEMS } from "@/components/guide/types";

export function AcademicDisclaimer() {
  return (
    <section className="border-b border-border/30 bg-bg px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-xl border border-accent/25 bg-bg-card/70 p-8 shadow-sm md:p-10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
              !
            </span>
            <h3 className="font-serif text-xl font-bold text-text-heading">
              กรอบขอบเขตทางวิชาการและข้อตกลงในการรับบริการ
            </h3>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-text-secondary/85">
            เพื่อความเข้าใจที่ตรงกันและประโยชน์สูงสุดของผู้รับบริการ โปรดอ่านและรับทราบขอบเขตทางวิชาการของเราก่อนเริ่มต้นกระบวนการสัมภาษณ์:
          </p>

          <ul className="mt-6 space-y-3.5 border-t border-border/40 pt-6">
            {BOUNDARIES_ITEMS.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-text-body">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/10 font-bold text-accent">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
