import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getRelatedLibs } from "@/lib/rtk/search";
import { rtkCached, RTK_KEYS, RTK_TTL } from "@/lib/rtk/cache";

export const getRelatedSchema = {
  slug: z.string().describe("Entry slug to find related documents for"),
  limit: z.number().int().min(1).max(8).optional().describe("Max results (default 5, max 8)"),
};

export async function getRelatedHandler(
  sb: SupabaseClient,
  args: { slug: string; limit?: number },
) {
  const limit = args.limit ?? 5;
  const key = RTK_KEYS.related(args.slug, limit);
  return rtkCached(key, () => getRelatedLibs(sb, args.slug, limit), RTK_TTL.related);
}
