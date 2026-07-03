import type { ContentEntry } from "@/types/content";

export type ReadingSetStep = {
  slug: string;
  title: string;
  type: "concept" | "article";
};

export type ReadingSetItem = ContentEntry & {
  steps: ReadingSetStep[];
};

export const READING_SETS: ReadingSetItem[] = [
  {
    id: "set-psychoanalysis-foundations",
    slug: "psychoanalysis-foundations",
    title: "จิตวิเคราะห์พื้นฐาน (Foundations of Psychoanalysis)",
    status: "published",
    contentType: "reading-set",
    shortDescription: "ปูพื้นฐานความเข้าใจเรื่องระบบจิตไร้สำนึกและโครงสร้างจิตใจมนุษย์ตามแนวทางของ Freud และ Jung",
    bodyMarkdown: "ทำความเข้าใจประวัติศาสตร์และรากฐานของจิตวิทยาเชิงลึก เริ่มต้นจากแนวคิดเรื่องจิตไร้สำนึก โครงสร้างสามส่วนของฟรอยด์ (Id, Ego, Superego) และการทำงานของกลไกการป้องกันตนเอง (Defense Mechanisms)",
    framework: "Depth Psychology",
    difficulty: "beginner",
    tags: ["Freud", "Jung", "Psychoanalysis"],
    relatedConcepts: [],
    references: [],
    steps: [
      { slug: "the-unconscious", title: "จิตไร้สำนึก (The Unconscious)", type: "concept" },
      { slug: "ego-and-id", title: "อัตตาและอิด (Ego & Id)", type: "concept" },
      { slug: "defense-mechanisms", title: "กลไกการป้องกันจิต (Defense Mechanisms)", type: "concept" },
    ],
  },
  {
    id: "set-hero-individuation",
    slug: "hero-individuation",
    title: "การเดินทางของฮีโร่และ Individuation",
    status: "published",
    contentType: "reading-set",
    shortDescription: "ค้นหาวิธีบูรณาการและผสานส่วนเสี้ยวต่าง ๆ ในโลกภายในเพื่อกลายเป็นตัวตนที่แท้จริงและสมบูรณ์",
    bodyMarkdown: "เดินตามทฤษฎีเด่นของคาร์ล จุง ว่าด้วยกระบวนการผสานตนเอง (Individuation Process) ผ่านการประยุกต์ร่วมกับโครงสร้างการเดินทางของวีรบุรุษ (The Hero's Journey) ของ Joseph Campbell เพื่อทำความเข้าใจวิกฤตวัยกลางคนและการค้นพบความจริงในจิตใจ",
    framework: "Analytical Psychology",
    difficulty: "intermediate",
    tags: ["Jung", "Campbell", "Individuation"],
    relatedConcepts: [],
    references: [],
    steps: [
      { slug: "individuation", title: "การผสานตนเอง (Individuation)", type: "concept" },
      { slug: "the-shadow", title: "เงาภายในจิตใจ (The Shadow)", type: "concept" },
      { slug: "archetypes", title: "ต้นแบบจิตใต้สำนึกร่วม (Archetypes)", type: "concept" },
    ],
  },
  {
    id: "set-jungian-types",
    slug: "jungian-types",
    title: "จิตวิทยาประเภทแบบคาร์ล จุง (Psychological Types)",
    status: "published",
    contentType: "reading-set",
    shortDescription: "ทำความเข้าใจทฤษฎีเบื้องหลังการทำงานของจิตและรูปแบบความถนัดในการรับรู้ข้อมูลของสมองมนุษย์",
    bodyMarkdown: "เจาะลึกทฤษฎีประเภททางจิตวิทยา (Psychological Types) ที่คาร์ล จุง เสนอไว้ในปี 1921 ซึ่งระบุการทำงานประสานกันของฟังก์ชันการรับรู้ (Cognitive Functions) ทั้ง 8 รูปแบบ และนำมาสู่อิทธิพลในการสร้างเครื่องมือยอดนิยมอย่าง MBTI ในยุคปัจจุบัน",
    framework: "Analytical Psychology",
    difficulty: "advanced",
    tags: ["Jung", "Cognitive Functions", "Typology"],
    relatedConcepts: [],
    references: [],
    steps: [
      { slug: "cognitive-functions", title: "ฟังก์ชันการรับรู้ (Cognitive Functions)", type: "concept" },
      { slug: "extraversion-introversion", title: "การปันพลังงานสู่ภายนอกและภายใน", type: "concept" },
      { slug: "mbti-foundations", title: "พื้นฐานโครงสร้างบุคลิกภาพ MBTI", type: "concept" },
    ],
  },
];
