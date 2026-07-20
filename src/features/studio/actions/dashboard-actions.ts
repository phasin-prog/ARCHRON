"use server";

import { getAuthedSupabase, getUserRole } from "@/lib/content/utils/server-auth";
import { invalidateRTK } from "@/lib/rtk/cache";

export async function listMyDraftsAction() {
  const { supabase, userId } = await getAuthedSupabase();
  if (!userId) return [];

  const { data } = await supabase
    .from("entries")
    .select("id, slug, title, status, updated_at")
    .eq("author_id", userId)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(50);

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
    .limit(50);

  return data ?? [];
}

export async function listAllPublishedEntriesAction() {
  const { supabase } = await getAuthedSupabase();

  const { data } = await supabase
    .from("entries")
    .select("id, slug, title, status, content_type, author_id, author_name, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(100);

  return data ?? [];
}

export async function deleteEntriesAction(
  ids: string[],
): Promise<{ ok: boolean; count: number; error?: string }> {
  if (ids.length === 0) return { ok: true, count: 0 };
  try {
    const { userId, supabase } = await getAuthedSupabase();
    const role = await getUserRole();
    let q = supabase.from("entries").delete().in("id", ids);
    if (role !== "admin") q = q.eq("author_id", userId);
    const { error, count } = await q;
    if (error) throw new Error(error.message);
    await invalidateRTK().catch(() => {});
    const { revalidateTag } = await import("next/cache");
    revalidateTag("entries", { expire: 0 });
    return { ok: true, count: count ?? ids.length };
  } catch (e) {
    return { ok: false, count: 0, error: e instanceof Error ? e.message : "ลบไม่สำเร็จ" };
  }
}

export async function archiveEntriesAction(
  ids: string[],
): Promise<{ ok: boolean; count: number; error?: string }> {
  if (ids.length === 0) return { ok: true, count: 0 };
  try {
    const { userId, supabase } = await getAuthedSupabase();
    const role = await getUserRole();
    let q = supabase.from("entries").update({ status: "archived" }).in("id", ids);
    if (role !== "admin") q = q.eq("author_id", userId);
    const { error, count } = await q;
    if (error) throw new Error(error.message);
    await invalidateRTK().catch(() => {});
    return { ok: true, count: count ?? ids.length };
  } catch (e) {
    return { ok: false, count: 0, error: e instanceof Error ? e.message : "เก็บถาวรไม่สำเร็จ" };
  }
}
