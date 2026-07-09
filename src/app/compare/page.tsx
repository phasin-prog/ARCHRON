import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/public-source";
import { CompareMatrix } from "@/components/compare/compare-matrix";

export const metadata: Metadata = {
  title: "เปรียบเทียบมโนทัศน์และแนวคิด — ARCHRON",
  description:
    "ตารางเปรียบเทียบเชิงวิเคราะห์คู่ขนาน (Comparative Knowledge Matrix) เพื่อศึกษารากฐาน ข้อถกเถียง และความเชื่อมโยงระหว่างแนวคิดและนักคิด",
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
      kicker="COMPARE MATRIX"
      title="ตารางเปรียบเทียบเชิงวิเคราะห์"
      lead="วิเคราะห์เปรียบเทียบคู่ขนานระหว่าง 2 มโนทัศน์ ทฤษฎี หรือสำนักคิด เพื่อทำความเข้าใจข้อแตกต่าง จุดเชื่อมโยง และรากฐานปรัชญาอย่างรอบด้าน"
      ambient
      navCurrent="/compare"
    >
      <section className="tpl-content">
        <CompareMatrix entries={entries} />
      </section>
    </PageScaffold>
  );
}
