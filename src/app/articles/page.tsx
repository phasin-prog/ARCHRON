import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";
import { EmptyState } from "@/components/empty-state";
import { getPublicEntries } from "@/lib/content/public-source";
import { ArticlesBrowser } from "@/components/articles/articles-browser";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "บทความ — ARCHRON",
  description:
    "บทความและการตีความจิตวิทยาเชิงลึก สำนักจิตวิเคราะห์ ปรัชญา และศาสตร์แห่งมนุษย์ เพื่อเชื่อมโยงโลกภายในสู่การใช้ชีวิต",
};

// E8 — อ่านจาก Supabase (published) + fallback static · ISR 5 นาที + on-demand จาก E7
export const revalidate = 300;

export default async function ArticlesPage() {
  const published = await getPublicEntries();
  const articles = published.filter((e) => e.contentType === "article");

  return (
    <PageScaffold
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "คลังความรู้", href: "/knowledge" },
        { label: "บทความ" },
      ]}
      kicker="บทความ"
      title="บทความ"
      lead="งานอ่านที่อธิบาย วิเคราะห์ และตีความแนวคิดเกี่ยวกับจิตใจมนุษย์ โดยวางไว้ในบริบทเดิมและเชื่อมกลับไปยังแนวคิดและแหล่งอ้างอิง"
      ambient
      navCurrent="/articles"
      className="atmo-magazine"
    >
      <section className="relative mx-auto max-w-6xl px-6">
        {articles.length === 0 ? (
          <EmptyState
            icon="article"
            title="ยังไม่มีบทความเผยแพร่ในขณะนี้"
            description="เรากำลังเรียบเรียงบทความชุดแรกอย่างพิถีพิถัน — ระหว่างนี้เริ่มสำรวจคลังแนวคิดและสำนักคิดได้เลย"
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
                href="/schools"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/50 px-4 py-2 text-sm text-text-body transition-colors hover:border-accent/40 hover:text-accent"
              >
                ดูสำนักคิด
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
