// src/lib/content/studio/blueprints.ts
// ARCHRON Studio v2 — Knowledge Blueprint Templates
// Blueprints คือ semantic templates ที่ช่วยสร้างโครงสร้าง MDX (YAML Frontmatter + Headings + Semantic Tags/Components)
// โดยยึดหลัก "MDX is Single Source of Truth" ในพื้นที่แก้ไขเดียว (Single Editor Workspace)

export type BlueprintId = "thinker" | "concept" | "book" | "symbol" | "article" | "term";

export interface KnowledgeBlueprint {
  id: BlueprintId;
  nameTh: string;
  nameEn: string;
  description: string;
  icon: string;
  templateMdx: string;
  defaultTags: string[];
  requiredHeadings: string[];
}

export const BLUEPRINTS: Record<BlueprintId, KnowledgeBlueprint> = {
  thinker: {
    id: "thinker",
    nameTh: "นักคิดและนักปราชญ์",
    nameEn: "Thinker",
    description: "สำหรับนักปรัชญา นักจิตวิเคราะห์ และผู้ก่อตั้งสำนักคิด (เช่น Carl Jung, Sigmund Freud)",
    icon: "person",
    defaultTags: ["thinker", "philosopher", "depth-psychology"],
    requiredHeadings: [
      "ประวัติและบริบทปัญญา",
      "แนวคิดหลักที่ค้นพบ",
      "อิทธิพลและมรดกทางความคิด",
      "แหล่งอ้างอิง",
    ],
    templateMdx: `---
title: "{{title}}"
slug: "{{slug}}"
date: "{{date}}"
contentType: "person"
status: "draft"
tags:
  - thinker
  - depth-psychology
---

# {{title}}

<ThinkerCard 
  name="{{title}}" 
  role="นักปรัชญาและนักจิตวิเคราะห์ (Philosopher & Psychoanalyst)" 
  period="ระบุช่วงชีวิต เช่น 1875 - 1961" 
/>

## ประวัติและบริบทปัญญา (Biography & Context)

<!-- คำแนะนำ: อธิบายภูมิหลังทางประวัติศาสตร์ สภาพแวดล้อมทางวิชาการ และคำถามหลักที่ขับเคลื่อนชีวิตและปัญญาของนักคิดท่านนี้ -->

บริบททางสังคมและปัญญาที่หล่อหลอมความคิดของท่านเริ่มต้นจาก...

## แนวคิดหลักที่ค้นพบ (Core Concepts & Contributions)

<!-- คำแนะนำ: สรุปมโนทัศน์สำคัญหรือโครงสร้างทฤษฎีที่นักคิดท่านนี้เสนอ พร้อมเชื่อมโยง Wikilink ไปยังแนวคิดในระบบ -->

* **แก่นทฤษฎีสำคัญ**: ได้แก่แนวคิดเรื่อง [[collective-unconscious|จิตไร้สำนึกสะสม]] และ [[individuation|กระบวนการพัฒนาความเป็นตน]]
* **นวัตกรรมทางปัญญา**: คำอธิบายว่าด้วยโครงสร้างของ Psyche และความสัมพันธ์ระหว่าง Ego กับ Shadow

## อิทธิพลและมรดกทางความคิด (Influence & Legacy)

<!-- คำแนะนำ: อภิปรายผลกระทบที่มีต่อสำนักคิดรุ่นหลัง ศาสตร์สาขาอื่น หรือบทสนทนาทางปัญญาร่วมสมัย -->

แนวคิดของท่านได้ส่งอิทธิพลอย่างลึกซึ้งต่อจิตวิทยาคลินิก มานุษยวิทยา และการศึกษาปรัชญาเชิงวิพากษ์...

## แหล่งอ้างอิง (References)

* Jung, C. G. (1953–1979). *The Collected Works of C. G. Jung*. Princeton University Press.
* บันทึกการเรียบเรียงและวิเคราะห์โดย ARCHRON
`,
  },

  concept: {
    id: "concept",
    nameTh: "แนวคิดทางจิตวิทยา",
    nameEn: "Concept",
    description: "สำหรับมโนทัศน์และแก่นแนวคิดทางจิตวิทยาวิเคราะห์และปรัชญา (เช่น Collective Unconscious, Individuation)",
    icon: "psychology",
    defaultTags: ["concept", "analytical-psychology", "theory"],
    requiredHeadings: [
      "คำอธิบายให้เห็นภาพ",
      "นิยามและแก่นทางวิชาการ",
      "รากศัพท์และการเปลี่ยนผ่านความหมาย",
      "เนื้อหาและคำอธิบายเชิงลึก",
      "แนวคิดที่เกี่ยวข้อง",
      "แหล่งอ้างอิงและตำรา",
    ],
    templateMdx: `---
title: "{{title}}"
slug: "{{slug}}"
date: "{{date}}"
contentType: "concept"
status: "draft"
tags:
  - concept
  - analytical-psychology
---

# {{title}}

## คำอธิบายให้เห็นภาพ (Visual Explanation)

<!-- คำแนะนำ: อภิปรายแนวคิดนี้ด้วยภาษาที่เข้าใจง่าย เปรียบเปรยให้เห็นภาพชัดเจนก่อนเข้าสู่ความซับซ้อนเชิงทฤษฎี -->

แนวคิดเรื่อง {{title}} สามารถเปรียบได้เสมือน...

## นิยามและแก่นทางวิชาการ (Technical Meaning)

<!-- คำแนะนำ: ระบุนิยามเชิงวิชาการที่แม่นยำตามกรอบทฤษฎีจิตวิทยาวิเคราะห์หรือปรัชญาที่เกี่ยวข้อง -->

ในกรอบจิตวิทยาวิเคราะห์ (Analytical Psychology) {{title}} หมายถึง...

## รากศัพท์และการเปลี่ยนผ่านความหมาย (Etymology & Roots)

<!-- คำแนะนำ: อธิบายรากศัพท์ (กรีก ลาติน หรือเยอรมัน) และวิวัฒนาการของคำจากอดีตสู่ปัจจุบัน -->

* **รากศัพท์ดั้งเดิม**: มาจากคำภาษา... ที่มีความหมายเบื้องต้นว่า...
* **การเปลี่ยนผ่านทางวิชาการ**: การนำคำนี้มาปรับใช้ในมิติทางจิตวิทยาปัญญา

## เนื้อหาและคำอธิบายเชิงลึก (Core Content)

<!-- คำแนะนำ: วิเคราะห์กลไก โครงสร้าง และบทบาทของแนวคิดนี้ภายในระบบ Psyche อย่างละเอียด -->

การทำงานของกลไกนี้มีความสัมพันธ์ใกล้ชิดกับกระบวนการภายในจิตใจ โดยแบ่งออกเป็นมิติต่าง ๆ ดังนี้:

1. **โครงสร้างและกลไกหลัก**: ...
2. **การปรากฏในประสบการณ์ชีวิต**: ...

## แนวคิดที่เกี่ยวข้อง (Related Concepts)

<!-- คำแนะนำ: ระบุแนวคิดที่เชื่อมโยงถึงกัน เพื่อขยายเครือข่ายความรู้ในคลังปัญญา ARCHRON -->

* เชื่อมโยงกับศูนย์กลางของจิตสำนึก: [[ego|Ego]]
* ตรงข้ามหรือสัมพันธ์กับส่วนเงามืด: [[shadow|Shadow]]
* หน้ากากทางสังคมที่ตอบสนองต่อโลกภายนอก: [[persona|Persona]]

## แหล่งอ้างอิงและตำรา (References)

* Jung, C. G. *Collected Works*. Princeton University Press.
* เอกสารและงานวิจัยที่เกี่ยวข้องกับมโนทัศน์ {{title}}
`,
  },

  book: {
    id: "book",
    nameTh: "หนังสือและตำราหลัก",
    nameEn: "Book",
    description: "สำหรับตำราปฐมภูมิ งานเขียนสำคัญ และแหล่งอ้างอิงหลักทางวิชาการ",
    icon: "menu_book",
    defaultTags: ["book", "primary-source", "literature"],
    requiredHeadings: [
      "ข้อมูลบรรณานุกรม",
      "สรุปแนวคิดสำคัญ",
      "บทวิเคราะห์เชิงลึก",
      "แหล่งอ้างอิงและข้อความสำคัญ",
    ],
    templateMdx: `---
title: "{{title}}"
slug: "{{slug}}"
date: "{{date}}"
contentType: "book"
status: "draft"
author: "C. G. Jung"
publicationYear: "ปีที่พิมพ์"
tags:
  - book
  - primary-source
---

# {{title}}

<BookPreview 
  title="{{title}}" 
  author="C. G. Jung" 
  year="ระบุปีที่พิมพ์ (Year)" 
/>

## ข้อมูลบรรณานุกรม (Bibliographic Context)

<!-- คำแนะนำ: ระบุรายละเอียดบรรณานุกรม บริบทในขณะที่เขียน และสถานะของหนังสือเล่มนี้ในแวดวงวิชาการ -->

หนังสือเล่มนี้ถูกเขียนขึ้นในช่วงเวลาที่ผู้เขียนกำลังเผชิญกับ... และถือเป็นจุดเปลี่ยนสำคัญในประวัติศาสตร์ปัญญา...

## สรุปแนวคิดสำคัญ (Key Takeaways & Summary)

<!-- คำแนะนำ: สรุปสาระสำคัญ ประเด็นหลักในแต่ละบท หรือทฤษฎีที่เป็นหัวใจของตำราเล่มนี้ -->

* **ประเด็นที่ 1**: การสำรวจโครงสร้างลึกของ Psyche
* **ประเด็นที่ 2**: ความสำคัญของสัญลักษณ์และภาพในจิตไร้สำนึก

## บทวิเคราะห์เชิงลึก (Critical Analysis)

<!-- คำแนะนำ: วิเคราะห์จุดแข็ง ข้อจำกัด การอภิปรายเชิงวิพากษ์ และคุณค่าที่นำมาประยุกต์ใช้ในปัจจุบัน -->

การตีความงานชิ้นนี้จำเป็นต้องเข้าใจมุมมองทางโศกนาฏกรรมและการค้นพบตนเอง...

## แหล่งอ้างอิงและข้อความสำคัญ (Key Citations)

* > "ข้อความอ้างอิงสำคัญจากตำรา (Key Quote)" — หน้า/บทที่อ้างถึง
* บรรณานุกรมฉบับมาตรฐานและบทวิจารณ์วิชาการที่เกี่ยวข้อง
`,
  },

  symbol: {
    id: "symbol",
    nameTh: "สัญลักษณ์และต้นแบบ",
    nameEn: "Symbol",
    description: "สำหรับสัญลักษณ์ทางจิตวิทยา ปรัชญา ตำนาน และอาร์คีไทป์ (เช่น Ouroboros, Mandala)",
    icon: "category",
    defaultTags: ["symbol", "archetype", "mythology"],
    requiredHeadings: [
      "ปรากฏการณ์ในจิตไร้สำนึกและตำนาน",
      "การตีความเชิงจิตวิทยา",
      "ตัวอย่างในความฝันและศิลปะ",
      "แหล่งอ้างอิง",
    ],
    templateMdx: `---
title: "{{title}}"
slug: "{{slug}}"
date: "{{date}}"
contentType: "symbol"
status: "draft"
tags:
  - symbol
  - archetype
  - mythology
---

# {{title}}

<SymbolCard 
  name="{{title}}" 
  meaning="ความหมายเชิงต้นแบบทางจิตวิทยา (Archetypal Meaning)" 
/>

## ปรากฏการณ์ในจิตไร้สำนึกและตำนาน (Mythological & Archetypal Manifestation)

<!-- คำแนะนำ: อภิปรายว่าสัญลักษณ์นี้ปรากฏขึ้นอย่างไรในตำนานปรัมปรา พิธีกรรม และประวัติศาสตร์ความเชื่อข้ามวัฒนธรรม -->

สัญลักษณ์ {{title}} เป็นภาพตัวแทนดึกดำบรรพ์ (Primordial Image) ที่สะท้อนผ่านวัฒนธรรมต่าง ๆ ทั่วโลก เช่น...

## การตีความเชิงจิตวิทยา (Psychological Interpretation)

<!-- คำแนะนำ: วิเคราะห์ความหมายในมุมมองจิตวิทยาวิเคราะห์ ว่าสัญลักษณ์นี้สะท้อนภาวะใดของจิตใจหรือกระบวนการภายใน -->

ในมิติของจิตไร้สำนึก สัญลักษณ์นี้ทำหน้าที่เป็นสื่อกลางที่ช่วยบูรณาการความขัดแย้งระหว่าง...

## ตัวอย่างในความฝันและศิลปะ (Dreams & Artistic Expression)

<!-- คำแนะนำ: ยกตัวอย่างการปรากฏตัวของสัญลักษณ์ในความฝันของผู้คน งานศิลปะ หรือวรรณกรรมสำคัญ -->

* **ในความฝัน**: มักปรากฏในจังหวะชีวิตที่บุคคลกำลังแสวงหาสมดุลหรือการคลี่คลายทางจิตใจ
* **ในงานศิลปะและวรรณกรรม**: แสดงออกผ่านภาพประกอบ โครงสร้างทางสถาปัตยกรรม และกวีนิพนธ์

## แหล่งอ้างอิง (References)

* Jung, C. G. (1964). *Man and His Symbols*. Doubleday.
* งานศึกษาวิเคราะห์เชิงสัญลักษณ์และปรัมปราวิทยาในคลัง ARCHRON
`,
  },

  article: {
    id: "article",
    nameTh: "บทความเชิงวิเคราะห์",
    nameEn: "Article",
    description: "สำหรับบทความวิเคราะห์เชิงลึก ความเรียงทางวิชาการ และบทสังเคราะห์ความคิด",
    icon: "newspaper",
    defaultTags: ["article", "analysis", "reflection"],
    requiredHeadings: [
      "บทนำและข้อเสนอหลัก",
      "การวิเคราะห์และข้อโต้แย้ง",
      "บทสรุปและการประยุกต์ใช้",
      "แหล่งอ้างอิง",
    ],
    templateMdx: `---
title: "{{title}}"
slug: "{{slug}}"
date: "{{date}}"
contentType: "article"
status: "draft"
tags:
  - article
  - analysis
---

# {{title}}

## บทนำและข้อเสนอหลัก (Introduction & Thesis)

<!-- คำแนะนำ: เกริ่นนำบริบทของคำถามทางปัญญา พร้อมระบุข้อเสนอหลัก (Thesis Statement) ของบทความนี้อย่างชัดเจน -->

ในโลกปัจจุบันที่โครงสร้างทางความคิดมีความซับซ้อน บทความนี้นำเสนอข้อโต้แย้งว่า...

## การวิเคราะห์และข้อโต้แย้ง (Analysis & Argumentation)

<!-- คำแนะนำ: คลี่คลายประเด็นวิเคราะห์อย่างเป็นระบบ ยกตัวอย่าง ทฤษฎีที่รองรับ และข้อวิพากษ์เพื่อขยายความเข้าใจ -->

เมื่อพิจารณาผ่านกรอบความรู้สึกนึกคิดและจิตวิทยาลึกซึ้ง เราสามารถแบ่งการวิเคราะห์ออกเป็นประเด็นสำคัญดังนี้:

* **มิติที่ 1**: ...
* **มิติที่ 2**: ...

## บทสรุปและการประยุกต์ใช้ (Conclusion & Synthesis)

<!-- คำแนะนำ: สรุปข้อค้นพบ สังเคราะห์ประเด็นที่อภิปราย และเสนอแนะแนวทางการนำไปขบคิดต่อในชีวิตจริง -->

โดยสรุป การทำความเข้าใจประเด็นดังกล่าวช่วยให้เรามองเห็นโครงสร้างภายในของตนเองและสังคมในมุมมองที่กระจ่างชัดขึ้น...

## แหล่งอ้างอิง (References)

* รายชื่อหนังสือ เอกสารอ้างอิง และบทความวิชาการที่ใช้ในการวิเคราะห์
`,
  },

  term: {
    id: "term",
    nameTh: "คำศัพท์เฉพาะทาง",
    nameEn: "Term",
    description: "สำหรับคำนิยาม คำศัพท์เฉพาะ และพจนานุกรมจิตวิทยาปัญญา",
    icon: "tag",
    defaultTags: ["term", "lexicon", "definition"],
    requiredHeadings: [
      "นิยามแบบกระชับ",
      "บริบทและการใช้ในจิตวิทยา",
      "คำที่เกี่ยวข้องหรือตรงข้าม",
      "แหล่งอ้างอิง",
    ],
    templateMdx: `---
title: "{{title}}"
slug: "{{slug}}"
date: "{{date}}"
contentType: "term"
status: "draft"
tags:
  - term
  - lexicon
---

# {{title}}

<DefinitionBlock 
  term="{{title}}" 
  definition="คำอธิบายสรุปสั้น ๆ ของคำศัพท์เฉพาะทางใน 1-2 ประโยค" 
/>

## นิยามแบบกระชับ (Concise Definition)

<!-- คำแนะนำ: อธิบายความหมายที่ตรงไปตรงมาและรัดกุมของคำศัพท์นี้ตามมาตรฐานพจนานุกรมเชิงวิชาการ -->

**{{title}}** คือ...

## บริบทและการใช้ในจิตวิทยา (Usage Context)

<!-- คำแนะนำ: อภิปรายว่าคำนี้ถูกนำไปใช้จริงในตัวบททางวิชาการ การวิเคราะห์ หรือทางคลินิกอย่างไร -->

คำศัพท์นี้มักถูกใช้อธิบายสภาวะหรือกลไกเมื่อ...

## คำที่เกี่ยวข้องหรือตรงข้าม (Related & Antonym Terms)

<!-- คำแนะนำ: ระบุคำศัพท์ที่มีความสัมพันธ์ใกล้ชิดหรือมีความหมายในเชิงตรงข้ามเพื่อเชื่อมโยงความเข้าใจ -->

* **คำที่เกี่ยวข้อง (Synonyms / Related Terms)**: ...
* **คำคู่ตรงข้าม (Antonyms / Contrasting Terms)**: ...

## แหล่งอ้างอิง (References)

* พจนานุกรมจิตวิทยาวิเคราะห์และคำศัพท์วิชาการที่เกี่ยวข้อง
`,
  },
};

/**
 * ดึงข้อมูล Blueprint ตาม ID ที่ระบุ รองรับ alias เช่น "person" -> "thinker"
 * หากไม่พบจะ fallback ไปที่ "concept" หรือ "article" ตามความเหมาะสม
 */
export function getBlueprint(id: BlueprintId | string): KnowledgeBlueprint {
  if (id === "person" || id === "thinker") {
    return BLUEPRINTS.thinker;
  }
  if (id in BLUEPRINTS) {
    return BLUEPRINTS[id as BlueprintId];
  }
  // Fallback สำหรับกรณีไม่ทราบรหัส
  return BLUEPRINTS.concept;
}

/**
 * คืนค่ารายการ Blueprints ทั้งหมด 6 รายการ
 */
export function getAllBlueprints(): KnowledgeBlueprint[] {
  return [
    BLUEPRINTS.thinker,
    BLUEPRINTS.concept,
    BLUEPRINTS.book,
    BLUEPRINTS.symbol,
    BLUEPRINTS.article,
    BLUEPRINTS.term,
  ];
}

/**
 * สร้าง string MDX พร้อมแทนที่ placeholders (`{{title}}`, `{{slug}}`, `{{date}}`)
 * อย่างสะอาดและพร้อมใช้งานใน Workspace Editor
 */
export function generateMdxFromBlueprint(
  id: BlueprintId | string,
  title?: string,
  slug?: string
): string {
  const blueprint = getBlueprint(id);
  const resolvedTitle = title?.trim() || `${blueprint.nameTh} (หัวข้อใหม่)`;
  const resolvedSlug = slug?.trim() || `untitled-${blueprint.id}`;
  const resolvedDate = new Date().toISOString().split("T")[0];

  return blueprint.templateMdx
    .replace(/\{\{title\}\}/g, resolvedTitle)
    .replace(/\{\{slug\}\}/g, resolvedSlug)
    .replace(/\{\{date\}\}/g, resolvedDate);
}
