// ARCHRON Material Cosmology — Dynamic Colour
// แม็ปสีตามบริบท (เส้นทาง/หมวด) ตาม Color Cosmology v2 (ค่าปรับให้สว่างพอบนพื้นมืด)
// Single source of truth: route → Cosmology id → variable ชุด (CSS ที่ globals.css อ่าน)

// Cosmology id — ใช้ตั้ง data-cosmology บน <html> และ archron-card--{cosmology} class
export type Cosmology =
  | "prima"
  | "psyche"
  | "lumen"
  | "sapientia"
  | "mercurius"
  | "humanitas";

export const COSMOLOGY_ACCENT: Record<Cosmology, string> = {
  prima: "#B9C2CE", // Prima Materia (ตำนาน/สัญลักษณ์/แผนที่)
  psyche: "#6E93A8", // Psyche (จิตวิทยา/การวิเคราะห์)
  lumen: "#E7D7A6", // Lumen (ปฏิญญา/แสงแห่งความเข้าใจ)
  sapientia: "#CBA45A", // Sapientia (ปรัชญา/บทความ/ปัญญา)
  mercurius: "#8AA395", // Mercurius (สำนักคิด/ภาษา/การแปรเปลี่ยน)
  humanitas: "#C9C2B4", // Humanitas (มานุษยวิทยา/วัฒนธรรม — สว่างนวลบนพื้นมืด)
};

export type CosmologyKey = Cosmology;

export const COSMOLOGY_KEYS: Record<CosmologyKey, { label: string; accent: string }> = {
  prima: { label: "Prima Materia", accent: COSMOLOGY_ACCENT.prima },
  psyche: { label: "Psyche", accent: COSMOLOGY_ACCENT.psyche },
  lumen: { label: "Lumen", accent: COSMOLOGY_ACCENT.lumen },
  sapientia: { label: "Sapientia", accent: COSMOLOGY_ACCENT.sapientia },
  mercurius: { label: "Mercurius", accent: COSMOLOGY_ACCENT.mercurius },
  humanitas: { label: "Humanitas", accent: COSMOLOGY_ACCENT.humanitas },
};

const DEFAULT_COSMOLOGY: Cosmology = "sapientia";
const DEFAULT_ACCENT = COSMOLOGY_ACCENT[DEFAULT_COSMOLOGY]; // Sapientia (หน้าแรก/ทั่วไป)

// เส้นทาง → cosmology ประจำบริบท (single source of truth)
export function routeCosmology(pathname: string): Cosmology {
  const p = pathname || "/";
  if (p.startsWith("/concepts")) return "psyche";
  if (p.startsWith("/schools")) return "mercurius";
  if (p.startsWith("/constellation")) return "prima";
  if (p.startsWith("/manifesto")) return "lumen";
  if (p.startsWith("/reading-sets")) return "sapientia";
  if (p.startsWith("/articles")) return "sapientia";
  if (p.startsWith("/sources")) return "sapientia";
  if (p.startsWith("/knowledge")) return "sapientia";
  if (p.startsWith("/guide")) return "mercurius";
  if (p.startsWith("/external-links")) return "mercurius";
  if (p.startsWith("/studio")) return DEFAULT_COSMOLOGY; // Studio = Sapientia (เวิร์กช็อป)
  return DEFAULT_COSMOLOGY;
}

// คง API เดิมไว้ — อ่าน accent จาก cosmology (เพื่อความเข้ากันได้กับโค้ดที่ใช้ routeAccent อยู่)
export function routeAccent(pathname: string): string {
  return COSMOLOGY_ACCENT[routeCosmology(pathname)];
}

// ประเภทเนื้อหา → ไอคอน (Material Symbols) + สีประจำหมวดตาม cosmology
export type ContentTypeMeta = { icon: string; accent: string; label: string };

const CONTENT_TYPE_META: Record<string, ContentTypeMeta> = {
  article: { icon: "newspaper", accent: COSMOLOGY_ACCENT.sapientia, label: "บทความ" },
  concept: { icon: "psychology", accent: COSMOLOGY_ACCENT.psyche, label: "แนวคิด" },
  "reading-set": { icon: "layers", accent: "#C9A24A", label: "ชุดอ่าน" },
  "source-note": { icon: "format_quote", accent: "#9A948A", label: "บันทึกแหล่งอ้างอิง" },
  person: { icon: "person", accent: COSMOLOGY_ACCENT.mercurius, label: "นักคิด" },
  book: { icon: "menu_book", accent: "#C9A24A", label: "หนังสือ" },
  school: { icon: "groups_2", accent: "#7FB08A", label: "สำนักคิด" },
  symbol: { icon: "category", accent: COSMOLOGY_ACCENT.prima, label: "สัญลักษณ์" },
  term: { icon: "tag", accent: "#9A948A", label: "คำศัพท์" },
};

export function contentTypeMeta(type: string | undefined | null): ContentTypeMeta {
  return (
    CONTENT_TYPE_META[type ?? ""] ?? {
      icon: "article",
      accent: DEFAULT_ACCENT,
      label: type || "ไม่ระบุ",
    }
  );
}

type Meta = { icon: string; accent: string };
const fallback = (): Meta => ({ icon: "circle", accent: DEFAULT_ACCENT });

// Status — สถานะการเผยแพร่
const STATUS_META: Record<string, Meta> = {
  draft: { icon: "edit_note", accent: "#9A948A" }, // เทา — ร่าง
  "needs-source-check": { icon: "report", accent: "#C9776A" }, // แดง — ต้องตรวจแหล่ง
  "ready-to-publish": { icon: "schedule", accent: "#D8B56A" }, // เหลือง — รอเผยแพร่
  published: { icon: "check_circle", accent: "#7FB08A" }, // เขียว — เผยแพร่แล้ว
  archived: { icon: "inventory_2", accent: "#8A857D" }, // เทาจาง — เก็บเข้าคลัง
};
export const statusMeta = (v: string): Meta => STATUS_META[v] ?? fallback();

// Difficulty — ระดับความลึก
const DIFFICULTY_META: Record<string, Meta> = {
  beginner: { icon: "eco", accent: "#7FB08A" },
  intermediate: { icon: "trending_up", accent: "#6E93A8" },
  advanced: { icon: "workspace_premium", accent: "#CBA45A" },
  "source-note": { icon: "format_quote", accent: "#9A948A" },
};
export const difficultyMeta = (v: string): Meta => DIFFICULTY_META[v] ?? fallback();

// Source type — ชนิดแหล่งอ้างอิง
const SOURCE_TYPE_META: Record<string, Meta> = {
  "primary-source": { icon: "verified", accent: "#CBA45A" },
  "secondary-source": { icon: "menu_book", accent: "#6E93A8" },
  commentary: { icon: "forum", accent: "#8AA395" },
  "editorial-interpretation": { icon: "edit_note", accent: "#C9A24A" },
  website: { icon: "language", accent: "#6E93A8" },
  "dictionary-lexicon": { icon: "import_contacts", accent: "#9A948A" },
  other: { icon: "more_horiz", accent: "#8A857D" },
};
export const sourceTypeMeta = (v: string): Meta => SOURCE_TYPE_META[v] ?? fallback();

// Framework — กรอบทฤษฎี → สีตามแขนงใน cosmology
const FRAMEWORK_META: Record<string, Meta> = {
  "Analytical Psychology": { icon: "psychology", accent: "#6E93A8" },
  "Depth Psychology": { icon: "psychology_alt", accent: "#6E93A8" },
  Psychoanalysis: { icon: "visibility", accent: "#6E93A8" },
  Philosophy: { icon: "auto_stories", accent: "#CBA45A" },
  Existentialism: { icon: "self_improvement", accent: "#B9C2CE" },
  Phenomenology: { icon: "blur_on", accent: "#B9C2CE" },
  "Symbol / Myth": { icon: "category", accent: "#B9C2CE" },
  "Comparative Thought": { icon: "compare_arrows", accent: "#8AA395" },
  "Editorial Interpretation": { icon: "edit_note", accent: "#C9A24A" },
};
export const frameworkMeta = (v: string): Meta => FRAMEWORK_META[v] ?? fallback();

// nodeType → สี accent (สำหรับหน้า/การ์ดที่อิงประเภทเนื้อหา)
export function nodeTypeAccent(nodeType: string): string {
  switch (nodeType) {
    case "concept":
      return COSMOLOGY_ACCENT.psyche;
    case "person":
      return COSMOLOGY_ACCENT.mercurius;
    case "book":
      return "#C9A24A";
    case "school":
      return "#7FB08A";
    case "symbol":
      return COSMOLOGY_ACCENT.prima;
    case "term":
      return "#9A948A";
    default:
      return DEFAULT_ACCENT;
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
