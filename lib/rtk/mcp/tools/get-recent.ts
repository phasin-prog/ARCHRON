import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getRecentLibs } from "@/lib/rtk/search";
import { rtkCached, RTK_KEYS, RTK_TTL } from "@/lib/rtk/cache";

export const getRecentSchema = {
  limit: z.number().int().min(1).max(8).optional().describe("Max results (default 5, max 8)"),
};

export async function getRecentHandler(
  sb: SupabaseClient,
  args: { limit?: number },
) {
  const limit = args.limit ?? 5;
  const key = RTK_KEYS.recent(limit);
  return rtkCached(key, () => getRecentLibs(sb, limit), RTK_TTL.recent);
}
