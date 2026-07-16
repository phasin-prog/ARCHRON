import Link from "next/link";
import { Suspense } from "react";
import { RecentlyViewed } from "@/components/recently-viewed";
import { RecentlyViewedSkeleton } from "@/components/skeleton";
import { HomeSearch } from "@/components/home-search";
import { ArrowRightIcon } from "@/components/icons";
import { getPublicEntries } from "@/lib/content/publishing/public-source";

export const revalidate = 300;

async function HeroSection() {
  return (
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
  );
}

function CTASection() {
  return (
    <section className="mt-8 flex justify-center px-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-text-inverse transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]"
        >
          สำรวจคลังความรู้
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 rounded-full border border-accent/30 px-6 py-3 text-sm font-semibold text-accent transition-all hover:border-accent hover:bg-accent/8 hover:-translate-y-0.5"
        >
          วิเคราะห์บุคลิกภาพ
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// Async component — ข้อมูล content (articles + concepts) streamed via Suspense
async function ContentGrid() {
  const published = await getPublicEntries();
  const publishedSlugs = published.map((e) => e.slug);
  const articles = published.filter((e) => e.contentType === "article").slice(0, 3);
  const concepts = published.filter((e) => e.contentType === "concept").slice(0, 6);

  return (
    <>
      {/* SEARCH BAR */}
      <section className="relative z-10 -mt-8 flex justify-center px-4">
        <div className="w-full max-w-[720px]">
          <HomeSearch publishedSlugs={publishedSlugs} />
        </div>
      </section>

      <CTASection />

      {/* ARTICLES */}
      {articles.length > 0 && (
        <section className="tpl-content mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-semibold text-text-heading">
              บทความล่าสุด
            </h2>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
            >
              ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
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

      {/* CONCEPTS */}
      {concepts.length > 0 && (
        <section className="tpl-content mt-20">
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-semibold text-text-heading">
              แนวคิดน่าสนใจ
            </h2>
            <Link
              href="/concepts"
              className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-hover"
            >
              ดูทั้งหมด <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
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

      {/* FEATURED GUIDE */}
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
    </>
  );
}

function ContentGridSkeleton() {
  return (
    <>
      <section className="relative z-10 -mt-8 flex justify-center px-4">
        <div className="w-full max-w-[720px] h-16 animate-pulse rounded-2xl bg-surface-2" />
      </section>
      <CTASection />
      <div className="tpl-content mt-20 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-6 w-40 animate-pulse rounded bg-surface-2 mb-4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-32 animate-pulse rounded-xl bg-surface-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <main>
      <HeroSection />

      {/* Suspense: stream content grid (search + CTA + articles + concepts) */}
      <Suspense fallback={<ContentGridSkeleton />}>
        <ContentGrid />
      </Suspense>

      {/* Suspense: recently viewed (client-only localStorage + dynamic) */}
      <Suspense fallback={<RecentlyViewedSkeleton />}>
        <RecentlyViewed />
      </Suspense>
    </main>
  );
}
