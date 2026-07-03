import type { Metadata } from "next";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntries } from "@/lib/content/public-source";
import { DiscoverGrid } from "@/components/discover/discover-grid";

export const metadata: Metadata = {
  title: "ค้นพบความรู้เชิงลึก — ARCHRON",
  description:
    "ศูนย์รวมการค้นพบความรู้ (Faceted Discovery Portal) คัดกรองตามสาขาวิชา ระดับความลึกซึ้ง และต้นฉบับแนวคิด",
};

export const revalidate = 300;

export default async function DiscoverPage() {
  const entries = await getPublicEntries();

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "ศูนย์รวมการค้นพบ" },
      ]}
      kicker="DISCOVERY PORTAL"
      title="ค้นพบมโนทัศน์และงานเขียน"
      lead="สำรวจคลังความรู้ตามมิติสาขาวิชา ระดับความลึกซึ้งในการอ่าน และรหัสพันธุกรรมความรู้ (EDS 6-Layer Genome)"
      ambient
      navCurrent="/discover"
    >
      <section className="mx-auto max-w-7xl px-6">
        <DiscoverGrid entries={entries} />
      </section>
    </PageScaffold>
  );
}
