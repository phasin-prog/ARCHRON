// ARCHRON — Themes (B1) · แก่นเรื่องข้ามศาสตร์
// ต่อยอดบน entry.tags ที่มีอยู่ (ไม่เพิ่มคอลัมน์ DB) — theme = ชุด tag ที่คัดสรร
// ใช้แสดง "ชิปแก่นเรื่อง" บนหน้าอ่าน และเชื่อมเนื้อหาต่างศาสตร์ที่พูดถึงแก่นเดียวกัน

import { colors } from "@/lib/content/utils/colors";
import type { ContentEntry } from "@/types/content";

export type Theme = {
  key: string;
  label: string; // ชื่อไทยสำหรับแสดงผล
  description: string;
  accent: string; // สีตาม cosmology
  aliases: string[]; // tag/คำที่นับว่าเป็นแก่นนี้ (เทียบแบบไม่สนตัวพิมพ์)
};

export const THEMES: Theme[] = [
  {
    key: "unconscious",
    label: "จิตไร้สำนึก",
    description: "ชั้นของจิตที่อยู่นอกเหนือการรู้ตัว และอิทธิพลที่มีต่อชีวิต",
    accent: colors.steelBlue,
    aliases: ["unconscious", "collective-unconscious", "จิตไร้สำนึก"],
  },
  {
    key: "shadow",
    label: "เงา",
    description: "ด้านที่ถูกปฏิเสธหรือไม่ยอมรับของตัวตน",
    accent: colors.ashGray,
    aliases: ["shadow", "เงา"],
  },
  {
    key: "self",
    label: "ตัวตน",
    description: "หัวข้อที่ใช้จัดกลุ่มเนื้อหาซึ่งกล่าวถึง Self, Ego และ Persona",
    accent: colors.amberGold,
    aliases: ["self", "ego", "persona", "ตัวตน", "อัตตา"],
  },
  {
    key: "individuation",
    label: "การเป็นปัจเจก (Individuation)",
    description: "กระบวนการ Individuation ในจิตวิทยาวิเคราะห์",
    accent: colors.tealGreen,
    aliases: ["individuation", "awakening", "การตื่นรู้"],
  },
  {
    key: "meaning",
    label: "ความหมาย",
    description: "การแสวงหาและสร้างความหมายของการมีอยู่",
    accent: colors.ochreGold,
    aliases: ["meaning", "ความหมาย"],
  },
  {
    key: "freedom",
    label: "เสรีภาพ",
    description: "อิสรภาพ การเลือก และความรับผิดชอบของมนุษย์",
    accent: colors.sageDarker,
    aliases: ["freedom", "เสรีภาพ"],
  },
  {
    key: "existence",
    label: "การดำรงอยู่",
    description: "คำถามต่อการมีอยู่ ความตาย และเงื่อนไขของชีวิต",
    accent: colors.silverGray,
    aliases: ["existence", "existentialism", "การดำรงอยู่"],
  },
  {
    key: "symbol-myth",
    label: "สัญลักษณ์และตำนาน",
    description: "ภาพแทน เรื่องเล่า และแบบแผนร่วมของมนุษยชาติ",
    accent: colors.silverGray,
    aliases: ["symbol", "myth", "archetype", "สัญลักษณ์", "ตำนาน"],
  },
];

const norm = (s: string) => s.trim().toLowerCase();

// แก่นเรื่องของ entry — เทียบ entry.tags กับ aliases ของแต่ละ theme
export function themesForEntry(entry: ContentEntry): Theme[] {
  const tags = (entry.tags ?? []).map(norm);
  if (tags.length === 0) return [];
  return THEMES.filter((t) => t.aliases.some((a) => tags.includes(norm(a))));
}

export function themeByKey(key: string): Theme | undefined {
  return THEMES.find((t) => t.key === key);
}

// entry นี้อยู่ในแก่นเรื่อง key หรือไม่
export function entryHasTheme(entry: ContentEntry, key: string): boolean {
  return themesForEntry(entry).some((t) => t.key === key);
}

// entries ทั้งหมดที่อยู่ในแก่นเรื่อง key (ข้ามศาสตร์)
export function entriesForTheme(entries: ContentEntry[], key: string): ContentEntry[] {
  return entries.filter((e) => entryHasTheme(e, key));
}

// slug tag ที่ใช้แทนแก่นเรื่อง (ใช้เติมใน TAG_OPTIONS ของ editor)
export const THEME_TAG_SUGGESTIONS = THEMES.map((t) => t.aliases[0]);
