import { colors } from "@/lib/content/colors";

export interface AcademicSeal {
  id: string;
  slug: string;
  name: string;
  nameThai: string;
  description: string;
  shape: "circle" | "octagon" | "hexagon" | "diamond" | "compass";
  color: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;
  category: "progression" | "domain" | "time" | "support";
  requirement: string;
}

export const SEALS: AcademicSeal[] = [
  // Level 1-2: Slate
  {
    id: "the-seeker",
    slug: "the-seeker",
    name: "The Seeker",
    nameThai: "ผู้แสวงหา",
    description: "จุดเริ่มต้น — การเข้าสู่ห้องสมุด",
    shape: "circle",
    color: colors.slateDark,
    level: 1,
    category: "progression",
    requirement: "สร้างบัญชีและอ่านบทความแรก",
  },
  {
    id: "the-reader",
    slug: "the-reader",
    name: "The Reader",
    nameThai: "ผู้อ่าน",
    description: "การอ่านอย่างต่อเนื่อง",
    shape: "circle",
    color: colors.slateDark,
    level: 2,
    category: "progression",
    requirement: "อ่าน 10 บทความครบถ้วน",
  },
  {
    id: "the-collector",
    slug: "the-collector",
    name: "The Collector",
    nameThai: "ผู้รวบรวม",
    description: "การเริ่มจัดระเบียบความรู้",
    shape: "hexagon",
    color: colors.slateDark,
    level: 2,
    category: "progression",
    requirement: "บันทึกบทความลง Collection ครั้งแรก",
  },
  // Level 3-4: Cardinal
  {
    id: "the-scholar",
    slug: "the-scholar",
    name: "The Scholar",
    nameThai: "นักวิชาการ",
    description: "ความเป็นนักวิชาการอย่างแท้จริง",
    shape: "octagon",
    color: colors.cardinalAcademic,
    level: 3,
    category: "progression",
    requirement: "อ่าน 100 บทความครบถ้วน",
  },
  {
    id: "the-analyst",
    slug: "the-analyst",
    name: "The Analyst",
    nameThai: "นักวิเคราะห์",
    description: "ความเข้าใจโครงสร้างความรู้",
    shape: "diamond",
    color: colors.cardinalAcademic,
    level: 4,
    category: "progression",
    requirement: "อ่าน Object ครบทั้ง 5 ประเภท",
  },
  {
    id: "the-explorer",
    slug: "the-explorer",
    name: "The Explorer",
    nameThai: "ผู้สำรวจ",
    description: "การสำรวจสาขาวิชาหลากหลาย",
    shape: "circle",
    color: colors.cardinalAcademic,
    level: 4,
    category: "progression",
    requirement: "อ่านบทความจาก 5 Domains ขึ้นไป",
  },
  {
    id: "the-archivist",
    slug: "the-archivist",
    name: "The Archivist",
    nameThai: "ผู้จัดเก็บ",
    description: "ผู้จัดเก็บและจัดระเบียบความรู้",
    shape: "hexagon",
    color: colors.cardinalAcademic,
    level: 4,
    category: "progression",
    requirement: "สร้าง Collection 5 ชุดขึ้นไป",
  },
  {
    id: "the-cartographer",
    slug: "the-cartographer",
    name: "The Cartographer",
    nameThai: "ผู้ทำแผนที่",
    description: "ผู้สร้างแผนที่ความรู้",
    shape: "hexagon",
    color: colors.cardinalAcademic,
    level: 4,
    category: "progression",
    requirement: "สร้าง Collection ที่มี Object มากกว่า 20 รายการ",
  },
  // Level 5-6: Silver
  {
    id: "the-curator",
    slug: "the-curator",
    name: "The Curator",
    nameThai: "ผู้ดูแล",
    description: "ผู้ดูแลคุณภาพความรู้ระดับสูง",
    shape: "octagon",
    color: colors.silverLight,
    level: 5,
    category: "progression",
    requirement: "Collection ของคุณถูก Featured โดย Editor",
  },
  {
    id: "the-sage",
    slug: "the-sage",
    name: "The Sage",
    nameThai: "ผู้รอบรู้",
    description: "ผู้รอบรู้ที่ปฏิบัติอย่างต่อเนื่อง",
    shape: "diamond",
    color: colors.silverLight,
    level: 6,
    category: "progression",
    requirement: "อ่านบทความ 500+ และสร้าง Collection 10+",
  },
  {
    id: "the-navigator",
    slug: "the-navigator",
    name: "The Navigator",
    nameThai: "ผู้นำทาง",
    description: "ผู้นำทางในโลกแห่งความคิด",
    shape: "circle",
    color: colors.silverLight,
    level: 6,
    category: "progression",
    requirement: "ใช้ Knowledge Graph สำรวจ Concept มากกว่า 50 รายการ",
  },
  {
    id: "the-luminary",
    slug: "the-luminary",
    name: "The Luminary",
    nameThai: "ผู้ส่องสว่าง",
    description: "ผู้ส่องสว่างให้ผู้อื่น",
    shape: "circle",
    color: colors.silverLight,
    level: 6,
    category: "progression",
    requirement: "ถึง Level 5 และมี Collection Featured 3+",
  },
  // Level 7: Gold
  {
    id: "the-architect",
    slug: "the-architect",
    name: "The Architect",
    nameThai: "ผู้สร้างสรรค์",
    description: "ผู้สร้างสรรค์และออกแบบโครงสร้างความรู้",
    shape: "octagon",
    color: colors.premium,
    level: 7,
    category: "progression",
    requirement: "ถึง Level 7 — Architect",
  },
  {
    id: "the-companion",
    slug: "the-companion",
    name: "The Companion",
    nameThai: "ผู้ร่วมเดินทาง",
    description: "ผู้สนับสนุน ผู้ร่วมเดินทาง",
    shape: "compass",
    color: colors.premium,
    level: 7,
    category: "support",
    requirement: "สนับสนุน ARCHRON ผ่าน Companion membership",
  },
  {
    id: "the-patron",
    slug: "the-patron",
    name: "The Patron",
    nameThai: "ผู้อุปถัมภ์",
    description: "ผู้อุปถัมภ์ระยะยาว",
    shape: "diamond",
    color: colors.premium,
    level: 7,
    category: "support",
    requirement: "สนับสนุน ARCHRON มากกว่า 1 ปี",
  },
];

export function getSealById(id: string): AcademicSeal | undefined {
  return SEALS.find((s) => s.id === id);
}

export function getSealsByLevel(level: AcademicSeal["level"]): AcademicSeal[] {
  return SEALS.filter((s) => s.level === level);
}

export function getSealsByCategory(category: AcademicSeal["category"]): AcademicSeal[] {
  return SEALS.filter((s) => s.category === category);
}
