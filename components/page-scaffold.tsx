// ARCHRON — Page Scaffold (โครงหน้า static มาตรฐาน · เส้นทางเดียวกับ AGENT-HANDOFF §2)
// ประกอบ: Ambient Observatory (opt-in · CSS + ไฟล์ SVG ใน public/backgrounds) → PageHeader → เนื้อหา (children) → PageNav (opt-in)
// เป้าหมาย: หน้าใหม่/หน้า refactor ใช้โครงเดียวกัน → กลิ่นอาย "หอดูดาว/ห้องสมุดยามค่ำ" สม่ำเสมอ
// กติกา: ใช้ design tokens ผ่าน utility เดิมเท่านั้น · Thai-first · ห้ามแตะ global chrome

import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { SectionHeading } from "@/components/section-heading";
import type { BreadcrumbItem } from "@/components/breadcrumb";

type PageScaffoldProps = {
  /** ชื่อหน้า (h1) */
  title: string;
  /** ป้ายเล็กเหนือชื่อ (uppercase tracking กว้าง สี accent) */
  kicker?: string;
  /** คำโปรยใต้ชื่อ */
  lead?: string;
  /** เส้นทาง breadcrumb (ส่งต่อให้ PageHeader) */
  breadcrumb?: BreadcrumbItem[];
  /** เปิดชั้นดาว Ambient Observatory ใต้เนื้อหา */
  ambient?: boolean;
  /** href ปัจจุบันตาม PAGE_ORDER — ระบุแล้วจะแสดง PageNav ท้ายหน้า */
  navCurrent?: string;
  className?: string;
  children: ReactNode;
};

export function PageScaffold({
  title,
  kicker,
  lead,
  breadcrumb,
  ambient = false,
  navCurrent,
  className = "",
  children,
}: PageScaffoldProps) {
  return (
    <main className={`relative pb-24 ${className}`}>
      {ambient ? <div className="ambient-observatory" aria-hidden="true" /> : null}
      <div className="relative z-10">
        <PageHeader kicker={kicker} title={title} lead={lead} breadcrumb={breadcrumb} />
        {children}
        {navCurrent ? <PageNav current={navCurrent} /> : null}
      </div>
    </main>
  );
}

// PageSection — บล็อกเนื้อหามาตรฐานภายใน PageScaffold
// ความกว้าง/ระยะเดียวกับ PageHeader (max-w-6xl px-6) + scroll-reveal ตาม template กลาง
export function PageSection({
  title,
  kicker,
  action,
  className = "",
  children,
}: {
  title?: string;
  kicker?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`scroll-reveal mx-auto max-w-6xl px-6 pb-14 ${className}`}>
      {title ? <SectionHeading kicker={kicker} title={title} action={action} className="mb-8" /> : null}
      {children}
    </section>
  );
}
