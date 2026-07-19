import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import type { ConceptRegistryItem, NodeType } from "@/lib/content/core/registry";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { ConceptsBrowser } from "@/components/concepts/concepts-browser";

const NODE_TYPE_MAP: Record<string, NodeType> = {
  concept: "concept", person: "person", book: "book",
  symbol: "symbol", term: "term", "source-note": "concept",
};

export const metadata: Metadata = {
  title: "คลังแนวคิด — ARCHRON",
  description:
    "รวมคำศัพท์ แนวคิด และสัญลักษณ์ที่เกี่ยวข้องกับจิตใจมนุษย์ พร้อมลิงก์ไปยังเนื้อหาที่เกี่ยวข้อง",
};

export const revalidate = 300;

export default async function ConceptsPage() {
  const published = await getPublicEntries();
  const publishedSlugs = published
    .filter((e) => e.contentType !== "article")
    .map((e) => e.slug);

  const registryItems: ConceptRegistryItem[] = published
    .filter((e) => e.contentType !== "article")
    .map((e) => {
      const m = e as { mainTerm?: string; thaiName?: string; framework?: string };
      return {
        id: e.id,
        title: m.mainTerm || e.title,
        slug: e.slug,
        thaiTitle: m.thaiName,
        aliases: [e.title],
        nodeType: NODE_TYPE_MAP[e.contentType] ?? "concept",
        framework: m.framework,
        description: e.shortDescription,
      };
    });

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
        <ConceptsBrowser concepts={registryItems} publishedSlugs={publishedSlugs} />
      </section>
    </PageScaffold>
  );
}
