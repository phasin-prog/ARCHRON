// ARCHRON — ตัวนับผู้เยี่ยมชม (Page Views) ต่อ slug + ยอดรวม
// เพิ่มยอดผ่าน RPC increment_page_view (SECURITY DEFINER) · คืน null เมื่อผิดพลาด → UI ซ่อนได้
import type { SupabaseClient } from "@supabase/supabase-js";

export async function incrementPageView(
  supabase: SupabaseClient,
  slug: string,
): Promise<number | null> {
  const { data, error } = await supabase.rpc("increment_page_view", { p_slug: slug });
  if (error) return null;
  return typeof data === "number" ? data : data == null ? null : Number(data);
}

export async function getPageView(
  supabase: SupabaseClient,
  slug: string,
): Promise<number | null> {
  const { data, error } = await supabase
    .from("page_views")
    .select("views")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return data ? Number((data as { views: number }).views) : 0;
}

export async function getTotalPageViews(supabase: SupabaseClient): Promise<number | null> {
  const { data, error } = await supabase.rpc("total_page_views");
  if (error) return null;
  return data == null ? 0 : Number(data);
}
