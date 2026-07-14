// ARCHRON — CRUD โปรไฟล์ผู้ใช้ผ่าน Supabase (RLS: แก้ได้เฉพาะของตัวเอง)
import type { SupabaseClient } from "@supabase/supabase-js";

export type Profile = {
  clerk_user_id: string;
  username: string | null;
  display_name: string | null;
  title: string | null;
  writer_request: boolean;
};

export type ProfileInput = {
  username?: string | null;
  display_name?: string | null;
  title?: string | null;
};

export async function getMyProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("clerk_user_id, username, display_name, title, writer_request")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (error) return null;
  return (data as Profile) ?? null;
}

export async function upsertMyProfile(
  supabase: SupabaseClient,
  userId: string,
  input: ProfileInput,
): Promise<{ error: { message: string } | null }> {
  const row: Record<string, unknown> = {
    clerk_user_id: userId,
    username: input.username?.trim() || null,
    display_name: input.display_name?.trim() || null,
  };
  if (input.title !== undefined) {
    row.title = input.title?.trim() || null;
  }
  const { error } = await supabase.from("profiles").upsert(row, {
    onConflict: "clerk_user_id",
  });
  return { error: error ? { message: error.message } : null };
}

// ผู้ใช้ขอเป็นนักเขียน (ตั้ง flag รออนุมัติจากแอดมิน)
export async function requestWriter(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("profiles").upsert(
    { clerk_user_id: userId, writer_request: true },
    { onConflict: "clerk_user_id" },
  );
  return { error: error ? { message: error.message } : null };
}
