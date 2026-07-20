import type { DiscriminatedEntry } from "@/types/content";
import {
  entries as staticEntries,
  getEntryBySlug as getStaticEntryBySlug,
} from "@/lib/content/core/seeds/entries";
import {
  getPublishedEntries as getDbPublishedEntries,
  getPublishedEntryBySlug as getDbPublishedEntryBySlug,
} from "@/lib/content/publishing/entries-db";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { SCHOOLS as staticSchools, type School } from "@/lib/content/core/seeds/schools";
import {
  READING_SETS,
  getReadingSetBySlug as getStaticReadingSetBySlug,
  type ReadingSetItem,
} from "@/lib/content/core/seeds/reading-sets";

// E8 — แหล่งข้อมูลหน้า public
// อ่านจาก Supabase (เฉพาะ status=published) + layered cache:
//   - unstable_cache: cross-request data cache (300s TTL, revalidate by tag)
//   - React cache(): per-request deduplication
// → fallback ไป seed static เพื่อให้เว็บไม่ล่มและ build ผ่านแม้ยังไม่ได้ตั้ง Supabase

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function staticPublished(): DiscriminatedEntry[] {
  return (staticEntries.filter((e) => e.status === "published") as DiscriminatedEntry[]).sort(
    (a, b) => {
      const da = a.updatedAt ?? a.publishedAt ?? "";
      const db = b.updatedAt ?? b.publishedAt ?? "";
      return db.localeCompare(da);
    },
  );
}

export const getPublicEntries = cache(
  unstable_cache(
    async (contentType?: string): Promise<DiscriminatedEntry[]> => {
      const seed = contentType
        ? staticPublished().filter((e) => e.contentType === contentType)
        : staticPublished();

      if (!hasSupabaseEnv()) return seed;

      try {
        const fromDb = await getDbPublishedEntries(contentType);
        // Merge: DB entries override seed entries with the same slug,
        // seed entries that don't exist in DB are kept
        const dbSlugs = new Set(fromDb.map((e) => e.slug));
        const mergedSeed = seed.filter((e) => !dbSlugs.has(e.slug));
        return [...fromDb, ...mergedSeed];
      } catch {
        // DB เข้าถึงไม่ได้ — ใช้ static แทน
        return seed;
      }
    },
    ["public-entries"],
    { revalidate: 300, tags: ["entries"] },
  ),
);

export const getPublicEntryBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<DiscriminatedEntry | null> => {
      if (hasSupabaseEnv()) {
        try {
          const dbEntry = await getDbPublishedEntryBySlug(slug);
          if (dbEntry !== null) return dbEntry;
        } catch {
          // DB เข้าถึงไม่ได้ — fallback ไป static
        }
      }
      return getStaticEntryBySlug(slug) ?? null;
    },
    ["entry-by-slug"],
    { revalidate: 300, tags: ["entries"] },
  ),
);

// ดึงข้อมูลสำนักคิดและนักปราชญ์จาก static SCHOOLS seed
// (school content type ถูกปลดออกแล้ว — /thinkers ใช้ seed เท่านั้น)
export const getPublicSchools = cache(
  unstable_cache(
    async (): Promise<School[]> => {
      return staticSchools;
    },
    ["public-schools"],
    { revalidate: 300, tags: ["schools"] },
  ),
);

// ดึงรายการเส้นทางการอ่าน (Reading Sets) ทั้งหมด
export const getPublicReadingSets = cache(
  unstable_cache(
    async (): Promise<ReadingSetItem[]> => {
      if (!hasSupabaseEnv()) return READING_SETS;

      try {
        const dbSets = await getDbPublishedEntries("reading-set");
        const validDbSets = dbSets.filter(
          (e) => "steps" in e && Array.isArray((e as { steps?: unknown }).steps),
        ) as ReadingSetItem[];
        if (validDbSets.length > 0) {
          const dbSlugs = new Set(validDbSets.map((e) => e.slug));
          const mergedSeed = READING_SETS.filter((e) => !dbSlugs.has(e.slug));
          return [...validDbSets, ...mergedSeed];
        }
      } catch {
        // DB เข้าถึงไม่ได้
      }
      return READING_SETS;
    },
    ["public-reading-sets"],
    { revalidate: 300, tags: ["reading-sets"] },
  ),
);

// ดึงข้อมูลเส้นทางการอ่านตาม slug
export const getPublicReadingSetBySlug = cache(
  unstable_cache(
    async (slug: string): Promise<ReadingSetItem | null> => {
      if (hasSupabaseEnv()) {
        try {
          const dbEntry = await getDbPublishedEntryBySlug(slug);
          if (dbEntry !== null && dbEntry.contentType === "reading-set" && "steps" in dbEntry) {
            return dbEntry as unknown as ReadingSetItem;
          }
        } catch {
          // DB เข้าถึงไม่ได้ — fallback ไป static
        }
      }
      return getStaticReadingSetBySlug(slug) ?? null;
    },
    ["reading-set-by-slug"],
    { revalidate: 300, tags: ["reading-sets"] },
  ),
);

// เรียกหลัง publish เพื่อ invalidate data cache
export async function revalidateEntry(slug: string) {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("entries", { expire: 0 });
  revalidateTag(`entry-${slug}`, { expire: 0 });
}
