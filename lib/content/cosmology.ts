// ARCHRON Content Colour Mapping — สีประจำประเภทเนื้อหา (Knowledge Categories palette)
// แม็ปสีตามประเภทเนื้อหา (single source of truth)
// ใช้สำหรับ badges / icons / graph nodes / per-content accent — ไม่ใช่สีหลักของ UI

export type Cosmology =
  | "prima"
  | "psyche"
  | "lumen"
  | "sapientia"
  | "mercurius"
  | "humanitas";

export const COSMOLOGY_ACCENT: Record<Cosmology, string> = {
  prima: "#8A8780",      // neutral
  psyche: "#5B7FAB",     // concept — Warm Blue
  lumen: "#C4A040",      // symbol — Gold
  sapientia: "#B58A5A",  // book — Amber
  mercurius: "#5A8A6A",  // thinker — Deep Green
  humanitas: "#7A9A7A",  // quote — Sage
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
  article: { icon: "newspaper", accent: "#AB6B7A", label: "บทความ" },
  concept: { icon: "psychology", accent: COSMOLOGY_ACCENT.psyche, label: "แนวคิด" },
  "reading-set": { icon: "layers", accent: "#6A7AB5", label: "ชุดอ่าน" },
  "source-note": { icon: "format_quote", accent: "#7A9A7A", label: "บันทึกแหล่งอ้างอิง" },
  person: { icon: "person", accent: COSMOLOGY_ACCENT.mercurius, label: "นักคิด" },
  book: { icon: "menu_book", accent: "#B58A5A", label: "หนังสือ" },
  school: { icon: "groups_2", accent: "#5A8A8A", label: "สำนักคิด" },
  symbol: { icon: "category", accent: COSMOLOGY_ACCENT.lumen, label: "สัญลักษณ์" },
  term: { icon: "tag", accent: "#8A8780", label: "คำศัพท์" },
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
const fallback = (): Meta => ({ icon: "circle", accent: "#8A8780" });

// Status — สถานะการเผยแพร่
const STATUS_META: Record<string, Meta> = {
  draft: { icon: "edit_note", accent: "#8A8780" },
  "needs-source-check": { icon: "report", accent: "#B55A5A" },
  "ready-to-publish": { icon: "schedule", accent: "#C48A30" },
  published: { icon: "check_circle", accent: "#4A8A5A" },
  archived: { icon: "inventory_2", accent: "#8A8780" },
};
export const statusMeta = (v: string): Meta => STATUS_META[v] ?? fallback();

// Difficulty — ระดับความลึก
const DIFFICULTY_META: Record<string, Meta> = {
  beginner: { icon: "eco", accent: "#4A8A5A" },
  intermediate: { icon: "trending_up", accent: "#5A7AAA" },
  advanced: { icon: "workspace_premium", accent: "#C48A30" },
  "source-note": { icon: "format_quote", accent: "#7A9A7A" },
};
export const difficultyMeta = (v: string): Meta => DIFFICULTY_META[v] ?? fallback();

// Source type — ชนิดแหล่งอ้างอิง
const SOURCE_TYPE_META: Record<string, Meta> = {
  "primary-source": { icon: "verified", accent: "#B58A5A" },
  "secondary-source": { icon: "menu_book", accent: "#5B7FAB" },
  commentary: { icon: "forum", accent: "#5A8A6A" },
  "editorial-interpretation": { icon: "edit_note", accent: "#AB6B7A" },
  website: { icon: "language", accent: "#5A7AAA" },
  "dictionary-lexicon": { icon: "import_contacts", accent: "#8A8780" },
  other: { icon: "more_horiz", accent: "#8A8780" },
};
export const sourceTypeMeta = (v: string): Meta => SOURCE_TYPE_META[v] ?? fallback();

// Framework — กรอบทฤษฎี → สีตามแขนง
const FRAMEWORK_META: Record<string, Meta> = {
  "Analytical Psychology": { icon: "psychology", accent: "#5B7FAB" },
  "Depth Psychology": { icon: "psychology_alt", accent: "#5B7FAB" },
  Psychoanalysis: { icon: "visibility", accent: "#5B7FAB" },
  Philosophy: { icon: "auto_stories", accent: "#B58A5A" },
  Existentialism: { icon: "self_improvement", accent: "#6A7A8A" },
  Phenomenology: { icon: "blur_on", accent: "#6A7A8A" },
  "Symbol / Myth": { icon: "category", accent: "#C4A040" },
  "Comparative Thought": { icon: "compare_arrows", accent: "#5A8A6A" },
  "Editorial Interpretation": { icon: "edit_note", accent: "#AB6B7A" },
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
      return "#B58A5A";
    case "school":
      return "#5A8A8A";
    case "symbol":
      return COSMOLOGY_ACCENT.lumen;
    case "term":
      return "#8A8780";
    default:
      return "#8B5E3C";
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
