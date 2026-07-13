import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";
import { ReadingPage } from "@/components/reading/reading-page";
import { generatePageMetadata } from "@/lib/content/seo/metadata";
import { bookLd, breadcrumbLd, organizationLd } from "@/lib/content/seo/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const { allEntrySlugs } = await import("@/lib/content/core/seeds/entries");
  return allEntrySlugs()
    .filter((slug) => slug.startsWith("book-"))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry || entry.contentType !== "book") return { title: "ไม่พบหนังสือ — ARCHRON" };
  return generatePageMetadata(entry);
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry || entry.contentType !== "book") notFound();

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
      <PageScaffold
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          { label: "คลังความรู้", href: "/knowledge" },
          { label: "หนังสือ", href: "/books" },
          { label: entry.title },
        ]}
        kicker="หนังสือ"
        title={entry.title}
        lead={entry.shortDescription}
        navCurrent="/books"
      >
        <ReadingPage entry={entry} section="books" />
      </PageScaffold>
    </>
  );
}
