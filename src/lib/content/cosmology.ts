// ARCHRON Content Colour Mapping — สีประจำประเภทเนื้อหา (Knowledge Categories palette)
// แม็ปสีตามประเภทเนื้อหา (single source of truth)
// ใช้สำหรับ badges / icons / graph nodes / per-content accent — ไม่ใช่สีหลักของ UI

import { colors } from "@/lib/content/colors";

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
