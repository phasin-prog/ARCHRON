import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { ReadingErrorBoundary } from "@/components/reading/reading-error-boundary";
import { allEntrySlugs } from "@/lib/content/core/seeds/entries";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import { articleLd, breadcrumbLd, organizationLd } from "@/lib/content/seo/structured-data";
import { Suspense } from "react";

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry) return { title: "ไม่พบหน้า — ARCHRON" };
  return generatePageMetadata(entry);
}

export default function ArticleEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">กำลังโหลด...</div>}>
      <ArticleContent params={params} />
    </Suspense>
  );
}

async function ArticleContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry) notFound();

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      breadcrumbLd([
        { name: "หน้าแรก", href: "/" },
        { name: "บทความ", href: "/articles" },
        { name: entry.title, href: `/articles/${entry.slug}` },
      ]),
      articleLd(entry),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <ReadingErrorBoundary>
        <ReadingPage entry={entry} section="articles" atmosphere="atmo-magazine" />
      </ReadingErrorBoundary>
    </>
  );
}
