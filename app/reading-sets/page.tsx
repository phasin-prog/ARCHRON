import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { getPublicReadingSets } from "@/lib/content/public-source";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ซีรีส์ / ชุดอ่าน — ARCHRON",
};

export default async function ReadingSetsPage() {
  const readingSets = await getPublicReadingSets();

  return (
    <main className="pb-24">
      <PageHeader
        kicker="ซีรีส์ / ชุดอ่าน"
        title="เส้นทางการอ่าน"
        lead="ลำดับการอ่านที่ช่วยให้ผู้อ่านเดินจากพื้นฐานไปสู่ความลึก — เส้นทางคือทางเดิน ไม่ใช่หมวดหมู่"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-4xl px-6">
        {readingSets.length === 0 ? (
          <div className="rounded-md border border-slate-boundary/40 bg-paper/50 p-10 text-center">
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
              <Link
                href="/knowledge"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-boundary/50 px-4 py-2 text-sm text-soft-ivory transition-colors hover:border-burnished-gold/40 hover:text-burnished-gold"
              >
                แผนที่ความรู้
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {readingSets.map((set) => (
              <article key={set.slug} className="archron-card p-6 md:p-8 border border-slate-boundary/50 bg-paper/40 rounded-sm">
                <header className="mb-4">
                  <h2 className="font-serif text-2xl text-ivory">{set.title}</h2>
                  {set.shortDescription && (
                    <p className="text-xs text-soft-ivory/70 mt-1">{set.shortDescription}</p>
                  )}
                </header>
                {set.bodyMarkdown && (
                  <div className="markdown-body prose prose-invert max-w-none text-sm text-soft-ivory/90 leading-relaxed mt-4 border-t border-slate-boundary/30 pt-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {set.bodyMarkdown}
                    </ReactMarkdown>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
      <PageNav current="/reading-sets" />
    </main>
  );
}
