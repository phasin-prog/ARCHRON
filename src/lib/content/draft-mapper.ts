import type { EditorDraft } from "@/lib/content/publish-validation";
import type { EntryRow } from "@/lib/content/entry-mapper";
import type { DiscriminatedEntry } from "@/types/content";

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
    difficulty: d.difficulty || null,
    tags: d.tags.length > 0 ? d.tags : null,
    body_markdown: d.bodyMarkdown || null,
    related_concepts: d.relatedConcepts as unknown as EntryRow["related_concepts"],
    source_refs: d.references as unknown as EntryRow["source_refs"],
    roots: roots as EntryRow["roots"],
    cover_image: d.coverImage || null,
    short_description: d.shortDescription || null,
    school: d.school || null,
    row_name: d.rowName || null,
    main_term: d.mainTerm || null,
    thai_name: d.thaiName || null,
    original_term: d.originalTerm || null,
    part_of_speech: d.partOfSpeech || null,
    language_root: d.languageRoot || null,
    ipa: d.ipa || null,
    visual_explanation: d.visualExplanation || null,
    technical_meaning: d.technicalMeaning || null,
    main_thinkers: d.mainThinker ? [d.mainThinker] : null,
    born_year: d.bornYear || null,
    died_year: d.diedYear || null,
    nationality: d.nationality || null,
    key_ideas: d.keyIdeas ? d.keyIdeas.split(",").map(s => s.trim()).filter(Boolean) : null,
    notable_works: d.notableWorks ? d.notableWorks.split(",").map(s => s.trim()).filter(Boolean) : null,
    publication_year: d.publicationYear || null,
    publisher: d.publisher || null,
    isbn: d.isbn || null,
    founder: d.founder || null,
    period: d.period || null,
  };
}

// DiscriminatedEntry (จาก DB หรือ static) → EditorDraft สำหรับโหลดเข้าฟอร์มแก้ไข
export function entryToDraft(entry: DiscriminatedEntry): EditorDraft {
  const base = {
    id: entry.id ?? "", title: entry.title ?? "", slug: entry.slug ?? "",
    status: entry.status ?? "draft", contentType: entry.contentType ?? "article",
    framework: entry.framework ?? "", school: entry.school ?? "",
    difficulty: entry.difficulty ?? "beginner",
    tags: entry.tags ?? [], bodyMarkdown: entry.bodyMarkdown ?? "",
    relatedConcepts: (entry.relatedConcepts ?? []).map((r) => ({
      conceptSlug: r.conceptSlug, relationType: r.relationType, reason: r.reason ?? "",
    })),
    references: (entry.references ?? []).map((r) => ({
      sourceType: r.sourceType, title: r.title, relatedClaim: r.relatedClaim ?? "",
    })),
    coverImage: entry.coverImage ?? "", shortDescription: entry.shortDescription ?? "",
    rowName: entry.rowName ?? "", rowCode: entry.rowCode ?? "",
  };

  if (entry.contentType === "concept") {
    return {
      ...base, mainTerm: entry.mainTerm, thaiName: entry.thaiName,
      originalTerm: entry.originalTerm ?? "",
      partOfSpeech: entry.partOfSpeech ?? "", languageRoot: entry.languageRoot ?? "",
      ipa: entry.ipa ?? "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: entry.roots?.etymology ?? "",
      rootsMeaningShift: entry.roots?.meaningShift ?? "",
      rootsCaution: entry.roots?.caution ?? "",
      mainThinker: entry.mainThinkers?.[0] ?? "",
      bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "person") {
    return {
      ...base, mainTerm: entry.mainTerm, thaiName: entry.thaiName ?? "",
      mainThinker: entry.mainTerm,
      bornYear: entry.bornYear ?? "", diedYear: entry.diedYear ?? "",
      nationality: entry.nationality ?? "",
      keyIdeas: entry.keyIdeas?.join(", ") ?? "",
      notableWorks: entry.notableWorks?.join(", ") ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "book") {
    return {
      ...base, mainTerm: entry.mainTerm ?? "", thaiName: entry.thaiName ?? "",
      publicationYear: entry.publicationYear ?? "", publisher: entry.publisher ?? "",
      isbn: entry.isbn ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: "", technicalMeaning: "",
      rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
      mainThinker: "", bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "school") {
    return {
      ...base, mainTerm: entry.mainTerm ?? "", thaiName: entry.thaiName ?? "",
      founder: entry.founder ?? "", period: entry.period ?? "",
      keyIdeas: entry.keyIdeas?.join(", ") ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: "", technicalMeaning: "",
      rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
      mainThinker: "", bornYear: "", diedYear: "", nationality: "",
      notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
    };
  }
  if (entry.contentType === "article") {
    return {
      ...base, mainTerm: "", thaiName: "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: entry.roots?.etymology ?? "",
      rootsMeaningShift: entry.roots?.meaningShift ?? "",
      rootsCaution: entry.roots?.caution ?? "",
      mainThinker: entry.mainThinkers?.[0] ?? "",
      bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  return {
    ...base, mainTerm: "", thaiName: "", originalTerm: "", partOfSpeech: "",
    languageRoot: "", ipa: "", visualExplanation: "", technicalMeaning: "",
    rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
    mainThinker: "", bornYear: "", diedYear: "", nationality: "",
    keyIdeas: "", notableWorks: "",
    publicationYear: "", publisher: "", isbn: "",
    founder: "", period: "",
  };
}
