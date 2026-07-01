import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { LoopCarousel } from "@/components/loop-carousel";
import { DisciplineCard } from "@/components/discipline-card";
import { DISCIPLINES } from "@/lib/content/disciplines";

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
        lead="การเข้าใจมนุษย์ไม่อาจอาศัยศาสตร์เดียว — ARCHRON เดินข้ามพรมแดนวิชา แล้ววางแต่ละแขนงไว้ในแผนที่เดียวกัน ด้านล่างคือสิ่งที่แต่ละแขนงศึกษา และมุมที่เราใช้อ่านมัน"
      />

      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        <LoopCarousel ariaLabel="สิบสองแขนงของการเข้าใจมนุษย์ — เลื่อนวนได้">
          {DISCIPLINES.map((d) => (
            <DisciplineCard key={d.key} entry={d} />
          ))}
        </LoopCarousel>

        <p className="mt-6 text-center text-xs text-muted">
          ลากซ้าย–ขวา หรือกดปุ่มลูกศร · การ์ดจะวนกลับมาเรื่อย ๆ ไม่มีจุดสิ้นสุด
        </p>
      </section>

      <PageNav current="/knowledge" />
    </main>
  );
}
