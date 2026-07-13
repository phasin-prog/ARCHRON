import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReadingPage } from "@/components/reading/reading-page";
import { allEntrySlugs } from "@/lib/content/core/seeds/entries";
import { getPublicEntryBySlug } from "@/lib/content/publishing/public-source";

// Dynamic route — pre-render slug ที่มีอยู่ และรองรับ slug ใหม่ตอน runtime
export const dynamicParams = true;
// E8 — ISR: regenerate ทุก 5 นาที + on-demand revalidate จาก E7
export const revalidate = 300;

export function generateStaticParams() {
  return allEntrySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  return {
    title: entry
      ? `${entry.title} — ARCHRON`
      : "ไม่พบหน้า — ARCHRON",
  };
}

export default async function ArticleEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = await getPublicEntryBySlug(slug);
  if (!entry) {
    notFound();
  }
  return <ReadingPage entry={entry} section="articles" atmosphere="atmo-magazine" />;
}
