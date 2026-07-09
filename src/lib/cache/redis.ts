// Upstash Redis — REST API client (no package needed)
// Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

function getConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url: url.replace(/\/$/, ""), token };
}

// ตรวจว่ามี Redis env พร้อมใช้งาน
export function hasRedis(): boolean {
  return getConfig() !== null;
}

async function redisCommand<T>(
  command: string,
  ...args: (string | number)[]
): Promise<T | null> {
  const cfg = getConfig();
  if (!cfg) return null;

  const url = cfg.url;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([command, ...args]),
      // Next.js fetch cache — disable for Redis commands
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.result as T;
  } catch {
    return null;
  }
}

// GET key → parsed JSON value, or null
export async function redisGet<T = unknown>(key: string): Promise<T | null> {
  const raw = await redisCommand<string>("get", key);
  if (raw === null || raw === undefined) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

// SET key with optional TTL (seconds)
export async function redisSet(
  key: string,
  value: unknown,
  ttlSeconds?: number,
): Promise<boolean> {
  const raw = JSON.stringify(value);
  const args: (string | number)[] = [key, raw];
  if (ttlSeconds && ttlSeconds > 0) {
    args.push("EX", ttlSeconds);
  }
  const result = await redisCommand<string>("set", ...args);
  return result === "OK";
}

// DELETE key
export async function redisDel(key: string): Promise<boolean> {
  const result = await redisCommand<number>("del", key);
  return result === 1;
}

// DELETE by pattern (scan + del) — ลบ cache หลาย key ที่ match pattern
export async function redisDelPattern(pattern: string): Promise<number> {
  const cfg = getConfig();
  if (!cfg) return 0;

  let deleted = 0;

  try {
    const keys = await redisCommand<string[]>("keys", pattern) ?? [];

    // Delete in batches
    for (const key of keys) {
      const ok = await redisDel(key);
      if (ok) deleted++;
    }
  } catch {
    // Redis ไม่พร้อม — ไม่เป็นไร
  }

  return deleted;
}
