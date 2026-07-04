"use server";

import { getAuthedSupabase } from "@/lib/content/server-auth";

export async function listMyDraftsAction() {
  const { supabase, userId } = await getAuthedSupabase();
  if (!userId) return [];

  const { data } = await supabase
    .from("entries")
    .select("id, slug, title, status, updated_at")
    .eq("author_id", userId)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(20);

  return data ?? [];
}

export async function listMyEntriesAction() {
  const { supabase, userId } = await getAuthedSupabase();
  if (!userId) return [];

  const { data } = await supabase
    .from("entries")
    .select("id, slug, title, status, content_type, published_at")
    .eq("author_id", userId)
    .order("published_at", { ascending: false })
    .limit(20);

  return data ?? [];
}
