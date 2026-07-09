import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getLibraryMeta } from "@/lib/rtk/search";
import { rtkCached, RTK_KEYS, RTK_TTL } from "@/lib/rtk/cache";

export const getLibrarySchema = {
  slug: z.string().describe("Entry slug"),
};

export async function getLibraryHandler(
  sb: SupabaseClient,
  args: { slug: string },
) {
  const key = RTK_KEYS.lib(args.slug);
  return rtkCached(key, () => getLibraryMeta(sb, args.slug), RTK_TTL.lib);
}
