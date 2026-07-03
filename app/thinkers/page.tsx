import type { Metadata } from "next";
import { getPublicSchools } from "@/lib/content/public-source";
import { PageScaffold } from "@/components/page-scaffold";
import { ThinkersHub } from "@/components/thinkers/thinkers-hub";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "คลังปัญญา: ดัชนีนักปราชญ์และผู้สร้างสรรค์แนวคิด — ARCHRON",
  description:
    "รวบรวมประวัติ ผลงานเด่น และคุณูปการของนักคิด นักจิตวิทยา จิตวิเคราะห์ และนักปราชญ์คนสำคัญที่วางรากฐานการศึกษาจิตใจมนุษย์",
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
      kicker="Thinkers Index"
      title="ดัชนีนักปราชญ์"
      lead="สำรวจชีวประวัติ คุณูปการ และความสัมพันธ์เชิงอิทธิพลของนักคิดผู้บุกเบิกในศาสตร์ต่าง ๆ"
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "สำนักคิดและนักปราชญ์", href: "/schools" },
        { label: "ดัชนีนักปราชญ์" },
      ]}
      ambient
      navCurrent="/schools"
    >
      <div className="mx-auto max-w-6xl px-6">
        <ThinkersHub thinkers={thinkers} />
      </div>
    </PageScaffold>
  );
}
