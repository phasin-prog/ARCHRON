import { createClient } from "@supabase/supabase-js";

// Server-side client (anon key) — ใช้สำหรับอ่านเนื้อหา published (RLS อนุญาตอ่าน published ทุกคน)
// TODO(E0): ตั้ง NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY ใน env
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    { auth: { persistSession: false } },
  );
}

// Service-role client (ข้าม RLS) — ใช้เฉพาะใน server action ที่ตรวจสิทธิ์แอดมินแล้วเท่านั้น
// ต้องตั้ง SUPABASE_SERVICE_ROLE_KEY ใน env (server-only — ห้าม expose ฝั่ง client)
export function createServiceSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false } },
  );
}
