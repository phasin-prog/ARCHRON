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
  return staticEntries.filter((e) => e.status === "published") as unknown as DiscriminatedEntry[];
}

export const getPublicEntries = cache(
  unstable_cache(
    async (contentType?: string): Promise<DiscriminatedEntry[]> => {
      if (hasSupabaseEnv()) {
        try {
          const fromDb = await getDbPublishedEntries(contentType);
          if (fromDb.length > 0) return fromDb;
        } catch {
          // DB เข้าถึงไม่ได้ — ใช้ static แทน
        }
      }
      return contentType
        ? staticPublished().filter((e) => e.contentType === contentType)
        : staticPublished();
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

// ดึงข้อมูลสำนักคิดและนักปราชญ์จากฐานข้อมูล (หรือ fallback ไปที่ static SCHOOLS)
export const getPublicSchools = cache(
  unstable_cache(
    async (): Promise<School[]> => {
      if (hasSupabaseEnv()) {
        try {
          const dbSchools = await getDbPublishedEntries("school");
          if (dbSchools.length === 0) return staticSchools;
          const dbThinkers = await getDbPublishedEntries("person");

          return dbSchools.map((schoolEntry) => {
            const se = schoolEntry as DiscriminatedEntry & { originalTerm?: string; framework?: string };
            const dbThinkersForSchool = dbThinkers
              .filter((t) => "school" in t && t.school === se.slug)
              .map((t) => {
                const te = t as DiscriminatedEntry & { originalTerm?: string; ipa?: string; visualExplanation?: string; bodyMarkdown?: string; technicalMeaning?: string; tags?: string[]; r2ContentKey?: string; r2ContentUrl?: string; notableWorks?: string[] };
                return {
                  nameTh: te.title,
                  nameEn: te.originalTerm ?? "",
                  era: te.ipa ?? te.shortDescription ?? "",
                  quote: te.visualExplanation ?? "",
                  masterpieces: te.tags ?? te.notableWorks ?? [],
                  bio: te.bodyMarkdown,
                  relationships: te.technicalMeaning,
                  r2ContentKey: te.r2ContentKey,
                  r2ContentUrl: te.r2ContentUrl,
                };
              });

            // merge static thinkers เป็น fallback เมื่อ DB ไม่มีนักคิดในสำนักนี้
            const staticSchool = staticSchools.find((ss) => ss.id === se.slug);
            const staticThinkers = staticSchool?.thinkers ?? [];
            const mergedThinkers = dbThinkersForSchool.length > 0
              ? dbThinkersForSchool
              : staticThinkers;

            return {
              id: se.slug,
              nameTh: se.title,
              nameEn: se.originalTerm ?? "",
              field: se.framework as unknown as School["field"],
              description: se.shortDescription,
              history: se.bodyMarkdown,
              r2ContentKey: se.r2ContentKey,
              r2ContentUrl: se.r2ContentUrl,
              thinkers: mergedThinkers,
            };
          });
        } catch {
          // ดึงฐานข้อมูลล้มเหลว
        }
      }
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
      if (hasSupabaseEnv()) {
        try {
          const dbSets = await getDbPublishedEntries("reading-set");
          if (dbSets.length > 0) return dbSets as ReadingSetItem[];
        } catch {
          // DB เข้าถึงไม่ได้
        }
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
          if (dbEntry !== null && dbEntry.contentType === "reading-set") {
            return dbEntry as ReadingSetItem;
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
export async function revalidateEntry(_slug: string) {
  const { revalidateTag } = await import("next/cache");
  revalidateTag("entries", "max");
}
