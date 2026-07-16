import type { NodeType } from "@/lib/content/core/registry";
import type { ContentEntry, ContentType } from "@/types/content";

type RouteableEntry = Pick<ContentEntry, "contentType" | "slug">;
type ArticleRouteEntry<T extends RouteableEntry> = Extract<T, { contentType: "article" }>;

const CONTENT_ROUTE_PREFIX: Record<ContentType, string> = {
  article: "/articles",
  book: "/books",
  concept: "/concepts",
  person: "/thinkers",
  "reading-set": "/reading-sets",
  "source-note": "/concepts",
  symbol: "/concepts",
  term: "/concepts",
};

const CONCEPT_ROUTE_CONTENT_TYPES = new Set<ContentType>([
  "concept",
  "source-note",
  "symbol",
  "term",
]);

// This record is application data for /guide, not a library article. Keeping it
// out of library surfaces also prevents its JSON payload from reaching Markdown.
const NON_LIBRARY_ENTRY_SLUGS = new Set(["guide-pricing"]);

export function isLibraryEntry(entry: Pick<ContentEntry, "slug">): boolean {
  return !NON_LIBRARY_ENTRY_SLUGS.has(entry.slug);
}

export function isArticleRouteEntry<T extends RouteableEntry>(
  entry: T,
): entry is ArticleRouteEntry<T> {
  return isLibraryEntry(entry) && entry.contentType === "article";
}

export function getLibraryArticles<T extends RouteableEntry>(
  entries: T[],
): ArticleRouteEntry<T>[] {
  return entries.filter(isArticleRouteEntry);
}

export function isConceptRouteEntry(entry: RouteableEntry): boolean {
  return isLibraryEntry(entry) && CONCEPT_ROUTE_CONTENT_TYPES.has(entry.contentType);
}

export function contentEntryHref(entry: RouteableEntry): string {
  if (!isLibraryEntry(entry)) return "/guide";
  return `${CONTENT_ROUTE_PREFIX[entry.contentType]}/${entry.slug}`;
}

export function registryNodeHref(nodeType: NodeType, slug: string): string {
  if (nodeType === "person") return `/thinkers/${slug}`;
  if (nodeType === "book") return `/books/${slug}`;
  return `/concepts/${slug}`;
}
