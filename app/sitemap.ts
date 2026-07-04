// app/sitemap.ts — ARCHRON Phase 20: SEO Sitemap Architecture
import type { MetadataRoute } from "next";
import { conceptRegistry } from "@/lib/content/concept-registry";
import { READING_SETS } from "@/lib/content/reading-sets";
import { SCHOOLS } from "@/lib/content/schools";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://archron.org";

  const staticRoutes = [
    "",
    "/articles",
    "/concepts",
    "/constellation",
    "/external-links",
    "/schools",
    "/thinkers",
    "/faq",
    "/guide",
    "/manifesto",
    "/reading-sets",
    "/search",
    "/sources",
    "/support",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("daily" as const) : ("weekly" as const),
    priority: route === "" ? 1.0 : 0.8,
  }));

  const conceptRoutes = conceptRegistry.map((c) => ({
    url: `${baseUrl}/concepts/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const schoolRoutes = SCHOOLS.map((s) => ({
    url: `${baseUrl}/schools/${s.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const thinkerRoutes = SCHOOLS.flatMap((s) => s.thinkers).map((thinker: { nameEn: string }) => ({
    url: `${baseUrl}/thinkers/${thinker.nameEn.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const setRoutes = READING_SETS.map((r) => ({
    url: `${baseUrl}/reading-sets/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...conceptRoutes, ...schoolRoutes, ...thinkerRoutes, ...setRoutes];
}
