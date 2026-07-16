import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { entries } from "@/lib/content/core/seeds/entries";
import { isLibraryEntry } from "@/lib/content/routing";
import { ReadingPage } from "@/components/reading/reading-page";
import { ReadingErrorBoundary } from "@/components/reading/reading-error-boundary";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import { bookLd, breadcrumbLd, organizationLd } from "@/lib/content/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 300;

export function generateStaticParams() {
  return entries
    .filter(
      (entry) =>
        entry.status === "published" &&
        entry.contentType === "book" &&
        isLibraryEntry(entry),
    )
    .map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry || entry.contentType !== "book" || !isLibraryEntry(entry)) {
    return { title: "ไม่พบหนังสือ — ARCHRON" };
  }
  return generatePageMetadata(entry);
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry || entry.contentType !== "book" || !isLibraryEntry(entry)) notFound();

  const ldJson = {
    "@context": "https://schema.org",
    "@graph": [
      organizationLd(),
      breadcrumbLd([
        { name: "หน้าแรก", href: "/" },
        { name: "คลังความรู้", href: "/knowledge" },
        { name: "หนังสือ", href: "/books" },
        { name: entry.title, href: `/books/${entry.slug}` },
      ]),
      bookLd(entry),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />
      <ReadingErrorBoundary>
        <ReadingPage entry={entry} section="books" />
      </ReadingErrorBoundary>
    </>
  );
}
