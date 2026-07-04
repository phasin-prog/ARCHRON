import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/public-source";
import { conceptRegistry } from "@/lib/content/concept-registry";
import { getPublicSchools } from "@/lib/content/public-source";
import { DiscoverGrid } from "@/components/discover/discover-grid";

export const metadata: Metadata = {
  title: "ค้นพบ — ARCHRON",
  description:
    "สำรวจและค้นพบเนื้อหาใน ARCHRON ตามหมวดหมู่ แขนงวิชา และหัวข้อที่น่าสนใจ",
};

export const revalidate = 300;

export default async function DiscoverPage() {
  const [published, schools] = await Promise.all([
    getPublicEntries(),
    getPublicSchools(),
  ]);

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "ค้นพบ" },
      ]}
      kicker="DISCOVER"
      title="ค้นพบ ARCHRON"
      lead="สำรวจเนื้อหาตามหมวดหมู่ แขนงวิชา และหัวข้อที่สนใจ — เริ่มจากสิ่งที่อยากรู้ หรือเดินตามเส้นทางที่แนะนำ"
      ambient
      navCurrent="/discover"
    >
      <section className="mx-auto max-w-6xl px-6">
        <DiscoverGrid
          entries={published}
          schools={schools}
          concepts={conceptRegistry}
        />
      </section>
    </PageScaffold>
  );
}
