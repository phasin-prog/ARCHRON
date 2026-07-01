import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { searchLibrary } from "@/lib/rtk/search";
import { rtkCached, RTK_KEYS, RTK_TTL } from "@/lib/rtk/cache";

export const searchLibrarySchema = {
  q: z.string().describe("Search query (matched against title, slug, tags, summary)"),
  limit: z.number().int().min(1).max(8).optional().describe("Max results (default 5, max 8)"),
};

export async function searchLibraryHandler(
  sb: SupabaseClient,
  args: { q: string; limit?: number },
) {
  const limit = args.limit ?? 5;
  const key = RTK_KEYS.searchLib(args.q, limit);
  return rtkCached(key, () => searchLibrary(sb, args.q, limit), RTK_TTL.search);
}
