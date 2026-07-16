import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { conceptRegistry } from "@/lib/content/core/registry";
import { DiscoverGrid } from "@/components/discover/discover-grid";

export const metadata: Metadata = {
  title: "ค้นพบ — ARCHRON",
  description:
    "เลือกดูเนื้อหาใน ARCHRON ตามประเภท หรือค้นหาด้วยคำที่ต้องการ",
};

export const revalidate = 300;

export default async function DiscoverPage() {
  const published = await getPublicEntries();

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
          concepts={conceptRegistry}
        />
      </section>
    </PageScaffold>
  );
}
