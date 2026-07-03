import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicReadingSets } from "@/lib/content/public-source";
import { ReadingSetCard } from "@/components/reading-sets/reading-set-card";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ซีรีส์ / ชุดอ่าน — ARCHRON",
  description:
    "เส้นทางการอ่านที่จะพาคุณเดินทางจากแนวคิดพื้นฐานไปสู่ความรู้ในระดับลึกอย่างมีลำดับขั้นตอนและเป็นระบบ",
};

export default async function ReadingSetsPage() {
  const readingSets = await getPublicReadingSets();

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "ซีรีส์เส้นทางการอ่าน" },
      ]}
      kicker="ซีรีส์ / ชุดอ่าน"
      title="เส้นทางการอ่านความรู้"
      lead="ลำดับขั้นตอนการอ่านคัดสรรที่จะช่วยให้ผู้อ่านเดินจากแนวคิดระดับพื้นฐานไปสู่โครงสร้างความรู้ระดับลึกอย่างเป็นขั้นเป็นตอน"
      ambient
      navCurrent="/reading-sets"
    >
      <section className="mx-auto max-w-5xl px-6">
        {readingSets.length === 0 ? (
          <div className="rounded-md border border-slate-boundary/40 bg-surface-container/20 p-10 text-center">
            <p className="font-serif text-lg text-ivory">ยังไม่เปิดเส้นทางการอ่านในขณะนี้</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              เรากำลังเรียบเรียงลำดับการอ่านให้พาคุณจากพื้นฐานไปสู่ความลึกอย่างมีบริบท — ระหว่างนี้เริ่มเดินสำรวจได้จากพื้นที่เหล่านี้
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/concepts"
                className="inline-flex items-center gap-1.5 rounded-lg border border-burnished-gold/40 bg-burnished-gold/10 px-4 py-2 text-sm font-semibold text-burnished-gold transition-colors hover:bg-burnished-gold/20"
              >
                คลังแนวคิด
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                href="/schools"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-boundary/50 px-4 py-2 text-sm text-soft-ivory transition-colors hover:border-burnished-gold/40 hover:text-burnished-gold"
              >
                สำนักคิด
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
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
