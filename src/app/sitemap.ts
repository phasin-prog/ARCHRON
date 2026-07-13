// app/sitemap.ts — ARCHRON Phase 20: SEO Sitemap Architecture
import type { MetadataRoute } from "next";
import { conceptRegistry } from "@/lib/content/core/registry";
import { READING_SETS } from "@/lib/content/core/seeds/reading-sets";
import { entries } from "@/lib/content/core/seeds/entries";
import { THEMES } from "@/lib/content/core/seeds/themes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
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
    { route: "/knowledge", priority: 0.6, freq: "monthly" as const },
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  // concept nodes (registry)
  const conceptRoutes = conceptRegistry.map((c) => ({
    url: `${baseUrl}/concepts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // content entries: articles + person entries (concept entries already in conceptRegistry)
  const publishedEntries = entries.filter((e) => e.status === "published");

  const articleRoutes = publishedEntries
    .filter((e) => e.contentType === "article")
    .map((e) => ({
      url: `${baseUrl}/articles/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const personRoutes = publishedEntries
    .filter((e) => e.contentType === "person")
    .map((e) => ({
      url: `${baseUrl}/concepts/${e.slug}`,
      lastModified: new Date(e.updatedAt ?? e.publishedAt ?? ""),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const thinkerRoutes = conceptRegistry
    .filter((c) => c.nodeType === "person")
    .map((c) => ({
      url: `${baseUrl}/thinkers/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  // reading sets
  const setRoutes = READING_SETS.map((r) => ({
    url: `${baseUrl}/reading-sets/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // themes
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
    ...personRoutes,
    ...thinkerRoutes,
    ...setRoutes,
    ...themeRoutes,
  ];
}
