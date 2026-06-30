import type { ContentEntry } from "@/types/content";
import {
  entries as staticEntries,
  getEntryBySlug as getStaticEntryBySlug,
} from "@/lib/content/entries";
import {
  getPublishedEntries,
  getPublishedEntryBySlug,
} from "@/lib/content/entries-db";
import { cached, KEYS } from "@/lib/cache/cache";
import { SCHOOLS as staticSchools, type School } from "@/lib/content/schools";

// E8 — แหล่งข้อมูลหน้า public
// อ่านจาก Supabase (เฉพาะ status=published) + Upstash cache (300s TTL)
// → fallback ไป seed static เพื่อให้เว็บไม่ล่มและ build ผ่านแม้ยังไม่ได้ตั้ง Supabase

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function staticPublished(): ContentEntry[] {
  return staticEntries.filter((e) => e.status === "published");
}

export async function getPublicEntries(): Promise<ContentEntry[]> {
  if (hasSupabaseEnv()) {
    try {
      const cachedEntries = await cached(KEYS.entries, async () => {
        const fromDb = await getPublishedEntries();
        return fromDb.length > 0 ? fromDb : null;
      });
      if (cachedEntries) return cachedEntries;
    } catch {
      // DB เข้าถึงไม่ได้ — ใช้ static แทน
    }
  }
  return staticPublished();
}

export async function getPublicEntryBySlug(
  slug: string,
): Promise<ContentEntry | null> {
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
        const allEntries = await getPublicEntries();
        const dbSchools = allEntries.filter((e) => e.contentType === "school");
        const dbThinkers = allEntries.filter(
          (e) => e.contentType === "person"
        );

        if (dbSchools.length === 0) return null;

        return dbSchools.map((schoolEntry) => {
          const thinkers = dbThinkers
            .filter((t) => t.school === schoolEntry.slug)
            .map((t) => ({
              nameTh: t.title,
              nameEn: t.originalTerm ?? "",
              era: t.ipa ?? t.shortDescription ?? "",
              quote: t.visualExplanation ?? "",
              masterpieces: t.tags ?? [],
              bio: t.bodyMarkdown,
              relationships: t.technicalMeaning,
              r2ContentKey: t.r2ContentKey,
              r2ContentUrl: t.r2ContentUrl,
            }));

          return {
            id: schoolEntry.slug,
            nameTh: schoolEntry.title,
            nameEn: schoolEntry.originalTerm ?? "",
            field: schoolEntry.framework as any,
            description: schoolEntry.shortDescription,
            history: schoolEntry.bodyMarkdown,
            r2ContentKey: schoolEntry.r2ContentKey,
            r2ContentUrl: schoolEntry.r2ContentUrl,
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

// ดึงรายการเส้นทางการอ่าน (Reading Sets) ทั้งหมด
export async function getPublicReadingSets(): Promise<ContentEntry[]> {
  try {
    const all = await getPublicEntries();
    return all.filter((e) => e.contentType === "reading-set");
  } catch {
    return [];
  }
}

