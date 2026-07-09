import type { EditorDraft } from "@/lib/content/publish-validation";
import type { EntryRow } from "@/lib/content/entry-mapper";
import type { ContentEntry } from "@/types/content";

// EditorDraft (ฟอร์ม) → แถวสำหรับเขียนลง Supabase (snake_case)
export function draftToRow(
  d: EditorDraft,
  authorId: string,
  authorName?: string | null,
): Partial<EntryRow> & { slug: string; title: string; author_id: string } {
  const hasRoots =
    d.rootsEtymology.trim() !== "" ||
    d.rootsMeaningShift.trim() !== "" ||
    d.rootsCaution.trim() !== "";

  const roots = hasRoots
    ? {
        etymology: d.rootsEtymology || undefined,
        meaningShift: d.rootsMeaningShift || undefined,
        caution: d.rootsCaution || undefined,
      }
    : null;

  return {
    id: d.id || undefined,       // ใช้ UUID ที่สร้างไว้ (ใหม่) หรือที่โหลดมา (แก้ไข)
    slug: d.slug,
    title: d.title,
    author_id: authorId,
    author_name: authorName ?? null,
    status: d.status,
    content_type: d.contentType,
    framework: d.framework || null,
    main_thinkers: d.mainThinker ? [d.mainThinker] : null,
    difficulty: d.difficulty || null,
    tags: d.tags.length > 0 ? d.tags : null,
    visual_explanation: d.visualExplanation || null,
    technical_meaning: d.technicalMeaning || null,
    body_markdown: d.bodyMarkdown || null,
    related_concepts: d.relatedConcepts as unknown as EntryRow["related_concepts"],
    source_refs: d.references as unknown as EntryRow["source_refs"],
    roots: roots as EntryRow["roots"],
    cover_image: d.coverImage || null,
    short_description: d.shortDescription || null,
    school: d.school || null,
    row_name: d.rowName || null,
  };
}

// ContentEntry (จาก DB หรือ static) → EditorDraft สำหรับโหลดเข้าฟอร์มแก้ไข
export function entryToDraft(entry: ContentEntry): EditorDraft {
  return {
    id: entry.id ?? "",
    title: entry.title ?? "",
    slug: entry.slug ?? "",
    status: entry.status ?? "draft",
    contentType: entry.contentType ?? "article",
    framework: entry.framework ?? "",
    mainThinker: entry.mainThinkers?.[0] ?? "",
    difficulty: entry.difficulty ?? "beginner",
    tags: entry.tags ?? [],
    visualExplanation: entry.visualExplanation ?? "",
    technicalMeaning: entry.technicalMeaning ?? "",
    bodyMarkdown: entry.bodyMarkdown ?? "",
    relatedConcepts: (entry.relatedConcepts ?? []).map((r) => ({
      conceptSlug: r.conceptSlug,
      relationType: r.relationType,
      reason: r.reason ?? "",
    })),
    references: (entry.references ?? []).map((r) => ({
      sourceType: r.sourceType,
      title: r.title,
      relatedClaim: r.relatedClaim ?? "",
    })),
    rootsEtymology: entry.roots?.etymology ?? "",
    rootsMeaningShift: entry.roots?.meaningShift ?? "",
    rootsCaution: entry.roots?.caution ?? "",
    coverImage: entry.coverImage ?? "",
    shortDescription: entry.shortDescription ?? "",
    school: entry.school ?? "",
    rowName: entry.rowName ?? "",
    rowCode: entry.rowCode ?? "",
  };
}
