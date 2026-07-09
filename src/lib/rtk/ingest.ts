// RTK ingestion — chunks published entries and upserts library + chunks
// Called by refreshLibrary() MCP tool and by publish/update hooks.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceSupabase } from "@/lib/supabase/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, getR2Bucket } from "@/lib/storage/r2-client";
import { readFromR2 } from "@/lib/storage/read";
import { chunkByHeading } from "./chunker";
import { estimateTokens } from "./tokens";
import { invalidateRTK } from "./cache";
import type { RawChunk, RefreshResult } from "./types";

// SHA-256 hash of text (Node crypto)
async function hashText(text: string): Promise<string> {
  const { createHash } = await import("node:crypto");
  return createHash("sha256").update(text, "utf-8").digest("hex");
}

// Write a chunk's markdown to R2, return the r2_key
async function writeChunkToR2(
  libraryId: string,
  chunkNo: number,
  markdown: string,
): Promise<string> {
  const key = `rtk/chunks/${libraryId}/${chunkNo}.md`;
  const client = getR2Client();
  const bucket = getR2Bucket();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(markdown, "utf-8"),
      ContentType: "text/markdown",
    }),
  );

  return key;
}

// Build a short summary from chunk markdown (first sentence or first 200 chars)
function summarize(markdown: string): string {
  const stripped = markdown.replace(/^#{1,6}\s+/m, "").trim();
  const firstSentence = stripped.split(/[.!\n]/)[0]?.trim() ?? "";
  if (firstSentence.length >= 20) return firstSentence.slice(0, 200);
  return stripped.slice(0, 200);
}

// Load published entries (one by slug, or all)
async function loadPublishedEntries(
  sb: SupabaseClient,
  slug?: string,
) {
  let query = sb
    .from("entries")
    .select(
      "id, slug, title, content_type, tags, author_name, short_description, body_markdown, r2_content_key",
    )
    .eq("status", "published");

  if (slug) {
    query = query.eq("slug", slug);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data as {
    id: string;
    slug: string;
    title: string;
    content_type: string;
    tags: string[] | null;
    author_name: string | null;
    short_description: string | null;
    body_markdown: string | null;
    r2_content_key: string | null;
  }[];
}

// Refresh (re-index) one entry or all published entries.
// Uses a service-role client by default (bypasses RLS for writes).
export async function refreshLibrary(
  slug?: string,
  sb?: SupabaseClient,
): Promise<RefreshResult> {
  const client = sb ?? createServiceSupabase();
  const entries = await loadPublishedEntries(client, slug);

  const result: RefreshResult = {
    reindexed: 0,
    chunks: 0,
    errors: [],
  };

  for (const entry of entries) {
    try {
      const body =
        entry.body_markdown ??
        (entry.r2_content_key ? await readFromR2(entry.r2_content_key) : null) ??
        "";

      const hash = await hashText(body);

      // Check if unchanged (skip if hash matches)
      const { data: existing } = await client
        .from("library")
        .select("id, hash")
        .eq("entry_id", entry.id)
        .maybeSingle();

      const existingLib = existing as { id: string; hash: string | null } | null;
      if (existingLib && existingLib.hash === hash) {
        continue; // no change
      }

      // Chunk the body
      const rawChunks: RawChunk[] = chunkByHeading(body);

      // Upsert library row
      const summary =
        entry.short_description ??
        (body ? summarize(body) : null);

      const { data: libData, error: libError } = await client
        .from("library")
        .upsert(
          {
            entry_id: entry.id,
            title: entry.title,
            slug: entry.slug,
            summary,
            category: entry.content_type,
            tags: entry.tags ?? [],
            language: "th",
            author: entry.author_name,
            hash,
            r2_key: entry.r2_content_key, // reuse entry's full-doc key if present
            indexed_at: new Date().toISOString(),
          },
          { onConflict: "entry_id" },
        )
        .select("id")
        .maybeSingle();

      if (libError || !libData) {
        result.errors.push({
          slug: entry.slug,
          reason: libError?.message ?? "library upsert failed",
        });
        continue;
      }

      const libraryId = (libData as { id: string }).id;

      // Delete old chunks for this library
      await client.from("chunks").delete().eq("library_id", libraryId);

      // Insert new chunks + write content to R2
      let totalTokens = 0;
      for (const raw of rawChunks) {
        const tokenCount = estimateTokens(raw.markdown);
        totalTokens += tokenCount;

        const r2Key = await writeChunkToR2(
          libraryId,
          raw.chunkNo,
          raw.markdown,
        );

        await client.from("chunks").insert({
          library_id: libraryId,
          chunk_no: raw.chunkNo,
          heading: raw.heading,
          summary: summarize(raw.markdown),
          token_count: tokenCount,
          r2_key: r2Key,
        });

        result.chunks++;
      }

      // Update token_count on library
      await client
        .from("library")
        .update({ token_count: totalTokens })
        .eq("id", libraryId);

      result.reindexed++;
    } catch (e) {
      result.errors.push({
        slug: entry.slug,
        reason: e instanceof Error ? e.message : "unknown error",
      });
    }
  }

  // Invalidate cache (single slug or all)
  await invalidateRTK(slug);

  return result;
}
