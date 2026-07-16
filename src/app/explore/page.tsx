import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { ExploreHub } from "@/components/explore/explore-hub";

export const metadata: Metadata = {
  title: "สำรวจคลังความรู้ — ARCHRON",
  description:
    "ค้นพบและสำรวจมโนทัศน์ บทความ และทฤษฎีทางจิตวิทยาเชิงลึก ปรัชญา และมนุษยศาสตร์ ตามกระแสยอดนิยมและระบบสุ่มเชื่อมโยงทางปัญญา",
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
      kicker="ศูนย์รวมการสำรวจ"
      title="ศูนย์รวมการสำรวจความรู้"
      lead="สำรวจความหมาย ข้ามสายใยปัญญา และสุ่มค้นพบองค์ความรู้ที่เป็นรากฐานของมนุษย์ เพื่อขยายขอบเขตความสงสัยใคร่ครวญ (Curiosity Psychology)"
      ambient
      navCurrent="/explore"
    >
      <section className="tpl-content">
        <ExploreHub entries={entries} />
      </section>
    </PageScaffold>
  );
}
