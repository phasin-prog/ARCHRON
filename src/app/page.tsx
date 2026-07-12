import Link from "next/link";
import { RecentlyViewed } from "@/components/recently-viewed";
import { HomeSearch } from "@/components/home-search";
import { ArrowRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { getPublicEntries } from "@/lib/content/public-source";

export const revalidate = 300;

export default async function HomePage() {
  const published = await getPublicEntries();
  const articles = published.filter((e) => e.contentType === "article").slice(0, 3);
  const concepts = published.filter((e) => e.contentType === "concept").slice(0, 6);

  return (
    <main>
      {/* ── 1. HERO ── */}
      <section className="relative flex min-h-[35vh] flex-col items-center justify-center overflow-hidden px-4 text-center sm:min-h-[45vh]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold tracking-tight text-text-heading sm:text-6xl md:text-7xl">
            ARCHRON
          </h1>
          <p className="mt-4 font-serif text-xl text-text-secondary sm:text-2xl">
            เข้าใจมนุษย์ ผ่านความรู้
          </p>
          <p className="mt-2 font-serif text-base text-text-secondary">
            Understanding Humanity Through Knowledge
          </p>
        </div>
      </section>

      {/* ── 2. SEARCH BAR ── */}
      <section className="relative z-10 -mt-8 flex justify-center px-4">
        <div className="w-full max-w-[720px]">
          <HomeSearch />
        </div>
      </section>

      {/* ── 3. CONTINUE READING ── */}
      <section className="tpl-content mt-20">
        <RecentlyViewed />
      </section>

      {/* ── 4. FEATURED ARTICLES ── */}
      {articles.length > 0 && (
        <section className="tpl-content mt-20">
          <SectionHeading
            title="บทความล่าสุด"
            action={
              <Link
                href="/articles"
                className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
              >
                ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group rounded-xl border border-border bg-bg-card p-5 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
              >
                {article.framework && (
                  <span className="inline-block rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {article.framework}
                  </span>
                )}
                <h3 className="mt-3 font-serif text-base font-semibold text-text-heading transition-colors group-hover:text-accent">
                  {article.title}
                </h3>
                {article.shortDescription && (
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {article.shortDescription}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 5. EXPLORE CONCEPTS ── */}
      {concepts.length > 0 && (
        <section className="tpl-content mt-20">
          <SectionHeading
            title="แนวคิดน่าสนใจ"
            action={
              <Link
                href="/concepts"
                className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
              >
                ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {concepts.map((concept) => (
              <Link
                key={concept.slug}
                href={`/concepts/${concept.slug}`}
                className="group rounded-xl border border-border bg-bg-card p-5 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
              >
                <h3 className="font-serif text-base font-semibold text-text-heading transition-colors group-hover:text-accent">
                  {concept.thaiName || concept.mainTerm || concept.title}
                </h3>
                {concept.mainTerm && concept.mainTerm !== (concept.thaiName || concept.title) && (
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {concept.mainTerm}
                  </p>
                )}
                {concept.shortDescription && (
                  <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                    {concept.shortDescription}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── 6. FEATURED GUIDE ── */}
      <section className="tpl-content mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-2xl font-semibold text-text-heading">
            คู่มือแนะนำ
          </h2>
          <Link
            href="/guide"
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
          >
            ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/guide"
            className="group rounded-xl border border-border bg-bg-card p-6 transition-colors hover:border-accent/30 hover:bg-bg-elevated"
          >
            <span className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">
              Guide
            </span>
            <h3 className="mt-3 font-serif text-lg font-semibold text-text-heading">
              Jungian Type Analysis
            </h3>
            <p className="mt-2 text-sm text-text-secondary line-clamp-2">
              วิเคราะห์โครงสร้าง Ego ผ่านกรอบทฤษฎีจิตวิทยาเชิงลึกของคาร์ล ยุง
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
