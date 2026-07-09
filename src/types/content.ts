// types/content.ts — Content Model (Phase 3)
// อ้างอิง Content Architecture v0.1 + Reading Page Template v1
// Concept Registry (node schema) กำหนดเต็มใน Phase 7 (Wiki Architecture)

export type ArticleStatus =
  | "draft"
  | "needs-source-check"
  | "ready-to-publish"
  | "published"
  | "archived";

export type ContentType =
  | "article"
  | "concept"
  | "reading-set"
  | "source-note"
  | "person"
  | "book"
  | "school"
  | "symbol"
  | "term";

export type Difficulty =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "source-note";

export type RelationType =
  | "prerequisite"
  | "related"
  | "contrasts-with"
  | "part-of"
  | "source-of"
  | "used-in"
  | "influenced-by";

export type SourceType =
  | "primary-source"
  | "secondary-source"
  | "commentary"
  | "editorial-interpretation"
  | "website"
  | "dictionary-lexicon"
  | "other";

export type RelatedConcept = {
  conceptSlug: string;
  relationType: RelationType;
  reason?: string;
};

export type SourceItem = {
  sourceType: SourceType;
  author?: string;
  title: string;
  year?: string;
  pageOrSection?: string;
  citationNote?: string;
  relatedClaim?: string;
};

export type Roots = {
  etymology?: string;
  historicalUsage?: string;
  meaningShift?: string;
  caution?: string;
};

export type RelatedCTA = {
  articleSlugs?: string[];
  conceptSlugs?: string[];
  readingSetSlugs?: string[];
  sourceNoteSlugs?: string[];
  showConstellationMap?: boolean;
};

export type ContentEntry = {
  id: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  contentType: ContentType;

  author?: string;
  publishedAt?: string;
  updatedAt?: string;

  // Concept Identity Block
  mainTerm?: string;
  thaiName?: string;
  originalTerm?: string;
  partOfSpeech?: string;
  languageRoot?: string;
  ipa?: string;
  shortDescription?: string;
  subtitle?: string;
  series?: string;
  volume?: string;
  aliases?: string[];
  bornYear?: string;
  diedYear?: string;
  nationality?: string;
  keyIdeas?: string[];
  notableWorks?: string[];
  publicationYear?: string;
  publisher?: string;
  isbn?: string;
  founder?: string;
  period?: string;
  academicOrigins?: { original?: string; language?: string; meaning?: string }[];
  version?: string;

  // Framework / Theory
  framework?: string;
  mainThinkers?: string[];
  school?: string;
  difficulty?: Difficulty;
  tags?: string[];

  // Reading sections
  visualExplanation?: string;
  technicalMeaning?: string;
  realWorldExamples?: string; // ตัวอย่างในชีวิตจริง อิงจากตำรา (Header 3 · รอเติมใน mapper/DB ภายหลัง)

  // Relations & references
  relatedConcepts: RelatedConcept[];
  references: SourceItem[];

  roots?: Roots;
  relatedCTA?: RelatedCTA;
  bodyMarkdown?: string;
  coverImage?: string;
  r2ContentKey?: string;
  r2ContentUrl?: string;
  rowId?: string;
  rowI?: number;
  rowCode?: string;
  rowName?: string;
};
