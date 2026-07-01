import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getChunkMeta } from "@/lib/rtk/search";
import { rtkCached, RTK_KEYS, RTK_TTL } from "@/lib/rtk/cache";
import { readFromR2 } from "@/lib/storage/read";

export const getChunkSchema = {
  id: z.string().describe("Chunk ID"),
};

export async function getChunkHandler(
  sb: SupabaseClient,
  args: { id: string },
) {
  const key = RTK_KEYS.chunk(args.id);

  return rtkCached(key, async () => {
    const meta = await getChunkMeta(sb, args.id);
    if (!meta) return null;

    const content = await readFromR2(meta.r2Key);
    return {
      ...meta,
      content,
      ...(content === null ? { error: "content_unavailable" as const } : {}),
    };
  }, RTK_TTL.chunk);
}
