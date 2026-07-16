import type { Metadata } from "next";
import { getPublicSchools } from "@/lib/content/publishing/public-source";
import { PageScaffold } from "@/components/page-scaffold";
import { ThinkersHub } from "@/components/thinkers/thinkers-hub";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ดัชนีนักคิด — ARCHRON",
  description:
    "รายชื่อนักคิด นักจิตวิทยา และนักจิตวิเคราะห์ พร้อมข้อมูลประวัติ ผลงาน และสำนักคิดที่เกี่ยวข้อง",
};

export default async function ThinkersPage() {
  const schools = await getPublicSchools();

  // ดึงรายชื่อนักคิดทั้งหมดจากทุกสำนักคิด
  const thinkers = schools.flatMap((s) =>
    s.thinkers.map((t) => ({
      ...t,
      schoolId: s.id,
      schoolNameTh: s.nameTh,
      schoolNameEn: s.nameEn,
      field: s.field,
    }))
  );

  return (
    <PageScaffold
      kicker="นักคิด"
      title="ดัชนีนักคิด"
      lead="ค้นหาข้อมูลชีวประวัติ ผลงาน และสำนักคิดที่เกี่ยวข้องกับนักคิดแต่ละคน"
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "ดัชนีนักคิด" },
      ]}
      ambient
      navCurrent="/thinkers"
      className="atmo-biography"
    >
      <div className="relative tpl-reference">
        <ThinkersHub thinkers={thinkers} />
      </div>
    </PageScaffold>
  );
}
