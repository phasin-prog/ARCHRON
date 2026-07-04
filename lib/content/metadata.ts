// lib/content/metadata.ts — ARCHRON Phase 12: Metadata System
// ผลิต Next.js 16 Metadata และ JSON-LD Structured Data ตามมาตรฐาน SEO & Semantic Web

import type { Metadata } from "next";
import type { ContentEntry } from "@/types/content";
import { classifyKnowledgeObject } from "@/lib/content/ontology";

const DEFAULT_BASE_URL = "https://archron.io";

// ผลิต Next.js 16 App Router Metadata สำหรับหน้าอ่าน
export function generateEntryMetadata(entry: ContentEntry, baseUrl = DEFAULT_BASE_URL): Metadata {
  const title = `${entry.title} | ARCHRON`;
  const description =
    entry.shortDescription ??
    entry.subtitle ??
    entry.visualExplanation ??
    `บทความและแนวคิดเชิงจิตวิทยาและปรัชญาเรื่อง ${entry.title} โดย ARCHRON`;

  const url = `${baseUrl}/articles/${entry.slug}`;
  const ogImage = entry.coverImage ?? `${baseUrl}/og-default.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "ARCHRON",
      locale: "th_TH",
      type: entry.contentType === "article" ? "article" : "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: entry.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ผลิต JSON-LD Structured Data (Schema.org) เพื่อเชื่อมโยง Search Engine สู่ Knowledge Graph
export function generateJSONLD(entry: ContentEntry, baseUrl = DEFAULT_BASE_URL): Record<string, unknown> {
  const objectClass = classifyKnowledgeObject(entry.contentType);
  const url = `${baseUrl}/articles/${entry.slug}`;

  const baseSchema = {
    "@context": "https://schema.org",
    url,
    name: entry.title,
    description: entry.shortDescription ?? entry.subtitle ?? `ข้อมูลเกี่ยวกับ ${entry.title}`,
  };

  if (objectClass === "concept") {
    return {
      ...baseSchema,
      "@type": "DefinedTerm",
      termCode: entry.slug,
      inDefinedTermSet: `${baseUrl}/concepts`,
    };
  }

  if (objectClass === "thinker") {
    return {
      ...baseSchema,
      "@type": "Person",
      jobTitle: "Philosopher / Psychologist",
    };
  }

  if (objectClass === "school") {
    return {
      ...baseSchema,
      "@type": "Organization",
      knowsAbout: entry.framework ?? "Psychology / Philosophy",
    };
  }

  return {
    ...baseSchema,
    "@type": "ScholarlyArticle",
    headline: entry.title,
    author: {
      "@type": "Person",
      name: entry.author ?? "ARCHRON Editorial Team",
    },
    datePublished: entry.publishedAt ?? new Date().toISOString(),
  };
}
