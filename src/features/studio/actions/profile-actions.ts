"use server";

import { getAuthedSupabase } from "@/lib/content/utils/server-auth";
import {
  getMyProfile,
  upsertMyProfile,
  requestWriter,
  type Profile,
  type ProfileInput,
} from "@/lib/content/community/profile-db";

// โหลดโปรไฟล์ของตนเอง
export async function getMyProfileAction(): Promise<Profile | null> {
  const { userId, supabase } = await getAuthedSupabase();
  return getMyProfile(supabase, userId);
}

// บันทึก/อัปเดตโปรไฟล์
export async function upsertMyProfileAction(
  input: ProfileInput,
): Promise<{ error: string | null }> {
  const { userId, supabase } = await getAuthedSupabase();
  const { error } = await upsertMyProfile(supabase, userId, input);
  return { error: error?.message ?? null };
}

// ขอเป็นนักเขียน
export async function requestWriterAction(): Promise<{ error: string | null }> {
  const { userId, supabase } = await getAuthedSupabase();
  const { error } = await requestWriter(supabase, userId);
  return { error: error?.message ?? null };
}
