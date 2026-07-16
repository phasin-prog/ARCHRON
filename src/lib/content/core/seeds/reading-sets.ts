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
    shortDescription: "ปูพื้นฐานเรื่อง Ego, Shadow และ Persona ในจิตวิทยาวิเคราะห์",
    bodyMarkdown: "เส้นทางนี้เริ่มจาก Ego ในฐานะศูนย์กลางของจิตสำนึก Shadow และ Persona ซึ่งอธิบายหน้ากากทางสังคม แนวคิดทั้งสามมีความสัมพันธ์กันในจิตวิทยาวิเคราะห์",
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
    shortDescription: "ทำความเข้าใจ Archetype จิตไร้สำนึกร่วม และ Individuation ในจิตวิทยาวิเคราะห์",
    bodyMarkdown: "เมื่อเข้าใจโครงสร้างจิตใจเบื้องต้นแล้ว เส้นทางนี้จะพาไปรู้จัก Archetype แบบแผนร่วมในจิตไร้สำนึก ผ่านสัญลักษณ์และตำนาน จากนั้นอ่าน Individuation ในจิตวิทยาวิเคราะห์ และ Night Sea Journey ในฐานะสัญลักษณ์ของการเดินทางผ่านความมืดมิด",
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
    shortDescription: "อ่านภาพรวมของ Psyche, Self และ Carl Jung ในจิตวิทยาวิเคราะห์",
    bodyMarkdown: "Psyche คือคำเรียกชีวิตทางจิตทั้งหมด ไม่ได้หมายถึงความคิดหรืออารมณ์เพียงอย่างเดียว เส้นทางนี้เชื่อมไปยัง Self และ Carl Jung ซึ่งเป็นผู้วางรากฐานของจิตวิทยาวิเคราะห์",
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

