import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { conceptRegistry } from "@/lib/content/concept-registry";
import { getPublicEntries } from "@/lib/content/public-source";
import { ConceptsBrowser } from "@/components/concepts/concepts-browser";

export const metadata: Metadata = {
  title: "คลังแนวคิด — ARCHRON",
  description:
    "แผนที่ระบบความรู้แบบเชื่อมโยง ค้นคว้าความหมายเชิงลึกและโครงสร้างความสัมพันธ์ของแนวคิดทางวิทยาศาสตร์ จิตวิทยา และปรัชญา",
};

export const revalidate = 300;

export default async function ConceptsPage() {
  const published = await getPublicEntries();
  // รวบรวมเฉพาะ slugs ของประเภทเนื้อหาที่ไม่ใช่บทความ (แนวคิด, ศัพท์, สัญลักษณ์ ฯลฯ)
  const publishedSlugs = published
    .filter((e) => e.contentType !== "article")
    .map((e) => e.slug);

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "คลังแนวคิด" },
      ]}
      kicker="คลังแนวคิด / Wiki"
      title="แผนที่ความรู้ของจิตใจมนุษย์"
      lead="สำรวจและสืบค้นความหมายเชิงลึกของคำศัพท์ แนวคิด ตัวตน และสัญลักษณ์ต่าง ๆ ในแบบแผนที่ความรู้เชื่อมโยงกันอย่างมีโครงสร้าง"
      ambient
      navCurrent="/concepts"
      className="atmo-dictionary"
    >
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <ConceptsBrowser concepts={conceptRegistry} publishedSlugs={publishedSlugs} />
      </section>
    </PageScaffold>
  );
}
