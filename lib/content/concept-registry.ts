// Concept Registry (Phase 7) — ฐานกลางของแนวคิด/นักคิด/หนังสือ/สำนัก/สัญลักษณ์/คำศัพท์
// ใช้เป็นฐานของ related concepts, backlinks, internal link suggestions และ Constellation Map

export type NodeType =
  | "concept"
  | "person"
  | "book"
  | "school"
  | "symbol"
  | "term";

export type ConceptRegistryItem = {
  id: string;
  title: string;
  slug: string;
  thaiTitle?: string;
  aliases: string[];
  nodeType: NodeType;
  framework?: string;
  description?: string;
};

export const conceptRegistry: ConceptRegistryItem[] = [
  {
    id: "concept-psyche",
    title: "Psyche",
    slug: "psyche",
    thaiTitle: "ไซคี",
    aliases: ["Psyche", "ไซคี", "psukhe"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "ระบบชีวิตทางจิตทั้งหมด ทั้งส่วนที่รู้ตัวและไม่รู้ตัว",
  },
  {
    id: "concept-ego",
    title: "Ego",
    slug: "ego",
    thaiTitle: "อัตตา",
    aliases: ["Ego", "อัตตา"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "ศูนย์กลางของจิตสำนึก",
  },
  {
    id: "concept-shadow",
    title: "Shadow",
    slug: "shadow",
    thaiTitle: "เงา",
    aliases: ["Shadow", "เงา", "Jungian Shadow"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "ส่วนของชีวิตภายในที่ Ego ไม่ต้องการรับรู้หรือยอมรับ",
  },
  {
    id: "concept-persona",
    title: "Persona",
    slug: "persona",
    thaiTitle: "หน้ากากทางสังคม",
    aliases: ["Persona", "หน้ากากทางสังคม"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "ภาพที่บุคคลแสดงต่อโลกภายนอก",
  },
  {
    id: "concept-self",
    title: "Self",
    slug: "self",
    thaiTitle: "ตัวตนทั้งหมด",
    aliases: ["Self", "ตัวตนทั้งหมด", "Selbst"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "ภาพรวมของชีวิตทางจิต ไม่ใช่เพียง Ego",
  },
  {
    id: "concept-unconscious",
    title: "Unconscious",
    slug: "unconscious",
    thaiTitle: "จิตไร้สำนึก",
    aliases: ["Unconscious", "จิตไร้สำนึก"],
    nodeType: "concept",
    description: "ส่วนของจิตที่อยู่นอกการรู้ตัว",
  },
  {
    id: "concept-collective-unconscious",
    title: "Collective Unconscious",
    slug: "collective-unconscious",
    thaiTitle: "จิตไร้สำนึกร่วม",
    aliases: ["Collective Unconscious", "จิตไร้สำนึกร่วม"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "ชั้นของจิตไร้สำนึกที่มนุษย์มีร่วมกัน",
  },
  {
    id: "concept-individuation",
    title: "Individuation",
    slug: "individuation",
    thaiTitle: "กระบวนการปัจเจกภาพ",
    aliases: ["Individuation", "กระบวนการปัจเจกภาพ"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "กระบวนการที่ชีวิตภายในค่อย ๆ จัดความสัมพันธ์ของตัวเอง",
  },
  {
    id: "concept-archetype",
    title: "Archetype",
    slug: "archetype",
    thaiTitle: "แบบฉบับดั้งเดิม",
    aliases: ["Archetype", "แบบฉบับดั้งเดิม"],
    nodeType: "concept",
    framework: "Analytical Psychology",
    description: "แบบแผนร่วมที่ปรากฏซ้ำในจิตไร้สำนึกและตำนาน",
  },
  {
    id: "term-libido",
    title: "Libido",
    slug: "libido",
    thaiTitle: "ลิบิโด",
    aliases: ["Libido", "ลิบิโด"],
    nodeType: "term",
    description: "พลังงานทางจิต (ความหมายต่างกันระหว่าง Freud และ Jung)",
  },
  {
    id: "person-carl-jung",
    title: "Carl Jung",
    slug: "carl-jung",
    thaiTitle: "คาร์ล ยุง",
    aliases: ["Carl Jung", "C. G. Jung", "Jung", "ยุง", "คาร์ล ยุง"],
    nodeType: "person",
    framework: "Analytical Psychology",
    description: "นักจิตวิทยาผู้วางรากฐานจิตวิทยาวิเคราะห์",
  },
  {
    id: "person-sigmund-freud",
    title: "Sigmund Freud",
    slug: "sigmund-freud",
    thaiTitle: "ซิกมุนด์ ฟรอยด์",
    aliases: ["Sigmund Freud", "Freud", "ฟรอยด์"],
    nodeType: "person",
    framework: "Psychoanalysis",
    description: "ผู้วางรากฐานจิตวิเคราะห์",
  },
  {
    id: "book-psychological-types",
    title: "Psychological Types",
    slug: "psychological-types",
    aliases: ["Psychological Types"],
    nodeType: "book",
    framework: "Analytical Psychology",
    description: "งานสำคัญของ Jung ว่าด้วยประเภททางจิตวิทยา",
  },
  {
    id: "school-analytical-psychology",
    title: "Analytical Psychology",
    slug: "analytical-psychology",
    thaiTitle: "จิตวิทยาวิเคราะห์แนวยุง",
    aliases: ["Analytical Psychology", "Jungian Psychology", "จิตวิทยาสายยุง", "จิตวิทยาเชิงลึกแนวคาร์ล ยุง", "จิตวิทยาวิเคราะห์"],
    nodeType: "school",
    description: "สำนักจิตวิทยาวิเคราะห์ที่พัฒนาจากงานของ Jung (slug ตรงกับ /schools/analytical-psychology)",
  },
  {
    id: "school-psychoanalysis",
    title: "Psychoanalysis",
    slug: "psychoanalysis",
    thaiTitle: "จิตวิเคราะห์",
    aliases: ["Psychoanalysis", "จิตวิเคราะห์"],
    nodeType: "school",
    description: "สายแนวคิดที่เริ่มจาก Freud ว่าด้วยจิตไร้สำนึก",
  },
];

export function getConceptBySlug(slug: string): ConceptRegistryItem | undefined {
  return conceptRegistry.find((c) => c.slug === slug);
}

// resolve โดยลำดับ: slug → title → thaiTitle → alias (กันสร้าง node ซ้ำ)
export function resolveConcept(input: string): ConceptRegistryItem | undefined {
  const q = input.trim().toLowerCase();
  return (
    conceptRegistry.find((c) => c.slug.toLowerCase() === q) ||
    conceptRegistry.find((c) => c.title.toLowerCase() === q) ||
    conceptRegistry.find((c) => (c.thaiTitle ?? "").toLowerCase() === q) ||
    conceptRegistry.find((c) => c.aliases.some((a) => a.toLowerCase() === q))
  );
}

export function conceptTitle(slug: string): string {
  return getConceptBySlug(slug)?.title ?? slug;
}
