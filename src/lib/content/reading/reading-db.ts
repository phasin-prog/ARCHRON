// ARCHRON — ความคืบหน้าการอ่าน + เหรียญตรา ผ่าน Supabase
// มิเรอร์สไตล์ comments-db.ts: ฟังก์ชันรับ SupabaseClient ที่ตรวจสิทธิ์แล้ว
// (server action เรียกด้วย service-role client จาก getAuthedSupabase — ownership คุมด้วย clerkUserId ที่ส่งเข้ามา)
// RLS ยังบังคับ row-level เมื่อใช้ผ่าน anon+Clerk token client เช่นกัน
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  evaluateAchievements,
  MANIFESTO_SLUG,
  type AchievementKey,
  type ReadingStats,
} from "@/lib/content/community/achievements";

export type ReadingRow = {
  clerk_user_id: string;
  slug: string;
  content_type: string;
  status: string;
  progress: number;
  first_read_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
};

// บันทึก "อ่านจบ" — upsert เป็น completed (idempotent: กดซ้ำไม่เพิ่มแถวใหม่)
// รักษา first_read_at เดิมไว้ถ้ามี (upsert จะเขียนทับเฉพาะฟิลด์ที่ส่ง)
export async function upsertReadingCompleted(
  supabase: SupabaseClient,
  clerkUserId: string,
  slug: string,
  contentType: string,
): Promise<{ error: { message: string } | null }> {
  const now = new Date().toISOString();

  // ถ้าเคย completed แล้ว ไม่ต้องเขียนซ้ำ (คง completed_at เดิม — idempotent)
  const { data: existing } = await supabase
    .from("reading_progress")
    .select("status, completed_at, first_read_at")
    .eq("clerk_user_id", clerkUserId)
    .eq("slug", slug)
    .maybeSingle();

  const row = existing as
    | Pick<ReadingRow, "status" | "completed_at" | "first_read_at">
    | null;

  if (row?.status === "completed") {
    return { error: null };
  }

  const { error } = await supabase.from("reading_progress").upsert(
    {
      clerk_user_id: clerkUserId,
      slug,
      content_type: contentType || "article",
      status: "completed",
      progress: 100,
      first_read_at: row?.first_read_at ?? now,
      completed_at: now,
      updated_at: now,
    },
    { onConflict: "clerk_user_id,slug" },
  );

  return { error: error ? { message: error.message } : null };
}

// นับจำนวนวันอ่านต่อเนื่อง (streak) จากชุดวันที่ completed_at
// นับย้อนจากวันนี้ (หรือเมื่อวานถ้ายังไม่มีของวันนี้) — วันติดกันไม่ขาดช่วง
function computeStreak(completedDates: string[]): number {
  // แปลงเป็นเซ็ตของวัน (YYYY-MM-DD, UTC) เพื่อตัดเวลาทิ้ง
  const days = new Set(
    completedDates
      .filter(Boolean)
      .map((d) => new Date(d).toISOString().slice(0, 10)),
  );
  if (days.size === 0) return 0;

  const dayMs = 86400000;
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - dayMs).toISOString().slice(0, 10);

  // ต้องมีการอ่านวันนี้หรือเมื่อวาน ไม่งั้น streak = 0 (ขาดช่วงแล้ว)
  let cursor: string;
  if (days.has(today)) cursor = today;
  else if (days.has(yesterday)) cursor = yesterday;
  else return 0;

  let streak = 0;
  let t = new Date(cursor + "T00:00:00.000Z").getTime();
  while (days.has(new Date(t).toISOString().slice(0, 10))) {
    streak += 1;
    t -= dayMs;
  }
  return streak;
}

// คำนวณสถิติการอ่านทั้งหมดของผู้ใช้ (derive ทุกครั้ง ไม่ cache)
export async function getReadingStats(
  supabase: SupabaseClient,
  clerkUserId: string,
): Promise<ReadingStats> {
  const { data, error } = await supabase
    .from("reading_progress")
    .select("slug, content_type, completed_at")
    .eq("clerk_user_id", clerkUserId)
    .eq("status", "completed");

  if (error || !data) {
    return { completed: 0, distinctSchools: 0, streakDays: 0, readManifesto: false };
  }

  const rows = data as Pick<ReadingRow, "slug" | "content_type" | "completed_at">[];

  const completed = rows.length;

  // distinctSchools (การประมาณ): นับ distinct slug ของเนื้อหาที่ content_type='school'
  // ที่อ่านจบ — schools ถูกแทนด้วย entry content_type='school' (ดู entries/public-source)
  // ถ้าภายหลังต้องการนับ "สำนักคิดที่เกี่ยวข้องกับบทความ" ให้ปรับ mapping ตรงนี้
  const schoolSlugs = new Set(
    rows.filter((r) => r.content_type === "school").map((r) => r.slug),
  );
  const distinctSchools = schoolSlugs.size;

  const streakDays = computeStreak(rows.map((r) => r.completed_at ?? ""));

  const readManifesto = rows.some((r) => r.slug === MANIFESTO_SLUG);

  return { completed, distinctSchools, streakDays, readManifesto };
}

// ประวัติการอ่านล่าสุด (ทั้ง reading + completed) เรียงใหม่→เก่า
export async function getReadingHistory(
  supabase: SupabaseClient,
  clerkUserId: string,
  limit = 30,
): Promise<ReadingRow[]> {
  const { data, error } = await supabase
    .from("reading_progress")
    .select(
      "clerk_user_id, slug, content_type, status, progress, first_read_at, completed_at, updated_at",
    )
    .eq("clerk_user_id", clerkUserId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as ReadingRow[];
}

// เหรียญที่ปลดล็อกแล้ว (คืนเป็น array ของ key)
export async function getUserAchievements(
  supabase: SupabaseClient,
  clerkUserId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("achievement_key")
    .eq("clerk_user_id", clerkUserId);
  if (error || !data) return [];
  return (data as { achievement_key: string }[]).map((r) => r.achievement_key);
}

// ประเมินสถิติ → upsert เฉพาะเหรียญที่ยังไม่มี (idempotent)
export async function syncAchievements(
  supabase: SupabaseClient,
  clerkUserId: string,
): Promise<{ unlocked: AchievementKey[]; error: { message: string } | null }> {
  const stats = await getReadingStats(supabase, clerkUserId);
  const shouldHave = evaluateAchievements(stats);
  if (shouldHave.length === 0) return { unlocked: [], error: null };

  const existing = await getUserAchievements(supabase, clerkUserId);
  const existingSet = new Set(existing);
  const missing = shouldHave.filter((k) => !existingSet.has(k));
  if (missing.length === 0) return { unlocked: [], error: null };

  const now = new Date().toISOString();
  const { error } = await supabase.from("user_achievements").upsert(
    missing.map((key) => ({
      clerk_user_id: clerkUserId,
      achievement_key: key,
      unlocked_at: now,
    })),
    { onConflict: "clerk_user_id,achievement_key" },
  );

  return {
    unlocked: missing,
    error: error ? { message: error.message } : null,
  };
}
