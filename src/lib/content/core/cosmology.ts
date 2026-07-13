// ARCHRON Content Colour Mapping — สีประจำประเภทเนื้อหา (Knowledge Categories palette)
// แม็ปสีตามประเภทเนื้อหา (single source of truth)
// ใช้สำหรับ badges / icons / graph nodes / per-content accent — ไม่ใช่สีหลักของ UI
// Also contains: Knowledge Ontology (Phase 11) + Taxonomy System (Phase 15)

import { colors } from "@/lib/content/utils/colors";

export type Cosmology =
  | "prima"
  | "psyche"
  | "lumen"
  | "sapientia"
  | "mercurius"
  | "humanitas";

export const COSMOLOGY_ACCENT: Record<Cosmology, string> = {
  prima: colors.warmGray,      // neutral
  psyche: colors.softBlue,     // concept — Warm Blue
  lumen: colors.warmGold,      // symbol — Gold
  sapientia: colors.amberBrown, // book — Amber
  mercurius: colors.forestGreen, // thinker — Deep Green
  humanitas: colors.sageGreen,  // quote — Sage
};

export type CosmologyKey = Cosmology;

export const COSMOLOGY_KEYS: Record<CosmologyKey, { label: string; accent: string }> = {
  prima: { label: "Neutral", accent: COSMOLOGY_ACCENT.prima },
  psyche: { label: "Concept", accent: COSMOLOGY_ACCENT.psyche },
  lumen: { label: "Symbol", accent: COSMOLOGY_ACCENT.lumen },
  sapientia: { label: "Book", accent: COSMOLOGY_ACCENT.sapientia },
  mercurius: { label: "Thinker", accent: COSMOLOGY_ACCENT.mercurius },
  humanitas: { label: "Quote", accent: COSMOLOGY_ACCENT.humanitas },
};

// ประเภทเนื้อหา → ไอคอน (Material Symbols) + สีประจำหมวด
export type ContentTypeMeta = { icon: string; accent: string; label: string };

const CONTENT_TYPE_META: Record<string, ContentTypeMeta> = {
  article: { icon: "newspaper", accent: colors.roseMuted, label: "บทความ" },
  concept: { icon: "psychology", accent: COSMOLOGY_ACCENT.psyche, label: "แนวคิด" },
  "reading-set": { icon: "layers", accent: colors.indigoSoft, label: "ชุดอ่าน" },
  "source-note": { icon: "format_quote", accent: colors.sageGreen, label: "บันทึกแหล่งอ้างอิง" },
  person: { icon: "person", accent: COSMOLOGY_ACCENT.mercurius, label: "นักคิด" },
  book: { icon: "menu_book", accent: colors.amberBrown, label: "หนังสือ" },
  school: { icon: "groups_2", accent: colors.forestGreen, label: "สำนักคิด" },
  symbol: { icon: "category", accent: COSMOLOGY_ACCENT.lumen, label: "สัญลักษณ์" },
  term: { icon: "tag", accent: colors.warmGray, label: "คำศัพท์" },
};

export function contentTypeMeta(type: string | undefined | null): ContentTypeMeta {
  return (
    CONTENT_TYPE_META[type ?? ""] ?? {
      icon: "article",
      accent: COSMOLOGY_ACCENT.psyche,
      label: type || "ไม่ระบุ",
    }
  );
}

type Meta = { icon: string; accent: string };
const fallback = (): Meta => ({ icon: "circle", accent: colors.warmGray });

// Status — สถานะการเผยแพร่
const STATUS_META: Record<string, Meta> = {
  draft: { icon: "edit_note", accent: colors.warmGray },
  "needs-source-check": { icon: "report", accent: colors.redMuted },
  "ready-to-publish": { icon: "schedule", accent: colors.amberDark },
  published: { icon: "check_circle", accent: colors.greenForest },
  archived: { icon: "inventory_2", accent: colors.warmGray },
};
export const statusMeta = (v: string): Meta => STATUS_META[v] ?? fallback();

// Difficulty — ระดับความลึก
const DIFFICULTY_META: Record<string, Meta> = {
  beginner: { icon: "eco", accent: colors.greenForest },
  intermediate: { icon: "trending_up", accent: colors.blueSlate },
  advanced: { icon: "workspace_premium", accent: colors.amberDark },
  "source-note": { icon: "format_quote", accent: colors.sageGreen },
};
export const difficultyMeta = (v: string): Meta => DIFFICULTY_META[v] ?? fallback();

// Source type — ชนิดแหล่งอ้างอิง
const SOURCE_TYPE_META: Record<string, Meta> = {
  "primary-source": { icon: "verified", accent: colors.amberBrown },
  "secondary-source": { icon: "menu_book", accent: colors.softBlue },
  commentary: { icon: "forum", accent: colors.forestGreen },
  "editorial-interpretation": { icon: "edit_note", accent: colors.roseMuted },
  website: { icon: "language", accent: colors.blueSlate },
  "dictionary-lexicon": { icon: "import_contacts", accent: colors.warmGray },
  other: { icon: "more_horiz", accent: colors.warmGray },
};
export const sourceTypeMeta = (v: string): Meta => SOURCE_TYPE_META[v] ?? fallback();

// Framework — กรอบทฤษฎี → สีตามแขนง
const FRAMEWORK_META: Record<string, Meta> = {
  "Analytical Psychology": { icon: "psychology", accent: colors.softBlue },
  "Depth Psychology": { icon: "psychology_alt", accent: colors.softBlue },
  Psychoanalysis: { icon: "visibility", accent: colors.softBlue },
  Philosophy: { icon: "auto_stories", accent: colors.amberBrown },
  Existentialism: { icon: "self_improvement", accent: colors.mutedSlate },
  Phenomenology: { icon: "blur_on", accent: colors.mutedSlate },
  "Symbol / Myth": { icon: "category", accent: colors.warmGold },
  "Comparative Thought": { icon: "compare_arrows", accent: colors.forestGreen },
  "Editorial Interpretation": { icon: "edit_note", accent: colors.roseMuted },
};
export const frameworkMeta = (v: string): Meta => FRAMEWORK_META[v] ?? fallback();

// nodeType → สี accent
export function nodeTypeAccent(nodeType: string): string {
  switch (nodeType) {
    case "concept":
      return COSMOLOGY_ACCENT.psyche;
    case "person":
      return COSMOLOGY_ACCENT.mercurius;
    case "book":
      return colors.amberBrown;
    case "school":
      return colors.forestGreen;
    case "symbol":
      return COSMOLOGY_ACCENT.lumen;
    case "term":
      return colors.warmGray;
    default:
      return colors.amberBrown;
  }
}

// nodeType/contentType → Cosmology id
export function nodeTypeCosmology(nodeType: string | undefined | null): Cosmology {
  switch (nodeType) {
    case "concept":
      return "psyche";
    case "person":
    case "school":
      return "mercurius";
    case "symbol":
      return "prima";
    case "book":
      return "sapientia";
    case "term":
      return "humanitas";
    case "article":
      return "sapientia";
    default:
      return "sapientia";
  }
}

// Domain mapping (compat — สำหรับ components ที่ยังอ้างอิง domain)
export const DOMAIN_LABEL: Record<string, string> = {};
export function deriveDomain(_entry: unknown): string | null {
  return null;
}

// ============================================================================
// Knowledge Ontology (Phase 11) — formerly ontology.ts
// ============================================================================

import type { ContentEntry, ContentType } from "@/types/content";

export type KnowledgeObjectClass =
  | "concept"
  | "thinker"
  | "school"
  | "article"
  | "source"
  | "symbol"
  | "term"
  | "collection";

export type OntologyValidationResult = {
  valid: boolean;
  warnings: string[];
  cosmology: Cosmology;
  objectClass: KnowledgeObjectClass;
};

// ถอดรหัสคลาสวัตถุความรู้จาก contentType
export function classifyKnowledgeObject(type: ContentType | string | undefined): KnowledgeObjectClass {
  switch (type) {
    case "concept":
      return "concept";
    case "person":
      return "thinker";
    case "school":
      return "school";
    case "article":
      return "article";
    case "book":
    case "source-note":
      return "source";
    case "symbol":
      return "symbol";
    case "term":
      return "term";
    case "reading-set":
      return "collection";
    default:
      return "article";
  }
}

// ตรวจสอบความถูกต้องตามหลัก Knowledge Ontology ของ ARCHRON
export function validateOntologyEntry(entry: ContentEntry): OntologyValidationResult {
  const warnings: string[] = [];
  const objectClass = classifyKnowledgeObject(entry.contentType);
  const cosmology = nodeTypeCosmology(entry.contentType);

  if (!entry.title || entry.title.trim() === "") {
    warnings.push("ระเบียนความรู้ขาดหัวข้อเรื่องหลัก (Title missing)");
  }
  if (!entry.slug || !/^[a-z0-9-]+$/.test(entry.slug)) {
    warnings.push("รหัส Slug ไม่สอดคล้องกับระเบียบ URI มาตรฐาน (Slug format invalid)");
  }

  // กฎเฉพาะแต่ละคลาสความรู้
  if (objectClass === "concept") {
    if (!entry.shortDescription && !entry.subtitle) {
      warnings.push("มโนทัศน์ (Concept) ควรมีคำอธิบายสั้น (shortDescription หรือ subtitle)");
    }
  }

  if (objectClass === "article") {
    if (!entry.author && entry.status === "published") {
      warnings.push("บทความที่เผยแพร่แล้วควรมีผู้เขียนหรือองค์บรรณาธิการระบุไว้");
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
    cosmology,
    objectClass,
  };
}

// สรุปภาพรวมโครงสร้างความรู้ของระเบียน
export function getOntologySummary(entry: ContentEntry) {
  const validation = validateOntologyEntry(entry);
  return {
    id: entry.id,
    slug: entry.slug,
    objectClass: validation.objectClass,
    cosmology: validation.cosmology,
    relationsCount: entry.relatedConcepts?.length ?? 0,
    referencesCount: entry.references?.length ?? 0,
    isValid: validation.valid,
  };
}

// ============================================================================
// Taxonomy System (Phase 15) — formerly taxonomy.ts
// ============================================================================

import { DISCIPLINES } from "@/lib/content/core/seeds/disciplines";
import type { DisciplineKey } from "@/components/discipline-meta";
import { THEMES } from "@/lib/content/core/seeds/themes";

export type TaxonomyCluster = {
  key: string;
  label: string;
  description: string;
  entrySlugs: string[];
};

export type TaxonomyRegistry = {
  disciplines: Record<string, TaxonomyCluster>;
  themes: Record<string, TaxonomyCluster>;
  cosmologies: Record<string, TaxonomyCluster>;
};

// สกัดอนุกรมวิธานและจัดกลุ่ม entries ทั้งหมด
export function buildTaxonomyRegistry(entries: ContentEntry[]): TaxonomyRegistry {
  const publishedEntries = entries.filter((e) => e.status === "published");

  const discClusters: Record<string, TaxonomyCluster> = {};
  for (const disc of DISCIPLINES) {
    discClusters[disc.key] = {
      key: disc.key,
      label: disc.en,
      description: disc.desc,
      entrySlugs: publishedEntries
        .filter((e) => e.framework?.toLowerCase().includes(disc.key) || e.tags?.includes(disc.key))
        .map((e) => e.slug),
    };
  }

  const themeClusters: Record<string, TaxonomyCluster> = {};
  for (const t of THEMES) {
    themeClusters[t.key] = {
      key: t.key,
      label: t.label,
      description: t.description,
      entrySlugs: publishedEntries
        .filter((e) => e.tags?.some((tag) => t.aliases.includes(tag.toLowerCase())))
        .map((e) => e.slug),
    };
  }

  const cosmologyClusters: Record<string, TaxonomyCluster> = {};
  for (const [key, meta] of Object.entries(COSMOLOGY_KEYS)) {
    cosmologyClusters[key] = {
      key,
      label: meta.label,
      description: `Cosmology domain: ${meta.label}`,
      entrySlugs: publishedEntries.map((e) => e.slug),
    };
  }

  return {
    disciplines: discClusters,
    themes: themeClusters,
    cosmologies: cosmologyClusters,
  };
}
