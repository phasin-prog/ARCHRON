import type {
  DiscriminatedEntry,
  ArticleStatus,
  ContentType,
  Difficulty,
  RelatedConcept,
  SourceItem,
  Roots,
  RelatedCTA,
} from "@/types/content";

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
  subtitle: string | null;
  series: string | null;
  volume: string | null;
  aliases: string[] | null;
  born_year: string | null;
  died_year: string | null;
  nationality: string | null;
  key_ideas: string[] | null;
  notable_works: string[] | null;
  publication_year: string | null;
  publisher: string | null;
  isbn: string | null;
  founder: string | null;
  period: string | null;
  framework: string | null;
  main_thinkers: string[] | null;
  school: string | null;
  difficulty: string | null;
  tags: string[] | null;
  visual_explanation: string | null;
  technical_meaning: string | null;
  real_world_examples: string | null;
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

function buildBase(r: EntryRow) {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    status: r.status as ArticleStatus,
    author: r.author_name ?? undefined,
    publishedAt: r.published_at ?? undefined,
    updatedAt: r.updated_at ?? undefined,
    tags: r.tags ?? undefined,
    relatedConcepts: r.related_concepts ?? [],
    references: r.source_refs ?? [],
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

export function rowToEntry(r: EntryRow): DiscriminatedEntry {
  const ct = r.content_type as ContentType;
  const base = buildBase(r);

  switch (ct) {
    case "concept":
      return {
        ...base,
        contentType: "concept",
        mainTerm: r.main_term ?? "",
        thaiName: r.thai_name ?? "",
        originalTerm: r.original_term ?? undefined,
        partOfSpeech: r.part_of_speech ?? undefined,
        languageRoot: r.language_root ?? undefined,
        ipa: r.ipa ?? undefined,
        shortDescription: r.short_description ?? "",
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        subtitle: r.subtitle ?? undefined,
        series: r.series ?? undefined,
        volume: r.volume ?? undefined,
        aliases: r.aliases ?? undefined,
        visualExplanation: r.visual_explanation ?? undefined,
        technicalMeaning: r.technical_meaning ?? undefined,
        realWorldExamples: r.real_world_examples ?? undefined,
        roots: r.roots ?? undefined,
      };
    case "person":
      return {
        ...base,
        contentType: "person",
        mainTerm: r.main_term ?? "",
        thaiName: r.thai_name ?? undefined,
        bornYear: r.born_year ?? undefined,
        diedYear: r.died_year ?? undefined,
        nationality: r.nationality ?? undefined,
        keyIdeas: r.key_ideas ?? undefined,
        notableWorks: r.notable_works ?? undefined,
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
        visualExplanation: r.visual_explanation ?? undefined,
        technicalMeaning: r.technical_meaning ?? undefined,
      };
    case "book":
      return {
        ...base,
        contentType: "book",
        mainTerm: r.main_term ?? undefined,
        thaiName: r.thai_name ?? undefined,
        publicationYear: r.publication_year ?? undefined,
        publisher: r.publisher ?? undefined,
        isbn: r.isbn ?? undefined,
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
      };
    case "school":
      return {
        ...base,
        contentType: "school",
        mainTerm: r.main_term ?? undefined,
        thaiName: r.thai_name ?? undefined,
        founder: r.founder ?? undefined,
        period: r.period ?? undefined,
        keyIdeas: r.key_ideas ?? undefined,
        framework: r.framework ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
      };
    case "article":
      return {
        ...base,
        contentType: "article",
        subtitle: r.subtitle ?? undefined,
        series: r.series ?? undefined,
        volume: r.volume ?? undefined,
        framework: r.framework ?? undefined,
        mainThinkers: r.main_thinkers ?? undefined,
        school: r.school ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
        shortDescription: r.short_description ?? undefined,
        visualExplanation: r.visual_explanation ?? undefined,
        technicalMeaning: r.technical_meaning ?? undefined,
      };
    case "symbol":
      return {
        ...base,
        contentType: "symbol",
        mainTerm: r.main_term ?? undefined,
        thaiName: r.thai_name ?? undefined,
        shortDescription: r.short_description ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
      };
    case "term":
      return {
        ...base,
        contentType: "term",
        mainTerm: r.main_term ?? "",
        thaiName: r.thai_name ?? undefined,
        originalTerm: r.original_term ?? undefined,
        languageRoot: r.language_root ?? undefined,
        partOfSpeech: r.part_of_speech ?? undefined,
        shortDescription: r.short_description ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
      };
    case "reading-set":
      return {
        ...base,
        contentType: "reading-set",
        subtitle: r.subtitle ?? undefined,
        shortDescription: r.short_description ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
      };
    case "source-note":
      return {
        ...base,
        contentType: "source-note",
        shortDescription: r.short_description ?? undefined,
        difficulty: (r.difficulty ?? undefined) as Difficulty | undefined,
      };
    default:
      return {
        ...base,
        contentType: "article",
        shortDescription: r.short_description ?? undefined,
      } as DiscriminatedEntry;
  }
}
