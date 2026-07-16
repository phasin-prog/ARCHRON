import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { CompareMatrix } from "@/components/compare/compare-matrix";

export const metadata: Metadata = {
  title: "เปรียบเทียบมโนทัศน์และแนวคิด — ARCHRON",
  description:
    "เครื่องมือเปรียบเทียบข้อมูลของแนวคิด บทความ และสำนักคิดในคลัง ARCHRON",
};

export const revalidate = 300;

export default async function ComparePage() {
  const entries = await getPublicEntries();

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "เปรียบเทียบความรู้" },
      ]}
      kicker="เมทริกซ์เปรียบเทียบ"
      title="ตารางเปรียบเทียบเชิงวิเคราะห์"
      lead="เลือกสองรายการเพื่ออ่านข้อมูลคู่ขนานและดูจุดที่เหมือนหรือต่างกัน"
      ambient
      navCurrent="/compare"
    >
      <section className="tpl-content">
        <CompareMatrix entries={entries} />
      </section>
    </PageScaffold>
  );
}
