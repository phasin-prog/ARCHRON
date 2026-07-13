import { z } from "zod";

export const relationTypeEnum = z.enum([
  "prerequisite", "related", "contrasts-with", "part-of", "source-of", "used-in", "influenced-by",
]);
export const sourceTypeEnum = z.enum([
  "primary-source", "secondary-source", "commentary", "editorial-interpretation",
  "website", "dictionary-lexicon", "other",
]);
export const difficultyEnum = z.enum(["beginner", "intermediate", "advanced", "source-note"]);
export const articleStatusEnum = z.enum([
  "draft", "needs-source-check", "ready-to-publish", "published", "archived",
]);

export const relatedConceptSchema = z.object({
  conceptSlug: z.string(),
  relationType: relationTypeEnum,
  reason: z.string().optional(),
});

export const sourceItemSchema = z.object({
  sourceType: sourceTypeEnum,
  author: z.string().optional(),
  title: z.string(),
  year: z.string().optional(),
  pageOrSection: z.string().optional(),
  citationNote: z.string().optional(),
  relatedClaim: z.string().optional(),
});

export const rootsSchema = z.object({
  etymology: z.string().optional(),
  historicalUsage: z.string().optional(),
  meaningShift: z.string().optional(),
  caution: z.string().optional(),
});

export const relatedCtaSchema = z.object({
  articleSlugs: z.array(z.string()).optional(),
  conceptSlugs: z.array(z.string()).optional(),
  readingSetSlugs: z.array(z.string()).optional(),
  sourceNoteSlugs: z.array(z.string()).optional(),
  showConstellationMap: z.boolean().optional(),
});

export const baseEntryFields = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  status: articleStatusEnum,
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  relatedConcepts: z.array(relatedConceptSchema),
  references: z.array(sourceItemSchema),
  relatedCTA: relatedCtaSchema.optional(),
  bodyMarkdown: z.string().optional(),
  coverImage: z.string().optional(),
  r2ContentKey: z.string().optional(),
  r2ContentUrl: z.string().optional(),
  rowId: z.string().optional(),
  rowI: z.number().optional(),
  rowCode: z.string().optional(),
  rowName: z.string().optional(),
});

export const conceptSchema = baseEntryFields.extend({
  contentType: z.literal("concept"),
  mainTerm: z.string(),
  thaiName: z.string(),
  originalTerm: z.string().optional(),
  partOfSpeech: z.string().optional(),
  languageRoot: z.string().optional(),
  ipa: z.string().optional(),
  shortDescription: z.string(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  subtitle: z.string().optional(),
  series: z.string().optional(),
  volume: z.string().optional(),
  aliases: z.array(z.string()).optional(),
  visualExplanation: z.string().optional(),
  technicalMeaning: z.string().optional(),
  realWorldExamples: z.string().optional(),
  roots: rootsSchema.optional(),
});

export const personSchema = baseEntryFields.extend({
  contentType: z.literal("person"),
  mainTerm: z.string(),
  thaiName: z.string().optional(),
  bornYear: z.string().optional(),
  diedYear: z.string().optional(),
  nationality: z.string().optional(),
  keyIdeas: z.array(z.string()).optional(),
  notableWorks: z.array(z.string()).optional(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
  visualExplanation: z.string().optional(),
  technicalMeaning: z.string().optional(),
});

export const bookSchema = baseEntryFields.extend({
  contentType: z.literal("book"),
  mainTerm: z.string().optional(),
  thaiName: z.string().optional(),
  publicationYear: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
  author: z.string().optional(),
});

export const schoolSchema = baseEntryFields.extend({
  contentType: z.literal("school"),
  mainTerm: z.string().optional(),
  thaiName: z.string().optional(),
  founder: z.string().optional(),
  period: z.string().optional(),
  keyIdeas: z.array(z.string()).optional(),
  framework: z.string().optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
});

export const articleSchema = baseEntryFields.extend({
  contentType: z.literal("article"),
  subtitle: z.string().optional(),
  series: z.string().optional(),
  volume: z.string().optional(),
  framework: z.string().optional(),
  mainThinkers: z.array(z.string()).optional(),
  school: z.string().optional(),
  difficulty: difficultyEnum.optional(),
  shortDescription: z.string().optional(),
  visualExplanation: z.string().optional(),
  technicalMeaning: z.string().optional(),
});

export const symbolSchema = baseEntryFields.extend({
  contentType: z.literal("symbol"),
  mainTerm: z.string().optional(),
  thaiName: z.string().optional(),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const termSchema = baseEntryFields.extend({
  contentType: z.literal("term"),
  mainTerm: z.string(),
  thaiName: z.string().optional(),
  originalTerm: z.string().optional(),
  languageRoot: z.string().optional(),
  partOfSpeech: z.string().optional(),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const readingSetSchema = baseEntryFields.extend({
  contentType: z.literal("reading-set"),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const sourceNoteSchema = baseEntryFields.extend({
  contentType: z.literal("source-note"),
  shortDescription: z.string().optional(),
  difficulty: difficultyEnum.optional(),
});

export const entrySchema = z.discriminatedUnion("contentType", [
  conceptSchema, personSchema, bookSchema, schoolSchema, articleSchema,
  symbolSchema, termSchema, readingSetSchema, sourceNoteSchema,
]);
