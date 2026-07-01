import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { PageNav } from "@/components/page-nav";
import { ViewBadge } from "@/components/view-badge";
import { EmptyState } from "@/components/empty-state";
import { getPublicEntries } from "@/lib/content/public-source";
import { nodeTypeCosmology } from "@/lib/content/cosmology";

export const metadata: Metadata = {
  title: "บทความ — ARCHRON",
};

// E8 — อ่านจาก Supabase (published) + fallback static · ISR 5 นาที + on-demand จาก E7
export const revalidate = 300;

export default async function ArticlesPage() {
  const published = await getPublicEntries();
  const articles = published.filter((e) => e.contentType === "article");

  return (
    <main className="pb-24">
      <PageHeader
        kicker="บทความ"
        title="บทความ"
        lead="งานอ่านที่อธิบาย วิเคราะห์ และตีความแนวคิดเกี่ยวกับจิตใจมนุษย์ โดยวางไว้ในบริบทเดิมและเชื่อมกลับไปยังแนวคิดและแหล่งอ้างอิง"
      />
      <section className="scroll-reveal stagger-1 mx-auto max-w-6xl px-6">
        {articles.length === 0 ? (
          <EmptyState
            icon="article"
            title="ยังไม่มีบทความเผยแพร่ — กำลังจัดเตรียมเนื้อหาชุดแรก"
            description="เนื้อหาเริ่มต้นจะถูกเพิ่มใน Phase 13 (Initial Content Seed)"
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((e) => (
              <Link
                key={e.slug}
                href={`/articles/${e.slug}`}
                className={`archron-card archron-card--${nodeTypeCosmology(e.contentType)} group flex min-h-[220px] flex-col justify-between p-6 focus-visible:ring-2 focus-visible:ring-burnished-gold focus-visible:outline-none`}
              >
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--cosmology-accent,#CBA45A)] opacity-85">
                    {e.framework ?? e.contentType}
                  </span>
                  <h2 className="mt-2.5 font-serif text-xl text-ivory transition-colors group-hover:text-soft-gold">
                    {e.title}
                  </h2>
                  {e.shortDescription ? (
                    <p className="mt-3 text-sm leading-relaxed text-soft-ivory/80 line-clamp-3">
                      {e.shortDescription}
                    </p>
                  ) : null}
                </div>
                <span className="mt-5 flex items-center justify-between border-t border-slate-boundary/20 pt-4">
                  <span className="text-xs font-semibold text-[var(--cosmology-accent,#CBA45A)] flex items-center gap-1 transition-transform duration-300 group-hover:translate-x-1">
                    อ่านต่อ <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                  </span>
                  <span className="flex items-center gap-3">
                    {e.author ? (
                      <span className="text-xs text-on-surface-variant/50">โดย {e.author}</span>
                    ) : null}
                    <ViewBadge slug={e.slug} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
      <PageNav current="/articles" />
    </main>
  );
}
