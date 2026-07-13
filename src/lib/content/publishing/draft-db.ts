import type { SupabaseClient } from "@supabase/supabase-js";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { DiscriminatedEntry } from "@/types/content";
import type { Role } from "@/lib/content/utils/roles";
import { draftToRow, entryToDraft } from "@/lib/content/publishing/draft-mapper";
import { rowToEntry, type EntryRow } from "@/lib/content/publishing/entry-mapper";
import { getMyProfile } from "@/lib/content/community/profile-db";
import { refreshLibrary } from "@/lib/rtk/ingest";

const SYSTEM_AUTHOR_ID = "system-seed";

// ชั้น persistence ของ editor (E3) — เรียกด้วย Supabase service-role client
// service role ข้าม RLS ได้ จึงต้องตรวจสอบ ownership เองทุก operation
// (author_id === userId มิฉะนั้นผู้ใช้ A จะเขียนทับงานของ B ได้)

// ดึง author_id ของ entry ที่มีอยู่ (ตาม id) — สำหรับตรวจ ownership
async function getExistingAuthor(
  sb: SupabaseClient,
  id: string,
): Promise<string | null> {
  if (!id) return null;
  const { data } = await sb
    .from("entries")
    .select("author_id")
    .eq("id", id)
    .maybeSingle();
  return (data as { author_id: string } | null)?.author_id ?? null;
}

// บันทึก/อัปเดตฉบับร่าง (upsert ตาม slug)
// ถ้า entry มีอยู่แล้ว author_id ต้องตรงกับผู้เขียนปัจจุบัน (ป้องกันเขียนทับของคนอื่น)
// admin สามารถแก้ไข entry ของคนอื่นได้
export async function saveDraft(
  sb: SupabaseClient,
  authorId: string,
  draft: EditorDraft,
  role?: Role,
) {
  const existingAuthor = await getExistingAuthor(sb, draft.id);
  if (existingAuthor !== null && existingAuthor !== SYSTEM_AUTHOR_ID && existingAuthor !== authorId && role !== "admin") {
    return {
      data: null,
      error: { message: "slug นี้เป็นของผู้เขียนคนอื่น , ใช้ slug อื่น" } as {
        message: string;
      },
    };
  }

  const profile = await getMyProfile(sb, authorId);
  const authorName = profile?.display_name ?? profile?.username ?? null;
  const row = draftToRow(draft, authorId, authorName);
  const { data, error } = await sb
    .from("entries")
    .upsert(row, { onConflict: "id" })
    .select()
    .maybeSingle();
  return { data, error };
}

// โหลดฉบับร่างของตนตาม slug → EditorDraft
export async function loadDraftBySlug(
  sb: SupabaseClient,
  slug: string,
): Promise<EditorDraft | null> {
  const { data, error } = await sb
    .from("entries")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return entryToDraft(rowToEntry(data as EntryRow));
}

// รายการเนื้อหาของผู้ใช้ (สำหรับหน้า /studio รายการของฉัน)
// admin สามารถเห็น entry ทั้งหมดได้
export async function listMyDrafts(
  sb: SupabaseClient,
  authorId: string,
  role?: Role,
): Promise<DiscriminatedEntry[]> {
  let query = sb.from("entries").select("*");
  if (role !== "admin") {
    query = query.eq("author_id", authorId);
  }
  const { data } = await query.order("updated_at", { ascending: false });
  return ((data ?? []) as EntryRow[]).map(rowToEntry);
}

// เผยแพร่จริง (E7): ตั้ง status=published + published_at
// คงวันเผยแพร่ครั้งแรกไว้ถ้าเคยเผยแพร่แล้ว (ไม่รีเซ็ตทุกครั้งที่กดเผยแพร่ซ้ำ)
// ตรวจ ownership ก่อน publish (admin ข้ามได้)
export async function publishEntry(
  sb: SupabaseClient,
  authorId: string,
  draft: EditorDraft,
  role?: Role,
) {
  const existingAuthor = await getExistingAuthor(sb, draft.id);
  if (existingAuthor !== null && existingAuthor !== SYSTEM_AUTHOR_ID && existingAuthor !== authorId && role !== "admin") {
    return {
      data: null,
      error: { message: "slug นี้เป็นของผู้เขียนคนอื่น , ไม่สามารถเผยแพร่ได้" } as {
        message: string,
      },
    };
  }

  const { data: existing } = await sb
    .from("entries")
    .select("published_at")
    .eq("id", draft.id)
    .maybeSingle();

  const publishedAt =
    (existing as { published_at: string | null } | null)?.published_at ??
    new Date().toISOString();

  const profile = await getMyProfile(sb, authorId);
  const authorName = profile?.display_name ?? profile?.username ?? null;
  const row = {
    ...draftToRow({ ...draft, status: "published" }, authorId, authorName),
    published_at: publishedAt,
  };

  const result = await sb
    .from("entries")
    .upsert(row, { onConflict: "id" })
    .select()
    .maybeSingle();

  // Fire-and-forget: reindex this entry into RTK library + chunks
  refreshLibrary(draft.slug).catch((e) => {
    console.error(`[RTK_REFRESH_ERROR] slug=${draft.slug}:`, e);
  });

  return result;
}
