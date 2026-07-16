import type { EditorDraft } from "@/lib/content/publishing/publish-validation";
import type {
  ArticleStatus,
  ContentType,
  Difficulty,
  DiscriminatedEntry,
  RelationType,
  SourceType,
} from "@/types/content";

const ARTICLE_STATUSES = new Set<ArticleStatus>([
  "draft",
  "needs-source-check",
  "ready-to-publish",
  "published",
  "archived",
]);

const CONTENT_TYPES = new Set<ContentType>([
  "article",
  "concept",
  "reading-set",
  "source-note",
  "person",
  "book",
  "symbol",
  "term",
]);

const DIFFICULTIES = new Set<Difficulty>([
  "beginner",
  "intermediate",
  "advanced",
  "source-note",
]);

const RELATION_TYPES = new Set<RelationType>([
  "prerequisite",
  "related",
  "contrasts-with",
  "part-of",
  "source-of",
  "used-in",
  "influenced-by",
]);

const SOURCE_TYPES = new Set<SourceType>([
  "primary-source",
  "secondary-source",
  "commentary",
  "editorial-interpretation",
  "website",
  "dictionary-lexicon",
  "other",
]);

function optionalText(value: string): string | undefined {
  return value === "" ? undefined : value;
}

function commaSeparatedList(value: string): string[] | undefined {
  const items = value.split(",").map((item) => item.trim()).filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function singleItemList(value: string): string[] | undefined {
  const item = optionalText(value);
  return item ? [item] : undefined;
}

function normalizeStatus(value: string): ArticleStatus {
  return ARTICLE_STATUSES.has(value as ArticleStatus) ? value as ArticleStatus : "draft";
}

function normalizeContentType(value: string): ContentType {
  return CONTENT_TYPES.has(value as ContentType) ? value as ContentType : "article";
}

function normalizeDifficulty(value: string): Difficulty {
  return DIFFICULTIES.has(value as Difficulty) ? value as Difficulty : "beginner";
}

function normalizeRelationType(value: string): RelationType {
  return RELATION_TYPES.has(value as RelationType) ? value as RelationType : "related";
}

function normalizeSourceType(value: string): SourceType {
  return SOURCE_TYPES.has(value as SourceType) ? value as SourceType : "other";
}

/**
 * Creates the same serializable entry shape that public reading components receive,
 * without reading from the database or changing the draft. It is safe to call from
 * Studio client components.
 */
export function draftToPreviewEntry(
  draft: EditorDraft,
  authorName?: string | null,
): DiscriminatedEntry {
  const contentType = normalizeContentType(draft.contentType);
  const relatedCTA = {
    articleSlugs: draft.articleSlugs?.length ? [...draft.articleSlugs] : undefined,
    conceptSlugs: draft.conceptSlugs?.length ? [...draft.conceptSlugs] : undefined,
    readingSetSlugs: draft.readingSetSlugs?.length ? [...draft.readingSetSlugs] : undefined,
  };
  const hasRelatedCTA = Object.values(relatedCTA).some(Boolean);
  const roots = {
    etymology: optionalText(draft.rootsEtymology),
    meaningShift: optionalText(draft.rootsMeaningShift),
    caution: optionalText(draft.rootsCaution),
  };
  const hasRoots = Object.values(roots).some(Boolean);

  const base = {
    id: draft.id,
    title: draft.title,
    slug: draft.slug,
    status: normalizeStatus(draft.status),
    author: optionalText(authorName?.trim() ?? ""),
    tags: draft.tags.length > 0 ? [...draft.tags] : undefined,
    relatedConcepts: draft.relatedConcepts.map((relation) => ({
      conceptSlug: relation.conceptSlug,
      relationType: normalizeRelationType(relation.relationType),
      reason: optionalText(relation.reason),
    })),
    references: draft.references.map((reference) => ({
      sourceType: normalizeSourceType(reference.sourceType),
      title: reference.title,
      relatedClaim: optionalText(reference.relatedClaim),
    })),
    relatedCTA: hasRelatedCTA ? relatedCTA : undefined,
    bodyMarkdown: optionalText(draft.bodyMarkdown),
    coverImage: optionalText(draft.coverImage),
    rowCode: optionalText(draft.rowCode),
    rowName: optionalText(draft.rowName),
  };
  const common = {
    framework: optionalText(draft.framework),
    difficulty: normalizeDifficulty(draft.difficulty),
    shortDescription: optionalText(draft.shortDescription),
  };

  switch (contentType) {
    case "concept":
      return {
        ...base,
        ...common,
        contentType: "concept",
        mainTerm: draft.mainTerm,
        thaiName: draft.thaiName,
        shortDescription: draft.shortDescription,
        originalTerm: optionalText(draft.originalTerm),
        partOfSpeech: optionalText(draft.partOfSpeech),
        languageRoot: optionalText(draft.languageRoot),
        ipa: optionalText(draft.ipa),
        mainThinkers: singleItemList(draft.mainThinker),
        school: optionalText(draft.school),
        visualExplanation: optionalText(draft.visualExplanation),
        technicalMeaning: optionalText(draft.technicalMeaning),
        realWorldExamples: optionalText(draft.realWorldExamples),
        roots: hasRoots ? roots : undefined,
      };
    case "person":
      return {
        ...base,
        ...common,
        contentType: "person",
        mainTerm: draft.mainTerm,
        thaiName: optionalText(draft.thaiName),
        originalTerm: optionalText(draft.originalTerm),
        ipa: optionalText(draft.ipa),
        bornYear: optionalText(draft.bornYear),
        diedYear: optionalText(draft.diedYear),
        nationality: optionalText(draft.nationality),
        keyIdeas: commaSeparatedList(draft.keyIdeas),
        notableWorks: commaSeparatedList(draft.notableWorks),
        mainThinkers: singleItemList(draft.mainThinker),
        school: optionalText(draft.school),
        visualExplanation: optionalText(draft.visualExplanation),
        technicalMeaning: optionalText(draft.technicalMeaning),
        realWorldExamples: optionalText(draft.realWorldExamples),
      };
    case "book":
      return {
        ...base,
        ...common,
        contentType: "book",
        mainTerm: optionalText(draft.mainTerm),
        thaiName: optionalText(draft.thaiName),
        publicationYear: optionalText(draft.publicationYear),
        publisher: optionalText(draft.publisher),
        isbn: optionalText(draft.isbn),
        mainThinkers: singleItemList(draft.mainThinker),
      };
    case "symbol":
      return {
        ...base,
        ...common,
        contentType: "symbol",
        mainTerm: optionalText(draft.mainTerm),
        thaiName: optionalText(draft.thaiName),
      };
    case "term":
      return {
        ...base,
        ...common,
        contentType: "term",
        mainTerm: draft.mainTerm,
        thaiName: optionalText(draft.thaiName),
        originalTerm: optionalText(draft.originalTerm),
        languageRoot: optionalText(draft.languageRoot),
        partOfSpeech: optionalText(draft.partOfSpeech),
      };
    case "reading-set":
      return {
        ...base,
        ...common,
        contentType: "reading-set",
      };
    case "source-note":
      return {
        ...base,
        ...common,
        contentType: "source-note",
      };
    case "article":
    default:
      return {
        ...base,
        ...common,
        contentType: "article",
        mainThinkers: singleItemList(draft.mainThinker),
        school: optionalText(draft.school),
        visualExplanation: optionalText(draft.visualExplanation),
        technicalMeaning: optionalText(draft.technicalMeaning),
      };
  }
}
