import { z } from "zod";
import { refreshLibrary } from "@/lib/rtk/ingest";

export const refreshLibrarySchema = {
  slug: z.string().optional().describe("Specific entry slug to reindex; omit to reindex all published entries"),
};

export async function refreshLibraryHandler(args: { slug?: string }) {
  return refreshLibrary(args.slug);
}
