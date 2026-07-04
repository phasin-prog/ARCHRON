"use server";

import { revalidatePath } from "next/cache";
import { getAuthedSupabase, getUserRole } from "@/lib/content/server-auth";
import { saveDraft as saveDraftDb, loadDraftBySlug, publishEntry } from "@/lib/content/draft-db";
import { addRevision, getRevisions } from "@/lib/content/entries-db";
import type { EditorDraft } from "@/lib/content/publish-validation";
import { invalidateEntry } from "@/lib/cache/cache";

// E7 — revalidate public pages after publish
export async function revalidatePublic(slug: string) {
  revalidatePath("/articles");
  revalidatePath("/concepts");
  if (slug && slug.trim() !== "") {
    revalidatePath(`/articles/${slug}`);
    revalidatePath(`/concepts/${slug}`);
  }
}

// Save draft (autosave + manual save)
export async function saveDraftAction(draft: EditorDraft) {
  const { userId, supabase } = await getAuthedSupabase();
  const role = await getUserRole();
  const { data, error } = await saveDraftDb(supabase, userId, draft, role);
  if (error) return { error: error.message };
  return { data };
}

// Save draft + create revision snapshot
export async function saveDraftWithRevisionAction(draft: EditorDraft) {
  const { userId, supabase } = await getAuthedSupabase();
  const role = await getUserRole();
  const { data, error } = await saveDraftDb(supabase, userId, draft, role);
  if (error) return { error: error.message };
  const row = data as { id?: string } | null;
  const id = row?.id;
  if (id) {
    await addRevision(supabase, id, draft, userId, "บันทึกด้วยตนเอง");
  }
  return { data };
}

// Load draft by slug + return author_id for admin ownership display
export async function loadDraftAction(slug: string) {
  const { supabase } = await getAuthedSupabase();
  const draft = await loadDraftBySlug(supabase, slug);
  // Fetch author_id for ownership display
  const { data } = await supabase
    .from("entries")
    .select("author_id, author_name")
    .eq("slug", slug)
    .maybeSingle();
  const authorId = (data as { author_id?: string } | null)?.author_id ?? null;
  const authorName = (data as { author_name?: string } | null)?.author_name ?? null;
  return { draft, authorId, authorName };
}

// Publish entry
export async function publishAction(draft: EditorDraft) {
  const { userId, supabase } = await getAuthedSupabase();
  const role = await getUserRole();
  const { data, error } = await publishEntry(supabase, userId, draft, role);
  if (error) return { error: error.message };
  const row = data as { id?: string } | null;
  const id = row?.id;
  if (id) {
    await addRevision(supabase, id, { ...draft, status: "published" }, userId, "เผยแพร่");
  }
  // Invalidate Upstash cache
  await invalidateEntry(draft.slug);
  // Revalidate public pages
  await revalidatePublic(draft.slug);
  return { data };
}

// Load revisions
export async function loadRevisionsAction(entryId: string) {
  const { supabase } = await getAuthedSupabase();
  const revisions = await getRevisions(supabase, entryId);
  return { revisions };
}

// List current user's entries (for MyContentSearch sidebar)
// admin สามารถเห็น entry ทั้งหมดได้
export async function listMyEntriesAction() {
  const { userId, supabase } = await getAuthedSupabase();
  const role = await getUserRole();
  const entries = await import("@/lib/content/entries-db").then((m) =>
    m.listMyEntries(supabase, userId, role),
  );
  return { entries };
}
