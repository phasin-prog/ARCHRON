import type { SourceItem } from "@/types/content";

export const SOURCES: (SourceItem & { id: string })[] = [
  {
    id: "jung-cw-9i",
    sourceType: "primary-source",
    author: "C.G. Jung",
    title: "Collected Works of C.G. Jung, Vol. 9 (Part 1): Archetypes and the Collective Unconscious",
    year: "1959",
    citationNote: "ผลงานรวบรวมทฤษฎีหลักเรื่องต้นแบบ (Archetypes) และจิตไร้สำนึกร่วม (Collective Unconscious) ของคาร์ล จุง",
    relatedClaim: "เป็นรากฐานของแนวคิด Archetypes, Collective Unconscious, Anima/Animus และ Shadow",
  },
  {
    id: "jung-cw-6",
    sourceType: "primary-source",
    author: "C.G. Jung",
    title: "Collected Works of C.G. Jung, Vol. 6: Psychological Types",
    year: "1921",
    citationNote: "ตำราหลักที่จุงเสนอทฤษฎีประเภททางจิตวิทยา ซึ่งระบุเรื่องฟังก์ชันการรับรู้ (Cognitive Functions) และทัศนคติ (Introversion/Extraversion)",
    relatedClaim: "เป็นแหล่งอ้างอิงตรงสำหรับทฤษฎีจิตวิทยาประเภทบุคลิกภาพ (Cognitive Functions)",
  },
  {
    id: "jung-cw-7",
    sourceType: "primary-source",
    author: "C.G. Jung",
    title: "Collected Works of C.G. Jung, Vol. 7: Two Essays on Analytical Psychology",
    year: "1953",
    citationNote: "ความเรียงสองเรื่องที่สรุปความแตกต่างระหว่างทฤษฎีของจุง ฟรอยด์ และแอดเลอร์ และระบุโครงสร้างพื้นฐานของจิตวิทยาเชิงวิเคราะห์",
    relatedClaim: "อ้างอิงในเรื่องความขัดแย้งของทฤษฎีจิตวิเคราะห์ยุคแรกและการแบ่งแยกของอัตตา",
  },
  {
    id: "freud-dream",
    sourceType: "primary-source",
    author: "Sigmund Freud",
    title: "The Interpretation of Dreams",
    year: "1899",
    citationNote: "ผลงานคลาสสิกของฟรอยด์ที่ริเริ่มระเบียบวิธีวิเคราะห์ความฝัน และเสนอแนวคิดเรื่องกระบวนการปฐมภูมิ (Primary Process) ของจิตไร้สำนึก",
    relatedClaim: "เป็นรากฐานของการศึกษาจิตไร้สำนึก (The Unconscious) และการวิเคราะห์สัญลักษณ์ในความฝัน",
  },
  {
    id: "freud-ego-id",
    sourceType: "primary-source",
    author: "Sigmund Freud",
    title: "The Ego and the Id",
    year: "1923",
    citationNote: "การเสนอโมเดลโครงสร้างสามส่วนของจิตใจมนุษย์ ได้แก่ Id, Ego และ Superego",
    relatedClaim: "แหล่งอ้างอิงโดยตรงสำหรับการศึกษาทฤษฎีโครงสร้างจิตไร้สำนึกส่วนลึก",
  },
  {
    id: "franz-shadow",
    sourceType: "secondary-source",
    author: "Marie-Louise von Franz",
    title: "Shadow and Evil in Fairy Tales",
    year: "1974",
    citationNote: "งานวิเคราะห์ด้านตำนานและนิทานพื้นบ้านโดยผู้เชี่ยวชาญศิษย์เอกของจุง อธิบายถึงกลไกของเงา (Shadow) ในระดับกลุ่มและจิตวิทยาบุคคล",
    relatedClaim: "ต่อยอดทฤษฎีเรื่องเงาและการฉายภาพทางจิต (Projection)",
  },
  {
    id: "campbell-hero",
    sourceType: "secondary-source",
    author: "Joseph Campbell",
    title: "The Hero with a Thousand Faces",
    year: "1949",
    citationNote: "การศึกษาเปรียบเทียบตำนานของมนุษยชาติ ซึ่งจำแนกโครงสร้างการเดินทางของฮีโร่ (Monomyth) ที่เชื่อมโยงกับจิตวิทยาระดับลึกของจุง",
    relatedClaim: "ใช้ในการวิเคราะห์สัญลักษณ์และโครงสร้างการเดินทางของจิตใจ (Individuation)",
  },
  {
    id: "hillman-revision",
    sourceType: "secondary-source",
    author: "James Hillman",
    title: "Re-Visioning Psychology",
    year: "1975",
    citationNote: "งานเขียนสำคัญของบิดาแห่งจิตวิทยาแนวจินตภาพ (Archetypal Psychology) ที่เสนอให้จิตวิทยาหันกลับมาเคารพภาพจินตนาการของจิตมากกว่ามุ่งรักษา",
    relatedClaim: "ใช้ตีความกลไกการทำงานของภาพในจิตวิญญาณและแนวคิดเชิงจิตวิทยาแนวจินตภาพ",
  },
  {
    id: "archron-ed-typology",
    sourceType: "editorial-interpretation",
    author: "กองบรรณาธิการ ARCHRON",
    title: "บันทึกการตีความความสอดคล้องระหว่างสัญลักษณ์โบราณและจิตวิทยาร่วมสมัย",
    year: "2026",
    citationNote: "การสังเคราะห์ข้อมูลจากการเปรียบเทียบตำนานและทฤษฎีสัญลักษณ์วิทยาของระบบคิดต่าง ๆ กับกลไกทางจิตวิทยายุคใหม่",
    relatedClaim: "การสังเคราะห์เนื้อหาและจัดลำดับโครงสร้างทฤษฎีบนเว็บไซต์เพื่อการเรียนรู้เชิงลึก",
  },
];

export type CitationStyle = "APA" | "Chicago";

export function getSourceById(id: string) {
  return SOURCES.find((s) => s.id === id);
}

export function formatCitation(source: (typeof SOURCES)[number], style: CitationStyle = "APA"): string {
  const author = source.author || "Unknown Author";
  const year = source.year || "n.d.";
  const title = source.title || "Untitled";

  if (style === "APA") {
    return `${author}. (${year}). ${title}.`;
  }
  return `${author}, ${title} (${year}).`;
}

