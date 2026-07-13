import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { DisciplineCard } from "@/components/discipline-card";
import { DISCIPLINES } from "@/lib/content/core/seeds/disciplines";

export const metadata: Metadata = {
  title: "ศาสตร์ที่เราศึกษา — ARCHRON",
  description:
    "สิบสองแขนงของการเข้าใจมนุษย์ — จิตวิทยา ปรัชญา มานุษยวิทยา ประวัติศาสตร์ ภาษา ตำนาน ศาสนา วิทยาศาสตร์ สัญลักษณ์ ศิลปะ ปัญญาประดิษฐ์ และอารยธรรม",
};

export default function DisciplinesPage() {
  return (
    <main className="pb-24">
      <PageHeader
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          { label: "คลังความรู้", href: "/knowledge" },
          { label: "ศาสตร์ที่เราศึกษา" },
        ]}
        kicker="แผนที่ความรู้"
        title="สิบสองแขนงของการเข้าใจมนุษย์"
        lead="การเข้าใจมนุษย์ไม่อาจอาศัยศาสตร์เดียว — ARCHRON เดินข้ามพรมแดนวิชา แล้ววางแต่ละแขนงไว้ในแผนที่เดียวกัน เลือกอ่านว่าแต่ละแขนงศึกษาอะไร และมุมที่เราใช้อ่านมัน"
      />

      <section className="scroll-reveal stagger-1 tpl-reference">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((d) => (
            <DisciplineCard key={d.key} entry={d} href={`/disciplines/${d.key}`} />
          ))}
        </div>
      </section>

      <PageNav current="/knowledge" />
    </main>
  );
}
