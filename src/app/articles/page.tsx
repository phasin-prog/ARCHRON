import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { EmptyState } from "@/components/empty-state";
import { getPublicEntries } from "@/lib/content/publishing/public-source";
import { getLibraryArticles } from "@/lib/content/routing";
import { ArticlesBrowser } from "@/components/articles/articles-browser";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "บทความ — ARCHRON",
  description:
    "บทความว่าด้วยจิตวิทยาเชิงลึก จิตวิเคราะห์ ปรัชญา และมนุษยศาสตร์ พร้อมการตีความในบริบทของแหล่งอ้างอิง",
};

// E8 — อ่านจาก Supabase (published) + fallback static · ISR 5 นาที + on-demand จาก E7
export const revalidate = 300;

export default async function ArticlesPage() {
  const published = await getPublicEntries();
  const articles = getLibraryArticles(published);

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "บทความ" },
      ]}
      kicker="บทความ"
      title="บทความ"
      lead="บทความที่อธิบายและตีความแนวคิดเกี่ยวกับจิตใจมนุษย์ โดยระบุบริบทและแหล่งอ้างอิงที่เกี่ยวข้อง"
      ambient
      navCurrent="/articles"
      className="atmo-magazine"
    >
      <section className="relative tpl-reference">
        {articles.length === 0 ? (
          <EmptyState
            icon="article"
            title="ยังไม่มีบทความเผยแพร่ในขณะนี้"
              description="ขณะนี้ยังไม่มีบทความเผยแพร่ ลองเริ่มจากคลังแนวคิดหรือนักปราชญ์"
          >
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/concepts"
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                สำรวจคลังแนวคิด
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/thinkers"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-4 py-2 text-sm text-text-body transition-colors hover:border-accent/40 hover:text-accent"
              >
                ดูนักปราชญ์
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </EmptyState>
        ) : (
          <ArticlesBrowser articles={articles} />
        )}
      </section>
    </PageScaffold>
  );
}
