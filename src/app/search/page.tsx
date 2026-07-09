import type { Metadata } from "next";
import { getPublicEntries } from "@/lib/content/public-source";
import { buildSearchIndex } from "@/features/search/index";
import { SearchClient } from "@/components/search/search-client";
import { PageScaffold } from "@/components/page-scaffold";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ค้นหา — ARCHRON",
  description:
    "ค้นหาแนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ ในคลังความรู้จิตใจมนุษย์",
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
      kicker="Search"
      title="ค้นหา"
      lead="ค้นทั่วทั้งคลังความรู้ — แนวคิด บทความ ทรัพยากรภายนอก และหน้าต่าง ๆ ในที่เดียว"
      className="atmo-observatory"
    >
      <section className="tpl-reference">
        <SearchClient items={index} initialQuery={q ?? ""} />
      </section>
    </PageScaffold>
  );
}
