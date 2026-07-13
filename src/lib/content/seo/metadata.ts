import type { Metadata } from "next";
import type { DiscriminatedEntry } from "@/types/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";
const SITE_NAME = "ARCHRON — คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์";

function descriptionFor(entry: DiscriminatedEntry): string {
  if (entry.contentType === "concept" || entry.contentType === "article") {
    return (entry as any).shortDescription || "";
  }
  if (entry.contentType === "person") {
    return (entry as any).shortDescription ?? `${(entry as any).mainTerm} — นักคิดในคลัง ARCHRON`;
  }
  if (entry.contentType === "book") {
    return (entry as any).shortDescription ?? `${entry.title} — หนังสือในคลัง ARCHRON`;
  }
  if (entry.contentType === "school") {
    return (entry as any).shortDescription ?? `สำนักคิด ${entry.title} — ARCHRON`;
  }
  return `"${entry.title}" ในคลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์ — ARCHRON`;
}

function slugFor(entry: DiscriminatedEntry): string {
  const type = entry.contentType;
  if (type === "reading-set") return `reading-sets/${entry.slug}`;
  if (type === "source-note") return `sources/${entry.slug}`;
  return `${type}s/${entry.slug}`;
}

export function generatePageMetadata(entry: DiscriminatedEntry): Metadata {
  const title = `${entry.title} — ARCHRON`;
  const description = descriptionFor(entry);
  const slug = slugFor(entry);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: entry.contentType === "book" ? "book" : "article",
      siteName: SITE_NAME,
      locale: "th_TH",
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(entry.title)}&type=${entry.contentType}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/api/og?title=${encodeURIComponent(entry.title)}&type=${entry.contentType}`],
    },
    alternates: { canonical: `${BASE_URL}/${slug}` },
  };
}
