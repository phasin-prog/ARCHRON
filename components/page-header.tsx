import type { ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "@/components/breadcrumb";

type PageHeaderProps = {
  /** ป้ายนำสายตาภาษาไทย — เรนเดอร์ด้วย .kicker (น้ำหนัก+สีทอง ไม่ letterspace ตามหลักอักษรไทย) */
  kicker?: string;
  /** ป้ายละตินกำกับ (ถ้ามี) — เรนเดอร์ด้วย .kicker-en (uppercase + tracking ใช้กับละตินเท่านั้น) */
  kickerEn?: string;
  title: string;
  lead?: string;
  breadcrumb?: BreadcrumbItem[];
  /** ตราสลักประจำหน้า (เช่น <PlateEmblem>) — แสดงมุมขวาบนจอ md+ */
  emblem?: ReactNode;
};

// PageHeader — เทมเพลตหัวหน้าเนื้อหา ธีม "แผ่นจารดาราศาสตร์"
// จุดแก้ศูนย์กลางของระบบ kicker: เดิม tracking+uppercase ถูกใส่ตายตัวกับข้อความไทยทุกหน้า
// ตอนนี้แยกไทย (.kicker) / ละติน (.kicker-en) และเพิ่มเส้นฐานทอง + ขีดพิกัดแบบเพลท
export function PageHeader({ kicker, kickerEn, title, lead, breadcrumb, emblem }: PageHeaderProps) {
  return (
    <header className="scroll-reveal mx-auto max-w-6xl px-6 pb-10 pt-20">
      {breadcrumb && breadcrumb.length > 0 ? <Breadcrumb items={breadcrumb} className="mb-6" /> : null}
      <div className="flex items-start justify-between gap-8">
        <div className="min-w-0">
          {kickerEn ? <p className="kicker-en mb-1">{kickerEn}</p> : null}
          {kicker ? <p className="kicker">{kicker}</p> : null}
          <h1 className="mt-3 font-serif text-fluid-h1 font-semibold leading-[1.25] text-ivory">{title}</h1>
          {lead ? (
            <p className="mt-5 max-w-[62ch] text-base leading-[1.85] text-soft-ivory">{lead}</p>
          ) : null}
        </div>
        {emblem ? <div className="hidden shrink-0 md:block">{emblem}</div> : null}
      </div>
      {/* เส้นฐานเพลท: hairline + ขีดพิกัดสั้นสามจุด */}
      <div className="relative mt-8 h-px bg-slate-boundary/40" aria-hidden="true">
        <span className="absolute left-0 top-0 h-[5px] w-px -translate-y-[2px] bg-burnished-gold/60" />
        <span className="absolute left-16 top-0 h-[5px] w-px -translate-y-[2px] bg-burnished-gold/35" />
        <span className="absolute left-32 top-0 h-[5px] w-px -translate-y-[2px] bg-burnished-gold/20" />
      </div>
    </header>
  );
}
