// ARCHRON — ความคิดเห็นท้ายบทความ/แนวคิด ผ่าน Supabase (RLS: คอมเมนต์ได้เมื่อล็อกอิน, แก้/ลบเฉพาะของตน)
import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export type Comment = {
  id: string;
  section: string;
  slug: string;
  clerk_user_id: string;
  author_name: string | null;
  body: string;
  created_at: string;
};

export type CommentInput = {
  section: string;
  slug: string;
  userId: string;
  authorName: string | null;
  body: string;
};

// คืน null = ดึงไม่ได้ (เช่น ตารางยังไม่ถูกสร้าง) → UI ซ่อนได้อย่างนุ่มนวล
export async function listComments(
  supabase: SupabaseClient,
  section: string,
  slug: string,
): Promise<Comment[] | null> {
  const { data, error } = await supabase
    .from("comments")
    .select("id, section, slug, clerk_user_id, author_name, body, created_at")
    .eq("section", section)
    .eq("slug", slug)
    .eq("status", "visible")
    .order("created_at", { ascending: true });
  if (error) return null;
  return (data as Comment[]) ?? [];
}

export async function addComment(
  supabase: SupabaseClient,
  input: CommentInput,
): Promise<{ error: { message: string } | null }> {
  const body = input.body.trim();
  if (!body) return { error: { message: "ยังไม่ได้พิมพ์ข้อความ" } };
  const { error } = await supabase.from("comments").insert({
    id: randomUUID(),
    section: input.section,
    slug: input.slug,
    clerk_user_id: input.userId,
    author_name: input.authorName?.trim() || null,
    body,
  });
  return { error: error ? { message: error.message } : null };
}

export async function deleteComment(
  supabase: SupabaseClient,
  id: string,
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  return { error: error ? { message: error.message } : null };
}
