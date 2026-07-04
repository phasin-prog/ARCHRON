import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageScaffold } from "@/components/page-scaffold";
import { getPublicEntryBySlug } from "@/lib/content/public-source";
import { ReadingPage } from "@/components/reading/reading-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;
export const revalidate = 300;

export async function generateStaticParams() {
  const { allEntrySlugs } = await import("@/lib/content/entries");
  return allEntrySlugs()
    .filter((slug) => slug.startsWith("book-"))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry || entry.contentType !== "book") return { title: "ไม่พบหนังสือ — ARCHRON" };
  return {
    title: `${entry.title} — ARCHRON`,
    description: entry.shortDescription || `ข้อมูลหนังสือ ${entry.title}`,
  };
}

export default async function BookDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry || entry.contentType !== "book") notFound();

  return (
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
  );
}
