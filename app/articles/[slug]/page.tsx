import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { getEntryBySlug, allEntrySlugs } from "@/lib/content/entries";

// Dynamic route — pre-render slug ที่มีอยู่ และรองรับ slug ใหม่ตอน runtime
export const dynamicParams = true;

export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  return {
    title: entry
      ? `${entry.title} — The Soul's Compass`
      : "ไม่พบหน้า — The Soul's Compass",
  };
}

export default async function ArticleEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) {
    notFound();
  }
  return <ReadingPage entry={entry} />;
}
