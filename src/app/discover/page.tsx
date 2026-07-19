import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import type { ConceptRegistryItem, NodeType } from "@/lib/content/core/registry";
import { DiscoverGrid } from "@/components/discover/discover-grid";

const NODE_TYPE_MAP: Record<string, NodeType> = {
  concept: "concept", person: "person", book: "book",
  symbol: "symbol", term: "term", "source-note": "concept",
};

export const metadata: Metadata = {
  title: "ค้นพบ — ARCHRON",
  description:
    "เลือกดูเนื้อหาใน ARCHRON ตามประเภท หรือค้นหาด้วยคำที่ต้องการ",
};

export const revalidate = 300;

export default async function DiscoverPage() {
  const published = await getPublicEntries();

  const registryItems: ConceptRegistryItem[] = published.map((e) => {
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
        { label: "ค้นพบ" },
      ]}
      kicker="ค้นพบ"
      title="ค้นพบ ARCHRON"
      lead="เลือกประเภทเนื้อหา หรือพิมพ์คำที่ต้องการค้นหา"
      ambient
      navCurrent="/discover"
    >
      <section className="tpl-reference">
        <DiscoverGrid
          entries={published}
          concepts={registryItems}
        />
      </section>
    </PageScaffold>
  );
}
