// lib/content/schools.ts — ไดเรกทอรีสำนักคิดและนักปราชญ์ (Schools of Thought & Thinkers)
// ข้อมูล seed ตามที่ผู้ใช้ให้มา (ตามจริง ไม่แต่งเพิ่ม) — bio/concept เป็น optional สำหรับเติมภายหลัง

export type Thinker = {
  nameTh: string;
  nameEn: string;
  era: string;
  quote: string;
  masterpieces: string[];
  bio?: string;
  concept?: string;
};

export type School = {
  id: string;
  nameTh: string;
  nameEn: string;
  thinkers: Thinker[];
};

export const SCHOOLS: School[] = [
  {
    id: "s1",
    nameTh: "กรีกโบราณ",
    nameEn: "Classical Greek",
    thinkers: [
      {
        nameTh: "เพลโต",
        nameEn: "Plato",
        era: "428 – 348 BC",
        quote: "The measure of a man is what he does with power.",
        masterpieces: ["อุตมรัฐ (The Republic)", "ฟีโด (Phaedo)"],
      },
      {
        nameTh: "อริสโตเติล",
        nameEn: "Aristotle",
        era: "384 – 322 BC",
        quote: "Knowing yourself is the beginning of all wisdom.",
        masterpieces: ["นิกโคมาเชียน เอธิกส์ (Nicomachean Ethics)", "การเมือง (Politics)"],
      },
    ],
  },
  {
    id: "s2",
    nameTh: "ปฏิฐานนิยม",
    nameEn: "Positivism",
    thinkers: [
      {
        nameTh: "ออกุสต์ กองต์",
        nameEn: "Auguste Comte",
        era: "1798 – 1857",
        quote: "Love as a principle and order as the basis; progress as the goal.",
        masterpieces: ["หลักปรัชญาปฏิฐานนิยม (Course of Positive Philosophy)"],
      },
    ],
  },
  {
    id: "s3",
    nameTh: "พฤติกรรมนิยม",
    nameEn: "Behaviorism",
    thinkers: [
      {
        nameTh: "บี. เอฟ. สกินเนอร์",
        nameEn: "B.F. Skinner",
        era: "1904 – 1990",
        quote: "Education is what survives when what has been learned has been forgotten.",
        masterpieces: ["วอลเดน ทู (Walden Two)", "พฤติกรรมของสิ่งมีชีวิต (The Behavior of Organisms)"],
      },
    ],
  },
];

// ดัชนีตัวอักษร: พยัญชนะไทย ก–ฮ (0x0E01–0x0E2E) + อังกฤษ A–Z
export const THAI_LETTERS: string[] = Array.from({ length: 0x0e2e - 0x0e01 + 1 }, (_, i) =>
  String.fromCharCode(0x0e01 + i),
);
export const EN_LETTERS: string[] = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
);
