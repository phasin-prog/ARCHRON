"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { getAuthedSupabase } from "@/lib/content/utils/server-auth";
import {
  upsertReadingCompleted,
  syncAchievements,
} from "@/lib/content/reading/reading-db";

// บันทึก "อ่านจบ" อัตโนมัติ (เรียกจาก ReadCompletionTracker เมื่อเข้าเงื่อนไข)
// - ผู้ไม่ล็อกอิน → no-op เงียบ ๆ (ไม่ throw)
// - upsert reading_progress (completed) → sync achievements → revalidate /profile
// - idempotent: กดซ้ำ/ยิงซ้ำไม่เพิ่มข้อมูลซ้ำ (upsertReadingCompleted คุมไว้)
export async function recordReadCompletion(
  slug: string,
  contentType: string,
): Promise<{ ok: boolean }> {
  if (!slug) return { ok: false };

  const { userId } = await auth();
  if (!userId) return { ok: false }; // signed-out → no-op

  try {
    const { userId: uid, supabase } = await getAuthedSupabase();

    const { error } = await upsertReadingCompleted(
      supabase,
      uid,
      slug,
      contentType || "article",
    );
    if (error) return { ok: false };

    await syncAchievements(supabase, uid);
    revalidatePath("/profile");
    return { ok: true };
  } catch {
    // ไม่ให้ล้มหน้าอ่านเด็ดขาด — ถ้าบันทึกไม่ได้ก็ปล่อยผ่าน
    return { ok: false };
  }
}
