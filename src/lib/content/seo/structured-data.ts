import type { DiscriminatedEntry } from "@/types/content";
import {
  isArticle, isPerson, isBook, isSchool,
} from "@/types/content";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";

export interface BreadcrumbItem { name: string; href: string; }

export function breadcrumbLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  };
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ARCHRON",
    url: BASE_URL,
    description: "คลังความรู้ภาษาไทยเรื่องจิตใจมนุษย์",
    inLanguage: "th",
  };
}

export function articleLd(entry: DiscriminatedEntry) {
  const desc = isArticle(entry) ? entry.shortDescription : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: entry.title,
    description: desc ?? undefined,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    author: entry.author ? { "@type": "Person", name: entry.author } : undefined,
    inLanguage: "th",
    isAccessibleForFree: true,
  };
}

export function personLd(entry: DiscriminatedEntry) {
  if (!isPerson(entry)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: entry.mainTerm,
    alternateName: entry.thaiName,
    birthDate: entry.bornYear,
    deathDate: entry.diedYear,
    nationality: entry.nationality,
    knowsAbout: entry.keyIdeas,
  };
}

export function bookLd(entry: DiscriminatedEntry) {
  if (!isBook(entry)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    name: entry.title,
    author: entry.author ? { "@type": "Person", name: entry.author } : undefined,
    isbn: entry.isbn,
    publisher: entry.publisher,
    datePublished: entry.publicationYear,
    inLanguage: "th",
  };
}

export function schoolLd(entry: DiscriminatedEntry) {
  if (!isSchool(entry)) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: entry.title,
    alternateName: entry.thaiName,
    foundingDate: entry.period,
    founder: entry.founder ? { "@type": "Person", name: entry.founder } : undefined,
  };
}
