import {
  hasRedis,
  redisGet,
  redisSet,
  redisDel,
  redisDelPattern,
} from "@/lib/cache/redis";

const SEARCH_TTL = 300;

export const SEARCH_CACHE_KEYS = {
  index: "archron:cache:search:index",
  query: (q: string, filters: string) => `archron:cache:search:q:${q}:${filters}`,
} as const;

export async function cachedSearch<T>(
  key: string,
  fetchFresh: () => Promise<T | null>,
  ttl: number = SEARCH_TTL,
): Promise<T | null> {
  if (!hasRedis()) return fetchFresh();

  const cached = await redisGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetchFresh();
  if (fresh !== null) {
    redisSet(key, fresh, ttl).catch(() => {});
  }
  return fresh;
}

export async function invalidateSearchCache(): Promise<void> {
  if (!hasRedis()) return;
  await redisDel(SEARCH_CACHE_KEYS.index);
  await redisDelPattern("archron:cache:search:q:*");
}
