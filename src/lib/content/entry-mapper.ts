import type {
  ContentEntry,
  RelatedConcept,
  SourceItem,
  Roots,
  RelatedCTA,
  ArticleStatus,
  ContentType,
  Difficulty,
} from "@/types/content";

// แถวจากตาราง public.entries (snake_case)
export type EntryRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  content_type: string;
  author_id: string;
  author_name: string | null;
  main_term: string | null;
  thai_name: string | null;
  original_term: string | null;
  part_of_speech: string | null;
  language_root: string | null;
  ipa: string | null;
  short_description: string | null;
  framework: string | null;
  main_thinkers: string[] | null;
  school: string | null;
  difficulty: string | null;
  tags: string[] | null;
  visual_explanation: string | null;
  technical_meaning: string | null;
  body_markdown: string | null;
  roots: Roots | null;
  related_concepts: RelatedConcept[] | null;
  source_refs: SourceItem[] | null;
  related_cta: RelatedCTA | null;
  cover_image: string | null;
  r2_content_key: string | null;
  r2_content_url: string | null;
  row_id: string | null;
  row_i: number | null;
  row_code: string | null;
  row_name: string | null;
  created_at: string;
  updated_at: string | null;
  published_at: string | null;
};

// DB row → ContentEntry (camelCase) สำหรับ render ด้วย ReadingPage
export function rowToEntry(r: EntryRow): ContentEntry {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: r.status as ArticleStatus,
    contentType: r.content_type as ContentType,
    author: r.author_name ?? undefined,
    publishedAt: r.published_at ?? undefined,
    updatedAt: r.updated_at ?? undefined,
    mainTerm: r.main_term ?? undefined,
    thaiName: r.thai_name ?? undefined,
    originalTerm: r.original_term ?? undefined,
    partOfSpeech: r.part_of_speech ?? undefined,
    languageRoot: r.language_root ?? undefined,
    ipa: r.ipa ?? undefined,
    shortDescription: r.short_description ?? undefined,
    subtitle: r.short_description ?? undefined,
    framework: r.framework ?? undefined,
    mainThinkers: r.main_thinkers ?? undefined,
    school: r.school ?? undefined,
    difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
    tags: r.tags ?? undefined,
    visualExplanation: r.visual_explanation ?? undefined,
    technicalMeaning: r.technical_meaning ?? undefined,
    relatedConcepts: r.related_concepts ?? [],
    references: r.source_refs ?? [],
    roots: r.roots ?? undefined,
    relatedCTA: r.related_cta ?? undefined,
    bodyMarkdown: r.body_markdown ?? undefined,
    coverImage: r.cover_image ?? undefined,
    r2ContentKey: r.r2_content_key ?? undefined,
    r2ContentUrl: r.r2_content_url ?? undefined,
    rowId: r.row_id ?? undefined,
    rowI: r.row_i ?? undefined,
    rowCode: r.row_code ?? undefined,
    rowName: r.row_name ?? undefined,
  };
}
