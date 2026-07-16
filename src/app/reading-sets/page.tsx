import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { EmptyState } from "@/components/empty-state";
import { getPublicEntries, getPublicReadingSets } from "@/lib/content/publishing/public-source";
import { ReadingSetCard } from "@/components/reading-sets/reading-set-card";
import { ArrowRightIcon } from "@/components/icons";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ซีรีส์ / ชุดอ่าน — ARCHRON",
  description:
    "ชุดอ่านที่จัดลำดับจากแนวคิดพื้นฐานไปสู่เนื้อหาที่อ่านต่อได้",
};

export default async function ReadingSetsPage() {
  const readingSets = await getPublicReadingSets();

  return (
    <PageScaffold
      className="atmo-magazine"
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "ซีรีส์เส้นทางการอ่าน" },
      ]}
      kicker="ซีรีส์ / ชุดอ่าน"
      title="เส้นทางการอ่านความรู้"
      lead="ชุดอ่านที่จัดลำดับแนวคิดพื้นฐานและเนื้อหาที่เกี่ยวข้องไว้เป็นขั้นตอน"
      ambient
      navCurrent="/reading-sets"
    >
      <section className="tpl-reference">
        {readingSets.length === 0 ? (
          <EmptyState
            icon="menu_book"
            title="ยังไม่เปิดเส้นทางการอ่านในขณะนี้"
            description="ขณะนี้ยังไม่มีชุดอ่านเผยแพร่ ลองเริ่มจากคลังแนวคิดหรือนักปราชญ์"
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/concepts"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  คลังแนวคิด
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/thinkers"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-4 py-2 text-sm text-text-body transition-colors hover:border-accent/40 hover:text-accent"
                >
                  นักปราชญ์
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            }
          />
        ) : (
          <div className="space-y-8">
            {readingSets.map((set) => (
              <ReadingSetCard key={set.slug} set={set} />
            ))}
          </div>
        )}
      </section>
    </PageScaffold>
  );
}
