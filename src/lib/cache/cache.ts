// Cache layer — wraps Upstash Redis for public content caching
// TTL ตรงกับ ISR revalidate (300s = 5 นาที)
// Graceful fallback: ถ้า Redis ไม่พร้อม → ข้าม cache ไปอ่าน DB โดยตรง

import { hasRedis, redisGet, redisSet, redisDel, redisDelPattern } from "./redis";

const DEFAULT_TTL = 300; // 5 นาที (ตรงกับ ISR revalidate)

const PREFIX = "archron:cache:";

// In-memory pending promises map — dedupe concurrent cache-miss fetches
// ป้องกัน thundering herd: เมื่อ N requests วิ่งเข้ามาพร้อมกันตอน cache miss
// ทุก request ที่ key เดียวกันจะแชร์ Promise <T> ตัวเดียวกัน
const pendingFetches = new Map<string, Promise<unknown>>();

// Cache keys
export const KEYS = {
  entries: `${PREFIX}entries:published`,
  entryBySlug: (slug: string) => `${PREFIX}entry:${slug}`,
  schools: `${PREFIX}schools:all`,
} as const;

// Get cached value or fetch from source
// T: type of cached value
export async function cached<T>(
  key: string,
  fetchFresh: () => Promise<T | null>,
  ttl: number = DEFAULT_TTL,
): Promise<T | null> {
  if (!hasRedis()) {
    return fetchFresh();
  }

  // Try cache first
  const cachedValue = await redisGet<T>(key);
  if (cachedValue !== null) {
    return cachedValue;
  }

  // Cache miss — check if another request is already fetching the same key
  const existing = pendingFetches.get(key) as Promise<T | null> | undefined;
  if (existing) {
    return existing;
  }

  // Fetch fresh, deduplicating concurrent requests
  const fetchPromise = fetchFresh()
    .then((fresh) => {
      if (fresh !== null) {
        // Fire-and-forget cache write (don't block response)
        redisSet(key, fresh, ttl).catch(() => {});
      }
      return fresh;
    })
    .finally(() => {
      pendingFetches.delete(key);
    });

  pendingFetches.set(key, fetchPromise);
  return fetchPromise;
}

// Invalidate specific cache keys
export async function invalidateEntry(slug: string): Promise<void> {
  if (!hasRedis()) return;

  await Promise.all([
    redisDel(KEYS.entries),
    redisDel(KEYS.entryBySlug(slug)),
    redisDel(KEYS.schools),
  ]);
}

// Invalidate all public caches (use after mass publish/update)
export async function invalidateAll(): Promise<number> {
  if (!hasRedis()) return 0;
  return redisDelPattern(`${PREFIX}*`);
}

// Get raw TTL helper for custom caching
export { hasRedis, DEFAULT_TTL };
