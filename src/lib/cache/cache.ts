// Cache layer — wraps Upstash Redis for public content caching
// TTL ตรงกับ ISR revalidate (300s = 5 นาที)
// Graceful fallback: ถ้า Redis ไม่พร้อม → ข้าม cache ไปอ่าน DB โดยตรง

import { hasRedis, redisGet, redisSet, redisDel, redisDelPattern } from "./redis";

const DEFAULT_TTL = 300; // 5 นาที (ตรงกับ ISR revalidate)

const PREFIX = "archron:cache:";

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
  const cached = await redisGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh
  const fresh = await fetchFresh();
  if (fresh !== null) {
    // Fire-and-forget cache write (don't block response)
    redisSet(key, fresh, ttl).catch(() => {});
  }

  return fresh;
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
