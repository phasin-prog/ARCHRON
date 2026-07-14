"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { roleFromMetadata } from "@/lib/content/utils/roles";
import { createServiceSupabase } from "@/lib/supabase/server";

export type ModComment = {
  id: string;
  section: string;
  slug: string;
  clerk_user_id: string;
  author_name: string | null;
  body: string;
  status: string; // visible | hidden
  parent_id: string | null;
  created_at: string;
};

// ตรวจว่าผู้เรียกเป็นแอดมินจริง (อ่าน role จาก Clerk) — กันการเรียกข้ามสิทธิ
async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) throw new Error("ยังไม่ได้เข้าสู่ระบบ");
  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (roleFromMetadata(me.publicMetadata) !== "admin") {
    throw new Error("ต้องเป็นแอดมินเท่านั้น");
  }
}

// รายการคอมเมนต์ทั้งหมด (ทุกสถานะ) สำหรับโมเดอเรชัน
export async function listAllCommentsAction(): Promise<ModComment[]> {
  await requireAdmin();
  const supabase = createServiceSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("id, section, slug, clerk_user_id, author_name, body, status, parent_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return [];
  return (data as ModComment[]) ?? [];
}

// ซ่อน/แสดง คอมเมนต์ (status: hidden | visible)
export async function setCommentStatusAction(
  id: string,
  status: "visible" | "hidden",
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("comments").update({ status }).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "ทำรายการไม่สำเร็จ" };
  }
}

// ลบคอมเมนต์ถาวร (แอดมิน)
export async function deleteCommentAdminAction(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
    const supabase = createServiceSupabase();
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "ลบไม่สำเร็จ" };
  }
}
