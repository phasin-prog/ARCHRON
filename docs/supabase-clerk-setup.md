# Supabase + Clerk Setup — Editor v1 (E0)

คู่มือตั้งค่าให้ผู้เขียนแก้ได้เฉพาะเนื้อหาของตน (ownership ผ่าน RLS) โดยใช้ Clerk เป็น auth

## 1. สร้าง Supabase project
1. สร้างโปรเจกต์ที่ supabase.com
2. คัดลอก **Project URL** และ **anon public key** (Settings > API)
3. ไป **SQL Editor** วางเนื้อหา `supabase/schema.sql` แล้ว Run (สร้างตาราง entries, entry_revisions + RLS)

## 2. สร้าง Clerk application
1. สร้าง app ที่ clerk.com
2. คัดลอก **Publishable key** และ **Secret key**

## 3. เชื่อม Clerk → Supabase (Third-Party Auth)
แนวทางปัจจุบัน (แนะนำ):
1. **Clerk dashboard** > Integrations/Connect > เปิดการเชื่อมกับ **Supabase** (Clerk จะออก session token ที่ Supabase ตรวจสอบได้)
2. **Supabase dashboard** > Authentication > **Sign In / Providers > Third-Party Auth** > Add provider **Clerk** แล้วใส่ Clerk **domain/issuer** ตามที่ Clerk ให้มา
3. ผลลัพธ์: token ที่ Clerk ออกจะมี `sub` = Clerk user id ซึ่ง RLS ใช้ผ่าน `auth.jwt()->>'sub'`

> ทางเลือก legacy (ถ้าเวอร์ชันยังไม่มี Third-Party Auth): สร้าง **JWT template ชื่อ `supabase`** ใน Clerk แล้ว sign ด้วย Supabase JWT secret; ฝั่ง client เรียก `session.getToken({ template: "supabase" })`

## 4. Environment variables (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```
> ตอน deploy ใส่ env เดียวกันบน host ด้วย · ห้าม commit ค่าเหล่านี้ลง repo

## 5. Supabase client ที่แนบ Clerk token (ใช้ตอน E1/E2)
```ts
// lib/supabase/client.ts (client component)
import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";

export function useSupabase() {
  const { session } = useSession();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // ส่ง Clerk token ให้ Supabase ทุก request → RLS เห็น auth.jwt()->>'sub'
      accessToken: async () => (await session?.getToken()) ?? null,
    },
  );
}
```

## 6. ตรวจสอบ RLS (สำคัญ)
- login เป็น user A → สร้าง entry → user B แก้ entry ของ A **ต้องไม่ได้** (RLS บล็อก)
- entry ที่ status != 'published' ต้องไม่โผล่ให้คนอื่น/ผู้ไม่ได้ login เห็น
- published เห็นได้ทุกคน

## หมายเหตุ
- author_id เก็บเป็น Clerk user id (เช่น `user_xxx`) — เซ็ตตอน insert จาก `auth()` ฝั่ง server หรือ session ฝั่ง client
- ขั้นตอนนี้คือ **E0 (High Risk Scope)** — เมื่อรัน schema + เชื่อม auth เสร็จ แจ้ง Orchestrator เพื่อเดิน E1 (data layer) ต่อ
