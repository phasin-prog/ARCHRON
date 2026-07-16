import type { Metadata } from "next";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { buildSearchIndex } from "@/features/search/index";
import { SearchClient } from "@/components/search/search-client";
import { PageScaffold } from "@/components/page-scaffold";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ค้นหา — ARCHRON",
  description:
    "ค้นหาแนวคิด บทความ แหล่งข้อมูลภายนอก และหน้าต่าง ๆ ใน ARCHRON",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const index = buildSearchIndex(await getPublicEntries());

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "ค้นหา" },
      ]}
      kicker="ค้นหา"
      title="ค้นหา"
      lead="ค้นหาแนวคิด บทความ แหล่งข้อมูลภายนอก และหน้าต่าง ๆ จากช่องเดียว"
      className="atmo-observatory"
    >
      <section className="tpl-reference">
        <SearchClient items={index} initialQuery={q ?? ""} />
      </section>
    </PageScaffold>
  );
}
