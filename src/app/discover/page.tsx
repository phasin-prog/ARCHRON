import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { conceptRegistry } from "@/lib/content/core/registry";
import { DiscoverGrid } from "@/components/discover/discover-grid";

export const metadata: Metadata = {
  title: "ค้นพบ — ARCHRON",
  description:
    "สำรวจและค้นพบเนื้อหาใน ARCHRON ตามหมวดหมู่ แขนงวิชา และหัวข้อที่น่าสนใจ",
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
      lead="สำรวจเนื้อหาตามหมวดหมู่และหัวข้อที่สนใจ — เริ่มจากสิ่งที่อยากรู้ หรือเดินตามเส้นทางที่แนะนำ"
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
