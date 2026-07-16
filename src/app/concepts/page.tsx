import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { conceptRegistry } from "@/lib/content/core/registry";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { ConceptsBrowser } from "@/components/concepts/concepts-browser";

export const metadata: Metadata = {
  title: "คลังแนวคิด — ARCHRON",
  description:
    "รวมคำศัพท์ แนวคิด และสัญลักษณ์ที่เกี่ยวข้องกับจิตใจมนุษย์ พร้อมลิงก์ไปยังเนื้อหาที่เกี่ยวข้อง",
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
      kicker="คลังแนวคิด"
      title="แนวคิดเกี่ยวกับจิตใจมนุษย์"
      lead="ค้นหาคำศัพท์ แนวคิด ตัวตน และสัญลักษณ์ พร้อมลิงก์ไปยังเนื้อหาที่เกี่ยวข้อง"
      ambient
      navCurrent="/concepts"
      className="atmo-dictionary"
    >
      <section className="tpl-reference">
        <ConceptsBrowser concepts={conceptRegistry} publishedSlugs={publishedSlugs} />
      </section>
    </PageScaffold>
  );
}
