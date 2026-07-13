import type { Metadata } from "next";
import { getPublicSchools } from "@/lib/content/publishing/public-source";
import { SchoolsHub } from "@/components/schools/schools-hub";
import { PageScaffold } from "@/components/page-scaffold";
import { EmptyState } from "@/components/empty-state";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "คลังปัญญา: สำนักคิดและนักปราชญ์โลก — ARCHRON",
  description:
    "ไดเรกทอรีสำนักคิดและนักปราชญ์โลก — สำรวจสำนักคิด นักปราชญ์ และผลงานเด่น เรียงตามชื่อสำนัก พร้อมค้นหาและดัชนีตัวอักษร",
};

export default async function SchoolsPage() {
  const schools = await getPublicSchools();

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "สำนักคิดและนักปราชญ์" },
      ]}
      kicker="Schools of Thought & Thinkers"
      title="คลังปัญญา: สำนักคิดและนักปราชญ์โลก"
      lead="สำรวจสำนักคิด นักปราชญ์ และผลงานเด่น — เรียงตามชื่อสำนัก ค้นหาได้ตามชื่อสำนัก ชื่อนักคิด หรือชื่อผลงาน"
      ambient
      navCurrent="/schools"
      className="atmo-temple"
    >
      <section className="relative tpl-reference">
        {schools.length === 0 ? (
          <EmptyState
            icon="groups_2"
            title="ยังไม่มีข้อมูลสำนักคิดในขณะนี้"
            description="เรากำลังเรียบเรียงข้อมูลสำนักคิดและนักปราชญ์อย่างพิถีพิถัน — ระหว่างนี้สำรวจคลังแนวคิดหรือบทความอื่น ๆ ก่อนได้เลย"
          />
        ) : (
          <SchoolsHub schools={schools} />
        )}
      </section>
    </PageScaffold>
  );
}
