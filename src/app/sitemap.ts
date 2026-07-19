// app/sitemap.ts — ARCHRON Phase 20: SEO Sitemap Architecture
import type { MetadataRoute } from "next";
import { getPublicEntries, getPublicReadingSets } from "@/lib/content/publishing/public-source";
import { THEMES } from "@/lib/content/core/seeds/themes";
import { isArticleRouteEntry, isConceptRouteEntry } from "@/lib/content/routing";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";

  const staticRoutes = [
    { route: "", priority: 1.0, freq: "daily" as const },
    { route: "/articles", priority: 0.9, freq: "weekly" as const },
    { route: "/concepts", priority: 0.9, freq: "weekly" as const },
    { route: "/books", priority: 0.8, freq: "weekly" as const },
    { route: "/thinkers", priority: 0.8, freq: "weekly" as const },
    { route: "/themes", priority: 0.8, freq: "weekly" as const },
    { route: "/reading-sets", priority: 0.8, freq: "weekly" as const },
    { route: "/constellation", priority: 0.7, freq: "weekly" as const },
    { route: "/explore", priority: 0.7, freq: "weekly" as const },
    { route: "/discover", priority: 0.7, freq: "weekly" as const },
    { route: "/compare", priority: 0.6, freq: "monthly" as const },
    { route: "/search", priority: 0.6, freq: "monthly" as const },
    { route: "/sources", priority: 0.7, freq: "weekly" as const },
    { route: "/external-links", priority: 0.6, freq: "monthly" as const },
    { route: "/timeline", priority: 0.6, freq: "monthly" as const },
    { route: "/faq", priority: 0.5, freq: "monthly" as const },
    { route: "/guide", priority: 0.6, freq: "monthly" as const },
    { route: "/manifesto", priority: 0.5, freq: "monthly" as const },
    { route: "/support", priority: 0.4, freq: "monthly" as const },
    { route: "/icons", priority: 0.3, freq: "monthly" as const },
    { route: "/knowledge", priority: 0.6, freq: "monthly" as const },
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // Published entries from DB (fallback static seed)
  const published = await getPublicEntries();

  // articles
  const articleRoutes = published
    .filter(isArticleRouteEntry)
    .map((e) => ({
      url: `${baseUrl}/articles/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // concepts (concept, source-note, symbol, term)
  const conceptRoutes = published
    .filter(isConceptRouteEntry)
    .map((e) => ({
      url: `${baseUrl}/concepts/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  // persons
  const thinkerRoutes = published
    .filter((e) => e.contentType === "person")
    .map((e) => ({
      url: `${baseUrl}/thinkers/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // books
  const bookRoutes = published
    .filter((e) => e.contentType === "book")
    .map((e) => ({
      url: `${baseUrl}/books/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // reading sets
  const readingSets = await getPublicReadingSets();
  const setRoutes = readingSets.map((r) => ({
    url: `${baseUrl}/reading-sets/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // themes (static only)
  const themeRoutes = THEMES.map((t) => ({
    url: `${baseUrl}/themes/${t.key}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...conceptRoutes,
    ...articleRoutes,
    ...thinkerRoutes,
    ...bookRoutes,
    ...setRoutes,
    ...themeRoutes,
  ];
}
