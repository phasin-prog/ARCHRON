"use server";

import { auth } from "@clerk/nextjs/server";
import { getAuthedSupabase } from "@/lib/content/utils/server-auth";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  listComments,
  addComment,
  deleteComment,
  countReplies,
  fetchSubtree,
  hideComment,
  type Comment,
} from "@/lib/content/community/comments-db";

// โหลดความคิดเห็น (public — ใช้ anon client, RLS อนุญาตอ่าน visible)
export async function listCommentsAction(
  section: string,
  slug: string,
): Promise<Comment[] | null> {
  const sb = createServerSupabase();
  return listComments(sb, section, slug);
}

// เพิ่มความคิดเห็น (ต้อง login — ใช้ service role, ตรวจ ownership เอง)
// เมื่อระบุ parentId โดยไม่มี section/slug → resolve จาก parent โดยอัตโนมัติ
export async function addCommentAction(
  section: string,
  slug: string,
  body: string,
  parentId?: string | null,
): Promise<{ error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { error: "ยังไม่ได้เข้าสู่ระบบ" };

  const { userId: uid, supabase } = await getAuthedSupabase();

  let resolvedSection = section;
  let resolvedSlug = slug;
  if (parentId && (!section || !slug)) {
    const { data: parentRow } = await supabase
      .from("comments")
      .select("section, slug")
      .eq("id", parentId)
      .maybeSingle();
    const parent = parentRow as { section: string; slug: string } | null;
    if (parent) {
      resolvedSection = parent.section;
      resolvedSlug = parent.slug;
    }
  }

  // ดึงชื่อผู้ใช้จาก Clerk
  const { clerkClient } = await import("@clerk/nextjs/server");
  const client = await clerkClient();
  const user = await client.users.getUser(uid);
  const authorName =
    user.fullName || user.username || user.primaryEmailAddress?.emailAddress || "ผู้อ่าน";

  const { error } = await addComment(supabase, {
    section: resolvedSection,
    slug: resolvedSlug,
    userId: uid,
    authorName,
    body,
    parentId: parentId || null,
  });
  return { error: error?.message ?? null };
}

// ลบความคิดเห็น (ต้องเป็นเจ้าของ — ใช้ service role, ตรวจ ownership เอง)
export async function deleteCommentAction(
  id: string,
): Promise<{ error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { error: "ยังไม่ได้เข้าสู่ระบบ" };

  const { supabase } = await getAuthedSupabase();

  // ตรวจ ownership ก่อนลบ (service role ข้าม RLS ได้)
  const { data } = await supabase
    .from("comments")
    .select("clerk_user_id")
    .eq("id", id)
    .maybeSingle();

  const owner = (data as { clerk_user_id: string } | null)?.clerk_user_id;
  if (owner !== userId) {
    return { error: "ลบได้เฉพาะความคิดเห็นของตนเอง" };
  }

  const { error } = await deleteComment(supabase, id);
  return { error: error?.message ?? null };
}

// นับจำนวนคำตอบที่ visible ของ parent ใด ๆ (public)
export async function countRepliesAction(parentId: string): Promise<number> {
  const sb = createServerSupabase();
  return countReplies(sb, parentId);
}

// ดึง subtree ทั้งหมดของ parent (ใช้ service role — ตรวจ permission ฝั่ง DB ผ่าน RPC)
export async function fetchSubtreeAction(rootId: string): Promise<Comment[]> {
  const { supabase } = await getAuthedSupabase();
  return fetchSubtree(supabase, rootId);
}

// ซ่อนความคิดเห็นของตัวเอง (soft-delete)
export async function hideCommentAction(id: string): Promise<{ error: string | null }> {
  const { userId } = await auth();
  if (!userId) return { error: "ยังไม่ได้เข้าสู่ระบบ" };

  const { supabase } = await getAuthedSupabase();
  const { error } = await hideComment(supabase, id, userId);
  return { error: error?.message ?? null };
}
