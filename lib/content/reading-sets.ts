import type { ContentEntry } from "@/types/content";

export type ReadingSetStep = {
  slug: string;
  title: string;
  type: "concept" | "article" | "person";
};

export type ReadingSetItem = ContentEntry & {
  steps: ReadingSetStep[];
};

export const READING_SETS: ReadingSetItem[] = [
  {
    id: "set-foundations-of-jungian-psychology",
    slug: "foundations-of-jungian-psychology",
    title: "รากฐานจิตวิทยาเชิงลึก",
    status: "published",
    contentType: "reading-set",
    shortDescription: "ปูพื้นฐานความเข้าใจโครงสร้างจิตใจมนุษย์ ตั้งแต่อัตตา เงา ไปจนถึงหน้ากากทางสังคม",
    bodyMarkdown: "เริ่มต้นทำความเข้าใจว่าจิตใจมนุษย์ไม่ได้มีเพียงส่วนที่เรารู้ตัว เส้นทางนี้นำคุณไปรู้จัก Ego ในฐานะศูนย์กลางจิตสำนึก Shadow ส่วนที่เราซ่อนไว้ และ Persona หน้ากากที่เราสวมต่อโลกภายนอก ทั้งสามส่วนนี้ทำงานสัมพันธ์กันและกันตลอดเวลา",
    framework: "Analytical Psychology",
    difficulty: "beginner",
    tags: ["Jung", "Ego", "Shadow", "Persona"],
    relatedConcepts: [],
    references: [],
    steps: [
      { slug: "ego", title: "Ego (อัตตา)", type: "concept" },
      { slug: "shadow", title: "Shadow (เงา)", type: "concept" },
      { slug: "persona", title: "Persona (หน้ากากทางสังคม)", type: "concept" },
    ],
  },
  {
    id: "set-path-to-individuation",
    slug: "path-to-individuation",
    title: "เส้นทางสู่การผสานตนเอง",
    status: "published",
    contentType: "reading-set",
    shortDescription: "ทำความเข้าใจแบบแผนจิตใต้สำนึกร่วมและกระบวนการกลายเป็นตัวตนที่แท้จริง",
    bodyMarkdown: "เมื่อเข้าใจโครงสร้างจิตใจเบื้องต้นแล้ว เส้นทางนี้จะนำคุณไปรู้จัก Archetype แบบแผนร่วมที่ฝังอยู่ในจิตไร้สำนึก ผ่านสัญลักษณ์และตำนานของมนุษยชาติ จากนั้นเข้าสู่ Individuation กระบวนการสำคัญที่สุดของจิตวิทยาเชิงลึก ปิดท้ายด้วย Night Sea Journey สัญลักษณ์ของการเดินทางผ่านความมืดมิดสู่การกำเนิดใหม่",
    framework: "Analytical Psychology",
    difficulty: "intermediate",
    tags: ["Jung", "Archetype", "Individuation", "Symbol"],
    relatedConcepts: [],
    references: [],
    steps: [
      { slug: "archetype", title: "Archetype (แบบฉบับดั้งเดิม)", type: "concept" },
      { slug: "individuation", title: "Individuation (การผสานตนเอง)", type: "concept" },
      { slug: "night-sea-journey", title: "การเดินทางทางทะเลในยามค่ำคืน", type: "article" },
    ],
  },
  {
    id: "set-understanding-the-concept",
    slug: "understanding-the-concept",
    title: "ทำความเข้าใจ Psyche",
    status: "published",
    contentType: "reading-set",
    shortDescription: "เจาะลึกภาพรวมของชีวิตทางจิต ศูนย์กลางของจิตวิทยาวิเคราะห์ และผู้วางรากฐาน",
    bodyMarkdown: "สำหรับผู้ที่ต้องการเข้าใจภาพรวม Psyche คือคำเรียกชีวิตทางจิตทั้งหมด ไม่ใช่แค่ความคิดหรืออารมณ์ เส้นทางนี้พาคุณไปรู้จัก Self ศูนย์กลางและองค์รวมของจิต แล้วปิดท้ายด้วย Carl Jung ผู้วางรากฐานทั้งหมดที่เราศึกษา",
    framework: "Analytical Psychology",
    difficulty: "advanced",
    tags: ["Jung", "Psyche", "Self", "Carl Jung"],
    relatedConcepts: [],
    references: [],
    steps: [
      { slug: "concept", title: "Psyche (ไซคี)", type: "concept" },
      { slug: "self", title: "Self (ตัวตนทั้งหมด)", type: "concept" },
      { slug: "carl-jung", title: "Carl Jung (คาร์ล ยุง)", type: "person" },
    ],
  },
];

export function getReadingSetBySlug(slug: string): ReadingSetItem | undefined {
  return READING_SETS.find((s) => s.slug === slug);
}

export function calculateReadingSetEstimatedMinutes(set: ReadingSetItem): number {
  return (set.steps?.length ?? 0) * 8;
}

