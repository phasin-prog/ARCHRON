import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type { EntryRow } from "@/lib/content/publishing/entry-mapper";
import type { DiscriminatedEntry, SourceType, RelationType } from "@/types/content";

// EditorDraft (ฟอร์ม) → แถวสำหรับเขียนลง Supabase (snake_case)
export function draftToRow(
  d: EditorDraft,
  authorId: string,
  authorName?: string | null,
): Partial<EntryRow> & { slug: string; title: string; author_id: string } {
  const hasRoots =
    d.rootsEtymology.trim() !== "" ||
    d.rootsHistoricalUsage.trim() !== "" ||
    d.rootsMeaningShift.trim() !== "" ||
    d.rootsCaution.trim() !== "";

  const roots = hasRoots
    ? {
        etymology: d.rootsEtymology || undefined,
        historicalUsage: d.rootsHistoricalUsage || undefined,
        meaningShift: d.rootsMeaningShift || undefined,
        caution: d.rootsCaution || undefined,
      }
    : null;

  return {
    // id omitted deliberately — let PostgreSQL auto-generate via gen_random_uuid().
    // ON CONFLICT (slug) handles the match/update without needing a client id.
    slug: d.slug,
    title: d.title,
    author_id: authorId,
    author_name: authorName ?? null,
    status: d.status,
    content_type: d.contentType,
    framework: d.framework || undefined,
    difficulty: d.difficulty || undefined,
    tags: d.tags.length > 0 ? d.tags : undefined,
    body_markdown: d.bodyMarkdown || undefined,
    related_concepts: d.relatedConcepts.map((rc) => ({
      conceptSlug: rc.conceptSlug,
      relationType: rc.relationType as RelationType,
      reason: rc.reason || undefined,
    })),
    source_refs: d.references.map((r) => ({
      sourceType: r.sourceType as SourceType,
      author: r.author || undefined,
      title: r.title,
      year: r.year || undefined,
      pageOrSection: r.pageOrSection || undefined,
      citationNote: r.citationNote || undefined,
      relatedClaim: r.relatedClaim || undefined,
    })),
    roots: roots as EntryRow["roots"],
    cover_image: d.coverImage || undefined,
    short_description: d.shortDescription || undefined,
    school: d.school || undefined,
    row_name: d.rowName || undefined,
    main_term: d.mainTerm || undefined,
    thai_name: d.thaiName || undefined,
    original_term: d.originalTerm || undefined,
    part_of_speech: d.partOfSpeech || undefined,
    language_root: d.languageRoot || undefined,
    ipa: d.ipa || undefined,
    visual_explanation: d.visualExplanation || undefined,
    technical_meaning: d.technicalMeaning || undefined,
    real_world_examples: d.realWorldExamples || undefined,
    main_thinkers: d.mainThinker
      ? d.mainThinker.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined,
    born_year: d.bornYear || undefined,
    died_year: d.diedYear || undefined,
    nationality: d.nationality || undefined,
    key_ideas: d.keyIdeas ? d.keyIdeas.split(",").map(s => s.trim()).filter(Boolean) : undefined,
    notable_works: d.notableWorks ? d.notableWorks.split(",").map(s => s.trim()).filter(Boolean) : undefined,
    publication_year: d.publicationYear || undefined,
    publisher: d.publisher || undefined,
    isbn: d.isbn || undefined,
    founder: d.founder || undefined,
    period: d.period || undefined,
  };
}

// DiscriminatedEntry (จาก DB หรือ static) → EditorDraft สำหรับโหลดเข้าฟอร์มแก้ไข
export function entryToDraft(entry: DiscriminatedEntry): EditorDraft {
  const base = {
    id: entry.id ?? "", title: entry.title ?? "", slug: entry.slug ?? "",
    status: entry.status ?? "draft", contentType: entry.contentType ?? "article",
    difficulty: entry.difficulty ?? "beginner",
    tags: entry.tags ?? [], bodyMarkdown: entry.bodyMarkdown ?? "",
    relatedConcepts: (entry.relatedConcepts ?? []).map((r) => ({
      conceptSlug: r.conceptSlug, relationType: r.relationType, reason: r.reason ?? "",
    })),
    references: (entry.references ?? []).map((r) => ({
      sourceType: r.sourceType,
      author: r.author ?? "",
      title: r.title,
      year: r.year ?? "",
      pageOrSection: r.pageOrSection ?? "",
      citationNote: r.citationNote ?? "",
      relatedClaim: r.relatedClaim ?? "",
    })),
    coverImage: entry.coverImage ?? "", shortDescription: entry.shortDescription ?? "",
    rowName: entry.rowName ?? "", rowCode: entry.rowCode ?? "",
    realWorldExamples: (entry as { realWorldExamples?: string }).realWorldExamples ?? "",
  };

  if (entry.contentType === "concept") {
    return {
      ...base, framework: entry.framework ?? "", school: entry.school ?? "",
      mainTerm: entry.mainTerm, thaiName: entry.thaiName,
      originalTerm: entry.originalTerm ?? "",
      partOfSpeech: entry.partOfSpeech ?? "", languageRoot: entry.languageRoot ?? "",
      ipa: entry.ipa ?? "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: entry.roots?.etymology ?? "",
      rootsHistoricalUsage: entry.roots?.historicalUsage ?? "",
      rootsMeaningShift: entry.roots?.meaningShift ?? "",
      rootsCaution: entry.roots?.caution ?? "",
      mainThinker: entry.mainThinkers?.join(", ") ?? "",
      bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "person") {
    return {
      ...base, framework: entry.framework ?? "", school: entry.school ?? "",
      mainTerm: entry.mainTerm, thaiName: entry.thaiName ?? "",
      mainThinker: entry.mainTerm,
      bornYear: entry.bornYear ?? "", diedYear: entry.diedYear ?? "",
      nationality: entry.nationality ?? "",
      keyIdeas: entry.keyIdeas?.join(", ") ?? "",
      notableWorks: entry.notableWorks?.join(", ") ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: "", rootsHistoricalUsage: "", rootsMeaningShift: "", rootsCaution: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "book") {
    return {
      ...base, framework: entry.framework ?? "", school: "",
      mainTerm: entry.mainTerm ?? "", thaiName: entry.thaiName ?? "",
      publicationYear: entry.publicationYear ?? "", publisher: entry.publisher ?? "",
      isbn: entry.isbn ?? "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: "", technicalMeaning: "",
      rootsEtymology: "", rootsHistoricalUsage: "", rootsMeaningShift: "", rootsCaution: "",
      mainThinker: "", bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      founder: "", period: "",
    };
  }
  if (entry.contentType === "article") {
    return {
      ...base, framework: entry.framework ?? "", school: entry.school ?? "",
      mainTerm: "", thaiName: "",
      originalTerm: "", partOfSpeech: "", languageRoot: "", ipa: "",
      visualExplanation: entry.visualExplanation ?? "",
      technicalMeaning: entry.technicalMeaning ?? "",
      rootsEtymology: "", rootsHistoricalUsage: "", rootsMeaningShift: "", rootsCaution: "",
      mainThinker: entry.mainThinkers?.join(", ") ?? "",
      bornYear: "", diedYear: "", nationality: "",
      keyIdeas: "", notableWorks: "",
      publicationYear: "", publisher: "", isbn: "",
      founder: "", period: "",
    };
  }
  return {
    ...base, framework: "", school: "",
    mainTerm: "", thaiName: "", originalTerm: "", partOfSpeech: "",
    languageRoot: "", ipa: "", visualExplanation: "", technicalMeaning: "",
    rootsEtymology: "", rootsHistoricalUsage: "", rootsMeaningShift: "", rootsCaution: "",
    mainThinker: "", bornYear: "", diedYear: "", nationality: "",
    keyIdeas: "", notableWorks: "",
    publicationYear: "", publisher: "", isbn: "",
    founder: "", period: "",
  };
}
