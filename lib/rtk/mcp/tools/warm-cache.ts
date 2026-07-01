import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getRecentLibs, getLibraryMeta } from "@/lib/rtk/search";
import { RTK_KEYS, RTK_TTL } from "@/lib/rtk/cache";
import { hasRedis, redisSet } from "@/lib/cache/redis";

export const warmCacheSchema = {
  slugs: z.array(z.string()).optional().describe("Specific slugs to warm; omit to warm recent 10"),
};

export async function warmCacheHandler(
  sb: SupabaseClient,
  args: { slugs?: string[] },
) {
  if (!hasRedis()) return { warmed: 0 };

  let warmed = 0;
  const slugs = args.slugs ?? (await getRecentLibs(sb, 10)).map((l) => l.slug);

  for (const slug of slugs) {
    const lib = await getLibraryMeta(sb, slug);
    if (lib) {
      await redisSet(RTK_KEYS.lib(slug), lib, RTK_TTL.lib);
      warmed++;
    }
  }

  return { warmed };
}
