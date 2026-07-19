import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { ReadingErrorBoundary } from "@/components/reading/reading-error-boundary";
import { entries } from "@/lib/content/core/seeds/entries";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { isConceptRouteEntry } from "@/lib/content/routing";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import { articleLd, breadcrumbLd, organizationLd } from "@/lib/content/seo/structured-data";

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return entries
    .filter((entry) => entry.status === "published" && isConceptRouteEntry(entry))
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (entry) {
    if (!isConceptRouteEntry(entry)) return { title: "ไม่พบหน้า — ARCHRON" };
    return generatePageMetadata(entry);
  }
  return { title: "ไม่พบหน้า — ARCHRON" };
}

export default async function ConceptNodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);

  if (!entry || !isConceptRouteEntry(entry)) {
    notFound();
  }

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      breadcrumbLd([
        { name: "หน้าแรก", href: "/" },
        { name: "คลังแนวคิด", href: "/concepts" },
        { name: entry.title, href: `/concepts/${entry.slug}` },
      ]),
      articleLd(entry),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <ReadingErrorBoundary>
        <ReadingPage entry={entry} section="concepts" atmosphere="atmo-dictionary" />
      </ReadingErrorBoundary>
    </>
  );
}
