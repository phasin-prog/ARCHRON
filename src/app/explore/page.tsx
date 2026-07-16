import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { ExploreHub } from "@/components/explore/explore-hub";

export const metadata: Metadata = {
  title: "สำรวจคลังความรู้ — ARCHRON",
  description:
    "เลือกดูรายการล่าสุด เนื้อหาระดับกลางและระดับสูง หรือสุ่มรายการจากคลัง ARCHRON",
};

export const revalidate = 300;

export default async function ExplorePage() {
  const entries = await getPublicEntries();

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "ศูนย์รวมการสำรวจ" },
      ]}
      kicker="สำรวจ"
      title="สำรวจเนื้อหาในคลัง"
      lead="เลือกดูรายการล่าสุด เนื้อหาระดับกลางและระดับสูง หรือสุ่มรายการเพื่อเปลี่ยนหัวข้อที่กำลังอ่าน"
      ambient
      navCurrent="/explore"
    >
      <section className="tpl-content">
        <ExploreHub entries={entries} />
      </section>
    </PageScaffold>
  );
}
