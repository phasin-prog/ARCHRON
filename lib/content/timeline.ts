// lib/content/timeline.ts — ARCHRON Phase 17: Timeline System
// ระบบลำดับเวลาและยุคสมัยทางปัญญา (Intellectual Epochs & Historical Timeline)

export type EpochKey =
  | "ancient"
  | "enlightenment"
  | "nineteenth"
  | "early-depth"
  | "mid-century"
  | "contemporary";

export type IntellectualEpoch = {
  key: EpochKey;
  label: string;
  enLabel: string;
  years: string;
  description: string;
};

export type TimelineEvent = {
  id: string;
  year: number;
  title: string;
  thinker?: string;
  epochKey: EpochKey;
  description: string;
  relatedSlug?: string;
};

export const INTELLECTUAL_EPOCHS: IntellectualEpoch[] = [
  {
    key: "ancient",
    label: "ปรัชญายุคโบราณ",
    enLabel: "Ancient & Classical Roots",
    years: "Before 1500 CE",
    description: "รากฐานปรัชญากรีกและตะวันออก การค้นหาความจริงแห่งปรมัตถ์และรากเหง้าของจิตมนุษย์",
  },
  {
    key: "enlightenment",
    label: "ยุคแห่งเหตุผลและการตื่นรู้",
    enLabel: "Enlightenment & Rationalism",
    years: "1500–1800 CE",
    description: "การกำเนิดของปรัชญาสมัยใหม่ การตั้งคำถามต่อตัวตน (Cogito) และขอบเขตของเหตุผล",
  },
  {
    key: "nineteenth",
    label: "ศตวรรษที่ 19 และวิกฤตความหมาย",
    enLabel: "19th Century & Existential Roots",
    years: "1800–1895 CE",
    description: "การท้าทายศีลธรรมดั้งเดิมโดย Nietzsche, Schopenhauer และการเตรียมปูทางสู่จิตใต้สำนึก",
  },
  {
    key: "early-depth",
    label: "รุ่งอรุณแห่งจิตวิทยาเชิงลึก",
    enLabel: "Birth of Depth Psychology",
    years: "1895–1939 CE",
    description: "การค้นพบจิตไร้สำนึก การก่อตั้งสำนักจิตวิเคราะห์โดย Freud, Jung และ Adler",
  },
  {
    key: "mid-century",
    label: "ยุคหลังสงครามและการตระหนักรู้ตัวตน",
    enLabel: "Existential & Humanistic Era",
    years: "1940–1980 CE",
    description: "ปรัชญาอัตถิภาวนิยม (Heidegger, Sartre) และจิตวิทยาแนวมนุษยนิยม (Rogers, Maslow)",
  },
  {
    key: "contemporary",
    label: "ยุคร่วมสมัยและปัญญาประดิษฐ์",
    enLabel: "Contemporary & Cognitive Era",
    years: "1980–Present",
    description: "การบูรณาการประสาทวิทยาศาสตร์ จิตวิทยาความรู้ความเข้าใจ และคำถามต่อจิตสำนึกในยุค AI",
  },
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "evt-freud-dreams",
    year: 1899,
    title: "ตีพิมพ์ The Interpretation of Dreams",
    thinker: "Sigmund Freud",
    epochKey: "early-depth",
    description: "ฟรอยด์เปิดประตูสู่โลกของจิตไร้สำนึกผ่านการวิเคราะห์ความฝันอย่างเป็นระบบเชิงวิทยาศาสตร์ครั้งแรก",
    relatedSlug: "the-unconscious",
  },
  {
    id: "evt-jung-types",
    year: 1921,
    title: "เสนอทฤษฎี Psychological Types",
    thinker: "C.G. Jung",
    epochKey: "early-depth",
    description: "จุงจำแนกโครงสร้างฟังก์ชันการรับรู้ 8 รูปแบบ วางรากฐานความเข้าใจบุคลิกภาพที่ลึกซึ้งที่สุด",
    relatedSlug: "cognitive-functions",
  },
  {
    id: "evt-nietzsche-zarathustra",
    year: 1883,
    title: "Thus Spoke Zarathustra",
    thinker: "Friedrich Nietzsche",
    epochKey: "nineteenth",
    description: "ประกาศเจตนารมณ์ของการก้าวข้ามขีดจำกัดมนุษย์และการเผชิญหน้ากับความว่างเปล่าทางคุณค่า",
  },
];

export function getEventsByEpoch(epochKey: EpochKey): TimelineEvent[] {
  return TIMELINE_EVENTS.filter((e) => e.epochKey === epochKey).sort((a, b) => a.year - b.year);
}
