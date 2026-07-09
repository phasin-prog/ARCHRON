// lib/content/theories.ts — Theory System (Phase 45)
// ทฤษฎีและกรอบแนวคิดการอธิบายจิตใจมนุษย์
// อ้างอิง: Sitemap.md §/theories · ROADMAP Phase 45

export type TheoryCategory =
  | "psychoanalysis"
  | "psychology"
  | "philosophy"
  | "neuroscience"
  | "sociology"
  | "developmental"
  | "clinical"
  | "cultural";

export type Theory = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  thaiTitle: string;
  category: TheoryCategory;
  summary: string;
  keyConcepts: string[];
  founders: string[];
  era: string;
  relatedSchools: string[];
  relatedTheories: string[];
  tags: string[];
};

export const THEORY_CATEGORY_LABEL: Record<TheoryCategory, string> = {
  psychoanalysis: "จิตวิเคราะห์",
  psychology: "จิตวิทยา",
  philosophy: "ปรัชญา",
  neuroscience: "ประสาทวิทยา",
  sociology: "สังคมวิทยา",
  developmental: "พัฒนาการ",
  clinical: "คลินิก",
  cultural: "วัฒนธรรม",
};

export const THEORY_CATEGORY_ICON: Record<TheoryCategory, string> = {
  psychoanalysis: "psychology",
  psychology: "brain",
  philosophy: "school",
  neuroscience: "neurology",
  sociology: "groups",
  developmental: "child_care",
  clinical: "clinical_notes",
  cultural: "auto_stories",
};

export const theories: Theory[] = [
  {
    id: "theory-psychoanalysis",
    slug: "psychoanalysis",
    title: "Psychoanalysis",
    titleEn: "Psychoanalysis",
    thaiTitle: "จิตวิเคราะห์",
    category: "psychoanalysis",
    summary:
      "ระบบการรักษาและทฤษฎีบุคลิกภาพที่ซิคมุนด์ ฟรอยด์พัฒนาขึ้น โดยเน้นกระบวนการทางจิตที่ไม่รู้ตัว (unconscious) ความขัดแย้งภายในจิตใจ และประสบการณ์วัยเด็กเป็นปัจจัยหลักที่กำหนดพฤติกรรม อารมณ์ และความสัมพันธ์ของมนุษย์",
    keyConcepts: [
      "Unconscious",
      "Id/Ego/Superego",
      "Defense Mechanisms",
      "Dream Analysis",
      "Transference",
      "Psychosexual Development",
    ],
    founders: ["Sigmund Freud"],
    era: "คริสต์ศตวรรษที่ 19-20",
    relatedSchools: ["freudian", "object-relations", "ego-psychology"],
    relatedTheories: [
      "object-relations-theory",
      "attachment-theory",
      "structural-theory",
    ],
    tags: ["จิตวิเคราะห์", "unconscious", "psychoanalysis", "freud"],
  },
  {
    id: "theory-object-relations",
    slug: "object-relations-theory",
    title: "Object Relations Theory",
    titleEn: "Object Relations Theory",
    thaiTitle: "ทฤษฎีความสัมพันธ์วัตถุ",
    category: "psychoanalysis",
    summary:
      "แขนงย่อยของจิตวิเคราะห์ที่เน้นความสัมพันธ์ระหว่างบุคคล (interpersonal relations) และอิทธิพลของประสบการณ์วัยเด็กต่อการพัฒนาบุคลิกภาพ โดยเฉพาะความสัมพันธ์ระหว่างแม่กับลูกและภาพแทนในใจ (internal objects)",
    keyConcepts: [
      "Internal Objects",
      "Transitional Object",
      "Splitting",
      "Good Mother/Bad Mother",
      "Depressive Position",
    ],
    founders: ["Melanie Klein", "Donald Winnicott", "Ronald Fairbairn"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["object-relations", "kleinian"],
    relatedTheories: ["psychoanalysis", "attachment-theory"],
    tags: ["object relations", "klein", "winnicott", "internal objects"],
  },
  {
    id: "theory-attachment",
    slug: "attachment-theory",
    title: "Attachment Theory",
    titleEn: "Attachment Theory",
    thaiTitle: "ทฤษฎีความผูกพัน",
    category: "developmental",
    summary:
      "ทฤษฎีที่อธิบายความสัมพันธ์ระยะยาวระหว่างมนุษย์ โดยเน้นความผูกพันระหว่างเด็กกับผู้ดูแลหลัก (primary caregiver) ว่าเป็นฐานของสุขภาพจิต和社会性ในอนาคต แบ่งเป็น 4 แบบแผน: secure, anxious-ambivalent, avoidant, และ disorganized",
    keyConcepts: [
      "Secure Base",
      "Internal Working Model",
      "Strange Situation",
      "Four Attachment Styles",
      "Mentalization",
    ],
    founders: ["John Bowlby", "Mary Ainsworth"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["attachment-mentalization"],
    relatedTheories: ["psychoanalysis", "object-relations-theory"],
    tags: ["attachment", "bowlby", "ainsworth", "developmental"],
  },
  {
    id: "theory-jungian-analytical",
    slug: "jungian-analytical-psychology",
    title: "Analytical Psychology (Jungian)",
    titleEn: "Analytical Psychology",
    thaiTitle: "จิตวิทยาวิเคราะห์แบบจุง",
    category: "psychoanalysis",
    summary:
      "ระบบของคาร์ล จุงที่เน้นจิตใต้สำนึก collective unconscious, archetypes, individuation process และสัญลักษณ์ในความฝัน myth และวัฒนธรรม เพื่อเข้าใจบุคลิกภาพและการเติบโตทางจิตวิญญาณ",
    keyConcepts: [
      "Collective Unconscious",
      "Archetypes",
      "Individuation",
      "Persona/Shadow",
      "Anima/Animus",
      "Synchronicity",
    ],
    founders: ["Carl Gustav Jung"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["jungian"],
    relatedTheories: ["psychoanalysis", "archetypal-psychology"],
    tags: ["jung", "archetypes", "individuation", "collective unconscious"],
  },
  {
    id: "theory-structural",
    slug: "structural-theory",
    title: "Structural Theory",
    titleEn: "Structural Theory",
    thaiTitle: "ทฤษฎีโครงสร้าง",
    category: "psychoanalysis",
    summary:
      "ทฤษฎีที่อธิบายโครงสร้างจิตใจของมนุษย์ประกอบด้วย 3 ระบบ: Id (แรงขับ), Ego (ความเป็นจริง), และ Superego (ศีลธรรม) โดยความขัดแย้งระหว่างระบบทั้ง 3 ส่งผลต่อพฤติกรรมและอาการทางจิต",
    keyConcepts: ["Id", "Ego", "Superego", "Conflict", "Compromise Formation"],
    founders: ["Sigmund Freud"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["ego-psychology"],
    relatedTheories: ["psychoanalysis"],
    tags: ["structural model", "id", "ego", "superego", "freud"],
  },
  {
    id: "theory-ego-psychology",
    slug: "ego-psychology",
    title: "Ego Psychology",
    titleEn: "Ego Psychology",
    thaiTitle: "จิตวิทยาอัตตา",
    category: "psychoanalysis",
    summary:
      "แขนงจิตวิเคราะห์ที่เน้นบทบาทของ Ego (อัตตา) ในการปรับตัวเข้ากับความเป็นจริง การป้องกันตัว (defense mechanisms) และการทำงานของ ego ที่ไม่ได้เป็นแค่ทาสของ Id แต่มีอำนาจปกครองตนเอง",
    keyConcepts: [
      "Ego Strength",
      "Defense Mechanisms",
      "Adaptive Function",
      "Reality Testing",
      "Synthesis",
    ],
    founders: ["Anna Freud", "Heinz Hartmann"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["ego-psychology"],
    relatedTheories: ["structural-theory", "psychoanalysis"],
    tags: ["ego", "defense mechanisms", "adaptation", "hartmann"],
  },
  {
    id: "theory-lacanian",
    slug: "lacanian-psychoanalysis",
    title: "Lacanian Psychoanalysis",
    titleEn: "Lacanian Psychoanalysis",
    thaiTitle: "จิตวิเคราะห์แบบลาคาน",
    category: "psychoanalysis",
    summary:
      "การตีความใหม่ของจิตวิเคราะห์โดยฌาค ลาคาน ที่เน้นบทบาทของภาษา ภาษาศาสตร์ และโครงสร้างสัญลักษณ์ในการก่อตัวตัวตน (subject) และจิตใต้สำนึก แบ่งเป็น 3 ระดับ: Real, Symbolic, Imaginary",
    keyConcepts: [
      "Real/Symbolic/Imaginary",
      "Mirror Stage",
      "Desire",
      "Big Other",
      "Jouissance",
      "Signifier",
    ],
    founders: ["Jacques Lacan"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["lacanian"],
    relatedTheories: ["psychoanalysis", "structuralism"],
    tags: ["lacan", "mirror stage", "desire", "signifier"],
  },
  {
    id: "theory-humanistic",
    slug: "humanistic-psychology",
    title: "Humanistic Psychology",
    titleEn: "Humanistic Psychology",
    thaiTitle: "จิตวิทยามนุษยนิยม",
    category: "psychology",
    summary:
      "แนวทางจิตวิทยาที่เน้นศักยภาพของมนุษย์ การเติบโตส่วนบุคคล (self-actualization) และประสบการณ์ภายในจิตใจ (subjective experience) โดยปฏิเสธการลดมนุษย์ให้เหลือแค่พฤติกรรมหรือกลไกจิต",
    keyConcepts: [
      "Self-Actualization",
      "Hierarchy of Needs",
      "Person-Centered",
      "Unconditional Positive Regard",
      "Congruence",
    ],
    founders: ["Abraham Maslow", "Carl Rogers", "Rollo May"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["humanistic"],
    relatedTheories: ["existential-therapy", "gestalt-therapy"],
    tags: ["humanistic", "maslow", "rogers", "self-actualization"],
  },
  {
    id: "theory-existential",
    slug: "existential-therapy",
    title: "Existential Therapy",
    titleEn: "Existential Therapy",
    thaiTitle: "การบำบัดเชิงอัตถิภาวะนิยม",
    category: "philosophy",
    summary:
      "การบำบัดที่เน้นคำถามพื้นฐานของชีวิตมนุษย์: ความตาย (death), อิสรภาพ (freedom), ความโดดเดี่ยว (isolation), และความไร้ความหมาย (meaninglessness) โดยช่วยให้ผู้รับบำบัดเผชิญหน้ากับเงื่อนไขพื้นฐานของชีวิตอย่างกล้าหาญ",
    keyConcepts: [
      "Being-toward-death",
      "Anxiety",
      "Authenticity",
      "Freedom",
      "Meaning",
      "Isolation",
    ],
    founders: ["Viktor Frankl", "Rollo May", "Irvin Yalom"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["existential"],
    relatedTheories: ["humanistic-psychology", "phenomenology"],
    tags: ["existential", "frankl", "yalom", "meaning"],
  },
  {
    id: "theory-cbt",
    slug: "cognitive-behavioral-therapy",
    title: "Cognitive Behavioral Therapy",
    titleEn: "Cognitive Behavioral Therapy",
    thaiTitle: "การบำบัดพฤติกรรมบำบัดความคิด",
    category: "clinical",
    summary:
      "การบำบัดที่เน้นความสัมพันธ์ระหว่างความคิด (cognition) พฤติกรรม และอารมณ์ โดยเชื่อว่าการเปลี่ยนแปลงความคิดที่บิดเบี้ยว (cognitive distortions) สามารถช่วยให้อารมณ์และพฤติกรรมดีขึ้น",
    keyConcepts: [
      "Cognitive Distortions",
      "Thought Record",
      "Behavioral Activation",
      "Exposure",
      "Socratic Questioning",
    ],
    founders: ["Aaron Beck", "Albert Ellis"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["cbt"],
    relatedTheories: ["behaviorism", "cognitive-psychology"],
    tags: ["cbt", "beck", "ellis", "cognitive distortions"],
  },
  {
    id: "theory-gestalt",
    slug: "gestalt-therapy",
    title: "Gestalt Therapy",
    titleEn: "Gestalt Therapy",
    thaiTitle: "การบำบัดแบบเกสตัลต์",
    category: "clinical",
    summary:
      "การบำบัดที่เน้นการตระหนักรู้ (awareness) ในปัจจุบัน moment (here-and-now) ประสบการณ์ทางร่างกาย และความสัมพันธ์ระหว่างบุคคล โดยใช้เทคนิคต่าง ๆ เพื่อช่วยให้ผู้รับบำบัดตระหนักถึงความรู้สึกและความต้องการที่suppress",
    keyConcepts: [
      "Here-and-Now",
      "Awareness",
      "Unfinished Business",
      "Contact Boundary",
      "Figure/Ground",
    ],
    founders: ["Fritz Perls", "Laura Perls", "Paul Goodman"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["gestalt"],
    relatedTheories: ["humanistic-psychology", "phenomenology"],
    tags: ["gestalt", "perls", "here-and-now", "awareness"],
  },
  {
    id: "theory-family-systems",
    slug: "family-systems-therapy",
    title: "Family Systems Therapy",
    titleEn: "Family Systems Therapy",
    thaiTitle: "การบำบัดระบบครอบครัว",
    category: "clinical",
    summary:
      "การบำบัดที่มองครอบครัวเป็นระบบหนึ่ง (system) ที่มีกฎเกณฑ์ บทบาท และรูปแบบการสื่อสารของตนเอง โดยปัญหาของสมาชิกคนหนึ่งสะท้อนปัญหาของระบบครอบครัวทั้งหมด",
    keyConcepts: [
      "Family System",
      "Triangles",
      "Differentiation",
      "Genogram",
      "Boundaries",
      "Homeostasis",
    ],
    founders: ["Murray Bowen", "Salvador Minuchin"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["family-therapy"],
    relatedTheories: ["systems-theory", "attachment-theory"],
    tags: ["family systems", "bowen", "minuchin", "differentiation"],
  },
  {
    id: "theory-feminist",
    slug: "feminist-therapy",
    title: "Feminist Therapy",
    titleEn: "Feminist Therapy",
    thaiTitle: "การบำบัดเฟมินิสต์",
    category: "cultural",
    summary:
      "การบำบัดที่เน้นอิทธิพลของปัจจัยทางสังคมวัฒนธรรม (โดยเฉพาะเพศ) ต่อสุขภาพจิต โดยท้าทายสมมติฐานที่ฝังลึกของจิตวิทยาแบบเดิมที่มักมองว่าปัญหาของผู้หญิงเป็นปัญหาส่วนบุคคล ไม่ใช่ปัญหาเชิงโครงสร้าง",
    keyConcepts: [
      "Power Dynamics",
      "Social Context",
      "Consciousness-Raising",
      "Empowerment",
      "Gender Analysis",
    ],
    founders: ["Carol Gilligan", "Jean Baker Miller"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["feminist"],
    relatedTheories: ["humanistic-psychology", "social-constructionism"],
    tags: ["feminist", "gilligan", "power", "gender"],
  },
  {
    id: "theory-transpersonal",
    slug: "transpersonal-psychology",
    title: "Transpersonal Psychology",
    titleEn: "Transpersonal Psychology",
    thaiTitle: "จิตวิทยาข้ามบุคคล",
    category: "psychology",
    summary:
      "แขนงจิตวิทยาที่ศึกษาประสบการณ์ที่อยู่เหนือตัวตนส่วนบุคคล (transpersonal) เช่น ประสบการณ์ทางจิตวิญญาณ การทำสมาธิ ความตระหนักรู้เชิงลึก และความเชื่อมโยงกับสิ่งที่ใหญ่กว่าตนเอง",
    keyConcepts: [
      "Self-Transcendence",
      "Peak Experience",
      "Spiritual Emergency",
      "Non-Ordinary States",
      "Integral Map",
    ],
    founders: ["Abraham Maslow", "Stanislav Grof", "Ken Wilber"],
    era: "คริสต์ศตวรรษที่ 20",
    relatedSchools: ["transpersonal"],
    relatedTheories: ["humanistic-psychology", "integral-theory"],
    tags: ["transpersonal", "grof", "wilber", "spiritual"],
  },
  {
    id: "theory-attachment-mentalization",
    slug: "mentalization-based-treatment",
    title: "Mentalization-Based Treatment",
    titleEn: "Mentalization-Based Treatment",
    thaiTitle: "การบำบัดโดยเน้นการรู้ความคิด",
    category: "clinical",
    summary:
      "การบำบัดที่พัฒนาจากทฤษฎีความผูกพัน เน้นการพัฒนา ability to mentalize คือความสามารถในการทำความเข้าใจพฤติกรรมของตนเองและผู้อื่นในแง่ของสภาวะทางจิต (mental states) เช่น ความคิด ความรู้สึก ความต้องการ และความตั้งใจ",
    keyConcepts: [
      "Mentalization",
      "Reflective Functioning",
      "Attachment",
      "Epistemic Trust",
      "Mental State",
    ],
    founders: ["Peter Fonagy", "Anthony Bateman"],
    era: "คริสต์ศตวรรษที่ 21",
    relatedSchools: ["attachment-mentalization"],
    relatedTheories: ["attachment-theory", "psychoanalysis"],
    tags: ["mentalization", "fonagy", "bateman", "reflective functioning"],
  },
];

export function getTheoryBySlug(slug: string): Theory | undefined {
  return theories.find((t) => t.slug === slug);
}

export function getAllTheorySlugs(): string[] {
  return theories.map((t) => t.slug);
}

export function getTheoriesByCategory(category: TheoryCategory): Theory[] {
  return theories.filter((t) => t.category === category);
}

export function searchTheories(query: string): Theory[] {
  const q = query.toLowerCase();
  return theories.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.thaiTitle.toLowerCase().includes(q) ||
      t.summary.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
