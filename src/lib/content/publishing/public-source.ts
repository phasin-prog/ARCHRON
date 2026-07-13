import type { DiscriminatedEntry } from "@/types/content";
import {
  entries as staticEntries,
  getEntryBySlug as getStaticEntryBySlug,
} from "@/lib/content/core/seeds/entries";
import {
  getPublishedEntries,
  getPublishedEntryBySlug,
} from "@/lib/content/publishing/entries-db";
import { cached, KEYS } from "@/lib/cache/cache";
import { SCHOOLS as staticSchools, type School } from "@/lib/content/core/seeds/schools";

// E8 — แหล่งข้อมูลหน้า public
// อ่านจาก Supabase (เฉพาะ status=published) + Upstash cache (300s TTL)
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

export async function getPublicEntries(contentType?: string): Promise<DiscriminatedEntry[]> {
  const cacheKey = contentType ? `${KEYS.entries}:${contentType}` : KEYS.entries;
  if (hasSupabaseEnv()) {
    try {
      const cachedEntries = await cached(cacheKey, async () => {
        const fromDb = await getPublishedEntries(contentType);
        return fromDb.length > 0 ? fromDb : null;
      });
      if (cachedEntries) return cachedEntries;
    } catch {
      // DB เข้าถึงไม่ได้ — ใช้ static แทน
    }
  }
  return contentType
    ? staticPublished().filter((e) => e.contentType === contentType)
    : staticPublished();
}

export async function getPublicEntryBySlug(
  slug: string,
): Promise<DiscriminatedEntry | null> {
  if (hasSupabaseEnv()) {
    try {
      const dbEntry = await cached(KEYS.entryBySlug(slug), async () => {
        return getPublishedEntryBySlug(slug);
      });
      if (dbEntry !== null) {
        return dbEntry;
      }
    } catch {
      // DB เข้าถึงไม่ได้ — fallback ไป static
    }
  }
  return getStaticEntryBySlug(slug) ?? null;
}

// ดึงข้อมูลสำนักคิดและนักปราชญ์จากฐานข้อมูล (หรือ fallback ไปที่ static SCHOOLS)
export async function getPublicSchools(): Promise<School[]> {
  if (hasSupabaseEnv()) {
    try {
      const cachedSchools = await cached(KEYS.schools, async () => {
        const dbSchools = await getPublishedEntries("school");
        if (dbSchools.length === 0) return null;

        const dbThinkers = await getPublishedEntries("person");

        return dbSchools.map((schoolEntry) => {
          const se = schoolEntry as DiscriminatedEntry & { originalTerm?: string; framework?: string };
          const thinkers = dbThinkers
            .filter((t) => "school" in t && t.school === se.slug)
            .map((t) => {
              const te = t as DiscriminatedEntry & { originalTerm?: string; ipa?: string; visualExplanation?: string; bodyMarkdown?: string; technicalMeaning?: string; tags?: string[]; r2ContentKey?: string; r2ContentUrl?: string };
              return {
                nameTh: te.title,
                nameEn: te.originalTerm ?? "",
                era: te.ipa ?? te.shortDescription ?? "",
                quote: te.visualExplanation ?? "",
                masterpieces: te.tags ?? [],
                bio: te.bodyMarkdown,
                relationships: te.technicalMeaning,
                r2ContentKey: te.r2ContentKey,
                r2ContentUrl: te.r2ContentUrl,
              };
            });

          return {
            id: se.slug,
            nameTh: se.title,
            nameEn: se.originalTerm ?? "",
            field: se.framework as unknown as School["field"],
            description: se.shortDescription,
            history: se.bodyMarkdown,
            r2ContentKey: se.r2ContentKey,
            r2ContentUrl: se.r2ContentUrl,
            thinkers,
          };
        });
      });

      if (cachedSchools) return cachedSchools;
    } catch {
      // ดึงฐานข้อมูลล้มเหลว
    }
  }
  return staticSchools;
}

import {
  READING_SETS,
  getReadingSetBySlug as getStaticReadingSetBySlug,
  type ReadingSetItem,
} from "@/lib/content/core/seeds/reading-sets";

// ดึงรายการเส้นทางการอ่าน (Reading Sets) ทั้งหมด
export async function getPublicReadingSets(): Promise<ReadingSetItem[]> {
  if (hasSupabaseEnv()) {
    try {
      const dbSets = await getPublicEntries("reading-set");
      if (dbSets.length > 0) return dbSets as ReadingSetItem[];
    } catch {
      // DB เข้าถึงไม่ได้
    }
  }
  return READING_SETS;
}

// ดึงข้อมูลเส้นทางการอ่านตาม slug
export async function getPublicReadingSetBySlug(
  slug: string,
): Promise<ReadingSetItem | null> {
  if (hasSupabaseEnv()) {
    try {
      const dbEntry = await cached(`${KEYS.entryBySlug}:rs:${slug}`, async () => {
        return getPublishedEntryBySlug(slug);
      });
      if (dbEntry !== null && dbEntry.contentType === "reading-set") {
        return dbEntry as ReadingSetItem;
      }
    } catch {
      // DB เข้าถึงไม่ได้ — fallback ไป static
    }
  }
  return getStaticReadingSetBySlug(slug) ?? null;
}

