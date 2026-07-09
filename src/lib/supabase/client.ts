import { createClient } from "@supabase/supabase-js";

// สร้าง Supabase client ที่แนบ Clerk token ทุก request → RLS เห็น auth.jwt()->>'sub'
// ใช้ฝั่ง client/studio (E2 จะส่ง getToken มาจาก Clerk useSession)
// TODO(E2): wire กับ Clerk session.getToken()
export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      accessToken: async () => (await getToken()) ?? null,
    },
  );
}
