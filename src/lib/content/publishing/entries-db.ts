import type { SupabaseClient } from "@supabase/supabase-js";
import type { DiscriminatedEntry } from "@/types/content";
import type { Role } from "@/lib/content/utils/roles";
import { createServerSupabase } from "@/lib/supabase/server";
import { rowToEntry, type EntryRow } from "./entry-mapper";
import { refreshLibrary } from "@/lib/rtk/ingest";
import { invalidateRTK } from "@/lib/rtk/cache";

// ============ Public reads (server, anon) ============
// ใช้แทน static entries.ts ใน E8 (ตอนนี้พร้อมใช้ ยังไม่สลับ)

export async function getPublishedEntries(contentType?: string): Promise<DiscriminatedEntry[]> {
  const sb = createServerSupabase();
  let query = sb
    .from("entries")
    .select("id, slug, title, status, content_type, author_id, author_name, main_term, thai_name, original_term, part_of_speech, language_root, ipa, short_description, subtitle, series, volume, aliases, born_year, died_year, nationality, key_ideas, notable_works, publication_year, publisher, isbn, founder, period, framework, main_thinkers, school, difficulty, tags, visual_explanation, technical_meaning, real_world_examples, body_markdown, cover_image, roots, related_concepts, source_refs, related_cta, created_at, updated_at, published_at, r2_content_key, r2_content_url, row_id, row_i, row_code, row_name")
    .eq("status", "published");
  if (contentType) {
    query = query.eq("content_type", contentType);
  }
  const { data, error } = await query.order("published_at", { ascending: false });
  if (error || !data) return [];
  return (data as EntryRow[]).map(rowToEntry);
}

export async function getPublishedEntryBySlug(
  slug: string,
): Promise<DiscriminatedEntry | null> {
  const sb = createServerSupabase();
  const { data, error } = await sb
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error || !data) return null;
  return rowToEntry(data as EntryRow);
}

export async function getPublishedSlugs(): Promise<string[]> {
  const sb = createServerSupabase();
  const { data } = await sb.from("entries").select("slug").eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}

// ============ Authed (studio) — รับ client ที่แนบ Clerk token ============
// RLS บังคับ ownership: ผู้ใช้เห็น/แก้/ลบได้เฉพาะของตน

export async function listMyEntries(
  sb: SupabaseClient,
  authorId: string,
  role?: Role,
): Promise<DiscriminatedEntry[]> {
  let query = sb.from("entries").select("*");
  if (role !== "admin") {
    query = query.eq("author_id", authorId);
  }
  const { data } = await query.order("updated_at", { ascending: false });
  return ((data ?? []) as EntryRow[]).map(rowToEntry);
}

export async function getMyEntryBySlug(
  sb: SupabaseClient,
  slug: string,
): Promise<DiscriminatedEntry | null> {
  const { data, error } = await sb
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return rowToEntry(data as EntryRow);
}

// upsert แถว (E3 จะแปลง EditorDraft → EntryRow ก่อนเรียก)
export async function upsertEntryRow(
  sb: SupabaseClient,
  row: Partial<EntryRow> & { slug: string; title: string; author_id: string },
) {
  const result = await sb
    .from("entries")
    .upsert(row, { onConflict: "id" })
    .select()
    .maybeSingle();

  // Fire-and-forget: if this is a published entry, reindex into RTK
  if (row.status === "published") {
    refreshLibrary(row.slug).catch((e) => {
      console.error(`[RTK_REFRESH_ERROR] slug=${row.slug}:`, e);
    });
  }

  return result;
}

export async function deleteEntry(sb: SupabaseClient, id: string) {
  const result = await sb.from("entries").delete().eq("id", id);

  // Invalidate RTK cache — FK cascade removes library + chunks rows
  invalidateRTK().catch(() => {});

  return result;
}

// ============ Revisions (version history — ใช้ใน E6) ============

export async function addRevision(
  sb: SupabaseClient,
  entryId: string,
  snapshot: unknown,
  createdBy: string,
  note?: string,
) {
  return sb.from("entry_revisions").insert({
    entry_id: entryId,
    snapshot,
    created_by: createdBy,
    note: note ?? null,
  });
}

export async function getRevisions(sb: SupabaseClient, entryId: string) {
  const { data } = await sb
    .from("entry_revisions")
    .select("*")
    .eq("entry_id", entryId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
