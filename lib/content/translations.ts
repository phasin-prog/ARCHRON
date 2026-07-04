// lib/content/translations.ts — ARCHRON Phase 19: Translation System
// พจนานุกรมคำศัพท์เฉพาะทางและมาตรฐานการแปลไทย (Thai-first Canonical Terms)

export type TermTranslation = {
  originalTerm: string;
  language: "English" | "German" | "Latin" | "Greek";
  canonicalThai: string;
  alternativeThai?: string[];
  partOfSpeech: string;
  definition: string;
  editorialNote?: string;
};

export const CANONICAL_TERMS: Record<string, TermTranslation> = {
  unconscious: {
    originalTerm: "Unconscious / Das Unbewusste",
    language: "German",
    canonicalThai: "จิตไร้สำนึก",
    alternativeThai: ["จิตไม่รู้สำนึก"],
    partOfSpeech: "Noun",
    definition: "ส่วนของระบบจิตใจที่อยู่ภายนอกเหนือการรู้ตัวของบุคคล แต่มีอิทธิพลอย่างมหาศาลต่อความคิด พฤติกรรม และความฝัน",
    editorialNote: "ใน ARCHRON ใช้คำว่า 'จิตไร้สำนึก' เป็นมาตรฐาน หลีกเลี่ยงการสับสนกับ 'จิตใต้สำนึก' (Subconscious)",
  },
  "collective-unconscious": {
    originalTerm: "Collective Unconscious / Kollektives Unbewusstes",
    language: "German",
    canonicalThai: "จิตไร้สำนึกร่วม",
    partOfSpeech: "Noun",
    definition: "ระดับที่ลึกที่สุดของจิตไร้สำนึกที่มีร่วมกันในมนุษยชาติ ถ่ายทอดผ่านมรดกทางวิวัฒนาการและบรรจุโครงสร้าง Archetypes",
  },
  archetype: {
    originalTerm: "Archetype / Archetypus",
    language: "Greek",
    canonicalThai: "ต้นแบบจิตใต้สำนึกร่วม",
    alternativeThai: ["แม่พิมพ์สากล"],
    partOfSpeech: "Noun",
    definition: "โครงสร้างพื้นฐานทางจิตวิทยาหรือรูปแบบสัญลักษณ์สากลที่ปรากฏร่วมกันในตำนาน ความฝัน และวัฒนธรรมทั่วโลก",
  },
  shadow: {
    originalTerm: "Shadow / Schatten",
    language: "German",
    canonicalThai: "เงาภายในจิตใจ",
    alternativeThai: ["เงามืด"],
    partOfSpeech: "Noun",
    definition: "ส่วนด้านลบหรือคุณลักษณะที่ถูกเก็บกด ปฏิเสธ หรือซ่อนเร้นไว้จากตัวตนที่รู้สำนึก (Ego)",
  },
  individuation: {
    originalTerm: "Individuation / Individuation",
    language: "German",
    canonicalThai: "กระบวนการผสานตนเอง",
    alternativeThai: ["การพัฒนาเป็นปัจเจกภาพ"],
    partOfSpeech: "Noun",
    definition: "กระบวนการทางจิตวิทยาในการบูรณาการส่วนต่าง ๆ ของจิตใจ (รวมถึงเงาและ Anima/Animus) สู่ความสมบูรณ์แห่งตน (The Self)",
  },
  ego: {
    originalTerm: "Ego / Das Ich",
    language: "Latin",
    canonicalThai: "อัตตา",
    partOfSpeech: "Noun",
    definition: "ศูนย์กลางของการรู้สำนึกและอัตลักษณ์ ทำหน้าที่ปรับสมดุลระหว่างความต้องการภายในโลกไร้สำนึกและข้อจำกัดของโลกภายนอก",
  },
  id: {
    originalTerm: "Id / Das Es",
    language: "Latin",
    canonicalThai: "อิด",
    partOfSpeech: "Noun",
    definition: "โครงสร้างพื้นฐานดั้งเดิมของจิตใจ ขับเคลื่อนด้วยสัญชาตญาณและหลักแห่งความพึงพอใจ (Pleasure Principle)",
  },
  dasein: {
    originalTerm: "Dasein",
    language: "German",
    canonicalThai: "การภาวะอยู่ ณ ที่นั้น",
    alternativeThai: ["การมีอยู่"],
    partOfSpeech: "Noun",
    definition: "มโนทัศน์หลักของ Heidegger สื่อถึงการดำรงอยู่ของมนุษย์ที่ตระหนักรู้ต่อโลกและกาลเวลา",
  },
  "prima-materia": {
    originalTerm: "Prima Materia",
    language: "Latin",
    canonicalThai: "สสารปฐมภูมิ",
    partOfSpeech: "Noun",
    definition: "สสารเบื้องต้นไร้รูปร่างในวิชาเล่นแร่แปรธาตุ ซึ่งจุงเปรียบเทียบเป็นสภาวะเริ่มต้นของจิตไร้สำนึกก่อนการแปรรูป",
  },
};

export function translateTerm(key: string): TermTranslation | undefined {
  return CANONICAL_TERMS[key.toLowerCase()];
}
