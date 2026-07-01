// RTK cache layer — wraps Upstash Redis under the "rtk:" namespace
// Separate from archron:cache: to isolate RTK keys.

import {
  hasRedis,
  redisGet,
  redisSet,
  redisDel,
  redisDelPattern,
} from "@/lib/cache/redis";

const TTL_SEARCH = 300; // 5 min
const TTL_LIB = 300; // 5 min
const TTL_CHUNK = 600; // 10 min (content stable by hash)
const TTL_RECENT = 120; // 2 min
const TTL_RELATED = 300; // 5 min

// Cache key builders
export const RTK_KEYS = {
  searchLib: (q: string, limit: number) => `rtk:search:lib:${q}:${limit}`,
  searchChunk: (q: string, limit: number) => `rtk:search:chunk:${q}:${limit}`,
  lib: (slug: string) => `rtk:lib:${slug}`,
  chunk: (id: string) => `rtk:chunk:${id}`,
  recent: (limit: number) => `rtk:recent:${limit}`,
  related: (slug: string, limit: number) => `rtk:related:${slug}:${limit}`,
} as const;

export const RTK_TTL = {
  search: TTL_SEARCH,
  lib: TTL_LIB,
  chunk: TTL_CHUNK,
  recent: TTL_RECENT,
  related: TTL_RELATED,
} as const;

// Get cached value or fetch fresh (mirrors lib/cache/cache.ts pattern)
export async function rtkCached<T>(
  key: string,
  fetchFresh: () => Promise<T | null>,
  ttl: number,
): Promise<T | null> {
  if (!hasRedis()) {
    return fetchFresh();
  }

  const cached = await redisGet<T>(key);
  if (cached !== null) {
    return cached;
  }

  const fresh = await fetchFresh();
  if (fresh !== null) {
    // Fire-and-forget cache write
    redisSet(key, fresh, ttl).catch(() => {});
  }

  return fresh;
}

// Invalidate RTK cache for a single entry (slug given) or everything (no arg)
export async function invalidateRTK(slug?: string): Promise<void> {
  if (!hasRedis()) return;

  if (!slug) {
    // Full reindex — wipe everything
    await redisDelPattern("rtk:*");
    return;
  }

  // Single-entry refresh
  await Promise.all([
    redisDel(RTK_KEYS.lib(slug)),
    redisDelPattern("rtk:search:*"),
    redisDelPattern("rtk:recent:*"),
    // related keys have varying limits — pattern delete for this slug
    redisDelPattern(`rtk:related:${slug}:*`),
  ]);
}
