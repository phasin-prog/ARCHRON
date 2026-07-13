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

// ---- Discriminated union types (Phase: Major Overhaul Slice 1) ----
import { z } from "zod";
import type {
  conceptSchema, personSchema, bookSchema, schoolSchema, articleSchema,
  symbolSchema, termSchema, readingSetSchema, sourceNoteSchema,
} from "@/types/content-schemas";

export type ConceptEntry = z.infer<typeof conceptSchema>;
export type PersonEntry = z.infer<typeof personSchema>;
export type BookEntry = z.infer<typeof bookSchema>;
export type SchoolEntry = z.infer<typeof schoolSchema>;
export type ArticleEntry = z.infer<typeof articleSchema>;
export type SymbolEntry = z.infer<typeof symbolSchema>;
export type TermEntry = z.infer<typeof termSchema>;
export type ReadingSetEntry = z.infer<typeof readingSetSchema>;
export type SourceNoteEntry = z.infer<typeof sourceNoteSchema>;

export type DiscriminatedEntry =
  | ConceptEntry | PersonEntry | BookEntry | SchoolEntry | ArticleEntry
  | SymbolEntry | TermEntry | ReadingSetEntry | SourceNoteEntry;

export function isConcept(e: DiscriminatedEntry): e is ConceptEntry { return e.contentType === "concept"; }
export function isPerson(e: DiscriminatedEntry): e is PersonEntry { return e.contentType === "person"; }
export function isBook(e: DiscriminatedEntry): e is BookEntry { return e.contentType === "book"; }
export function isSchool(e: DiscriminatedEntry): e is SchoolEntry { return e.contentType === "school"; }
export function isArticle(e: DiscriminatedEntry): e is ArticleEntry { return e.contentType === "article"; }
export function isSymbol(e: DiscriminatedEntry): e is SymbolEntry { return e.contentType === "symbol"; }
export function isTerm(e: DiscriminatedEntry): e is TermEntry { return e.contentType === "term"; }
export function isReadingSet(e: DiscriminatedEntry): e is ReadingSetEntry { return e.contentType === "reading-set"; }
export function isSourceNote(e: DiscriminatedEntry): e is SourceNoteEntry { return e.contentType === "source-note"; }
