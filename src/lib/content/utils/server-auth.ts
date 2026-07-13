import { auth, clerkClient } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { roleFromMetadata, type Role } from "@/lib/content/utils/roles";

// Server actions รันฝั่ง server เท่านั้น → ใช้ service-role client (ข้าม RLS)
// แล้วตรวจสอบ ownership เองใน data layer (author_id === userId)
// ทำให้ไม่ต้องพึ่งพา Clerk JWT template + Supabase Third-Party Auth
// (ซึ่งต้องตั้งค่าใน Dashboard ทั้งสองฝั่ง และเป็นสาเหตุของ
//  error "No suitable key or wrong key type" เมื่อยังไม่ได้ตั้ง)
export async function getAuthedSupabase(): Promise<{
  userId: string;
  supabase: SupabaseClient;
}> {
  const { userId } = await auth();
  if (!userId) throw new Error("ยังไม่ได้เข้าสู่ระบบ");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false } },
  );

  return { userId, supabase };
}

export async function getUserRole(): Promise<Role> {
  const { userId } = await auth();
  if (!userId) return "user";
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return roleFromMetadata(user.publicMetadata);
}
