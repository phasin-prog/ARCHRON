import type { ContentEntry } from "@/types/content";

// Phase 13 — Initial Content Seed
// slug ทุกตัวตรงกับ concept-registry เพื่อให้ related links, backlinks และ node pages เชื่อมกันจริง
export const entries: ContentEntry[] = [
  {
    id: "concept-concept",
    title: "Psyche",
    slug: "concept",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-24",
    updatedAt: "2026-06-28",
    mainTerm: "Psyche",
    thaiName: "ไซคี",
    originalTerm: "psukhē (Greek)",
    partOfSpeech: "noun",
    languageRoot: "Greek",
    ipa: "/ˈsaɪ.kiː/",
    shortDescription:
      "ระบบชีวิตทางจิตทั้งหมด ทั้งส่วนที่รู้ตัวและส่วนที่ยังทำงานอยู่ใต้ระดับการรู้ตัว",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "intermediate",
    tags: ["concept", "depth-psychology", "jung"],
    visualExplanation:
      "Psyche ไม่ได้หมายถึงจิตใจในความหมายแคบแบบความคิดประจำวัน แต่เป็นชื่อเรียกพื้นที่ทั้งหมดของชีวิตภายใน ทั้งส่วนที่เรารู้ตัวและส่วนที่ยังทำงานอยู่ใต้ระดับการรู้ตัว",
    technicalMeaning:
      "ในกรอบจิตวิทยาวิเคราะห์ Psyche หมายถึงระบบชีวิตทางจิตทั้งหมด ไม่จำกัดอยู่เฉพาะ Ego หรือจิตสำนึก แต่รวมถึง unconscious, complexes, archetypal patterns และกระบวนการที่ทำให้ชีวิตภายในจัดรูปตัวเอง",
    relatedConcepts: [
      { conceptSlug: "ego", relationType: "part-of", reason: "Ego เป็นศูนย์กลางของจิตสำนึกภายใน Psyche" },
      { conceptSlug: "unconscious", relationType: "part-of", reason: "จิตไร้สำนึกเป็นส่วนสำคัญของ Psyche" },
      { conceptSlug: "self", relationType: "related", reason: "Self คือศูนย์รวมและภาพรวมของ Psyche" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Collected Works", relatedClaim: "นิยาม Psyche ในกรอบจิตวิทยาวิเคราะห์" },
      { sourceType: "editorial-interpretation", title: "การเรียบเรียงของ ARCHRON", relatedClaim: "สรุปภาพรวมเพื่อการอ่าน เป็นการตีความ ไม่ใช่ข้อความจากแหล่งต้นทาง" },
    ],
    roots: {
      etymology: "concept มาจากภาษากรีก psukhē ซึ่งเกี่ยวข้องกับลมหายใจ ชีวิต หรือวิญญาณในบางบริบทโบราณ",
      meaningShift: "เมื่อเข้าสู่จิตวิทยาสมัยใหม่ คำนี้ถูกใช้เพื่อพูดถึงระบบชีวิตทางจิต ไม่ใช่เพียง soul ในความหมายศาสนา",
      caution: "รากศัพท์ช่วยให้เห็นประวัติของคำ แต่ไม่ควรใช้แทนนิยามเชิงทฤษฎีโดยตรง",
    },
    relatedCTA: { conceptSlugs: ["ego", "unconscious", "self"], showConstellationMap: false },
  },

  {
    id: "concept-ego",
    title: "Ego",
    slug: "ego",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Ego",
    thaiName: "อัตตา",
    originalTerm: "ego (Latin)",
    partOfSpeech: "noun",
    languageRoot: "Latin",
    shortDescription: "ศูนย์กลางของจิตสำนึก ส่วนที่บุคคลรู้สึกว่าเป็น ตัวฉัน ในชีวิตประจำวัน",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "beginner",
    tags: ["ego", "jung", "depth-psychology", "beginner"],
    visualExplanation:
      "Ego คือจุดที่เรารู้สึกว่าเป็น ฉัน เป็นผู้ตัดสินใจและจดจำในแต่ละวัน แต่มันเป็นเพียงส่วนหนึ่งของชีวิตภายใน ไม่ใช่ทั้งหมด",
    technicalMeaning:
      "ในจิตวิทยาวิเคราะห์ Ego เป็นศูนย์กลางของจิตสำนึก ทำหน้าที่เชื่อมประสบการณ์เข้ากับความรู้สึกของความต่อเนื่องและตัวตน แต่อยู่ภายใต้ภาพรวมที่ใหญ่กว่าคือ Self",
    relatedConcepts: [
      { conceptSlug: "concept", relationType: "part-of", reason: "Ego เป็นส่วนหนึ่งของ Psyche ทั้งหมด" },
      { conceptSlug: "persona", relationType: "related", reason: "Persona คือวิธีที่ Ego ปรับตัวต่อโลกสังคม" },
      { conceptSlug: "shadow", relationType: "contrasts-with", reason: "Shadow คือสิ่งที่ Ego ไม่ต้องการรับรู้" },
      { conceptSlug: "self", relationType: "part-of", reason: "Ego เป็นส่วนหนึ่งภายใต้ Self" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Two Essays on Analytical Psychology", relatedClaim: "บทบาทของ Ego ในโครงสร้างจิต" },
      { sourceType: "editorial-interpretation", title: "การเรียบเรียงของ ARCHRON", relatedClaim: "คำอธิบายเบื้องต้นเพื่อผู้อ่านใหม่" },
    ],
    roots: {
      etymology: "ego เป็นคำละตินแปลว่า ฉัน",
      caution: "ในภาษาทั่วไป ego มักหมายถึงความถือตัว ซึ่งต่างจากความหมายเชิงเทคนิคในจิตวิทยาวิเคราะห์",
    },
    relatedCTA: { conceptSlugs: ["persona", "shadow", "self"], showConstellationMap: false },
  },

  {
    id: "concept-persona",
    title: "Persona",
    slug: "persona",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Persona",
    thaiName: "หน้ากากทางสังคม",
    originalTerm: "persona (Latin)",
    partOfSpeech: "noun",
    languageRoot: "Latin",
    shortDescription: "ภาพที่บุคคลแสดงต่อโลกภายนอก เพื่อปรับตัวเข้ากับบทบาทและความคาดหวังทางสังคม",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "beginner",
    tags: ["persona", "jung", "depth-psychology"],
    visualExplanation:
      "Persona เปรียบได้กับหน้ากากที่เราสวมเมื่ออยู่ในบทบาทต่าง ๆ เช่น ที่ทำงานหรือในครอบครัว มันมีประโยชน์ในการเข้าสังคม แต่ไม่ใช่ตัวตนทั้งหมดของเรา",
    technicalMeaning:
      "Persona คือระบบการปรับตัวระหว่าง Ego กับโลกภายนอก เมื่อบุคคลระบุตัวเองกับ Persona มากเกินไป อาจสูญเสียการติดต่อกับชีวิตภายในส่วนอื่น",
    relatedConcepts: [
      { conceptSlug: "ego", relationType: "related", reason: "Persona คือวิธีที่ Ego นำเสนอตัวต่อสังคม" },
      { conceptSlug: "shadow", relationType: "contrasts-with", reason: "สิ่งที่ไม่เข้ากับ Persona มักถูกผลักไปเป็น Shadow" },
      { conceptSlug: "self", relationType: "part-of", reason: "Persona เป็นเพียงด้านหนึ่งภายใต้ Self" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Two Essays on Analytical Psychology", relatedClaim: "นิยาม Persona และความสัมพันธ์กับ Ego" },
    ],
    roots: {
      etymology: "persona เป็นคำละติน หมายถึงหน้ากากที่นักแสดงสวมในละครกรีก-โรมัน",
      caution: "การโยงรากศัพท์ หน้ากาก ช่วยให้เห็นภาพ แต่ไม่ได้แปลว่า Persona เป็นเพียงการแกล้งทำเสมอไป",
    },
    relatedCTA: { conceptSlugs: ["ego", "shadow", "self"], showConstellationMap: false },
  },

  {
    id: "concept-shadow",
    title: "Shadow",
    slug: "shadow",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Shadow",
    thaiName: "เงา",
    partOfSpeech: "noun",
    shortDescription: "ส่วนของชีวิตภายในที่ Ego ไม่ต้องการรับรู้หรือยอมรับ",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "intermediate",
    tags: ["shadow", "jung", "depth-psychology"],
    visualExplanation:
      "Shadow คือสิ่งที่เรามักไม่อยากเห็นในตัวเอง และมักปรากฏผ่านการตัดสินผู้อื่นอย่างรุนแรงโดยไม่รู้ตัว",
    technicalMeaning:
      "Shadow ประกอบด้วยเนื้อหาที่ถูกกันออกจากจิตสำนึกเพราะไม่เข้ากับภาพของ Ego หรือ Persona การทำงานกับ Shadow คือการค่อย ๆ รับรู้และรวมส่วนเหล่านี้กลับเข้ามาอย่างมีสติ",
    relatedConcepts: [
      { conceptSlug: "ego", relationType: "related", reason: "Shadow คือสิ่งที่ Ego ผลักออกไป" },
      { conceptSlug: "persona", relationType: "contrasts-with", reason: "สิ่งที่ขัดกับ Persona มักกลายเป็น Shadow" },
      { conceptSlug: "self", relationType: "related", reason: "การรวม Shadow เป็นส่วนหนึ่งของการเข้าใกล้ Self" },
      { conceptSlug: "archetype", relationType: "related", reason: "Shadow เป็นหนึ่งใน archetype สำคัญ" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Aion", relatedClaim: "Shadow ในฐานะ archetype" },
      { sourceType: "editorial-interpretation", title: "การเรียบเรียงของ ARCHRON", relatedClaim: "คำอธิบายเชิงปฏิบัติเพื่อการอ่าน" },
    ],
    relatedCTA: { conceptSlugs: ["ego", "persona", "self", "archetype"], showConstellationMap: false },
  },

  {
    id: "concept-self",
    title: "Self",
    slug: "self",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Self",
    thaiName: "ตัวตนทั้งหมด",
    originalTerm: "Selbst (German)",
    partOfSpeech: "noun",
    languageRoot: "German",
    shortDescription: "ภาพรวมและศูนย์รวมของชีวิตทางจิต ไม่ใช่เพียง Ego",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "advanced",
    tags: ["self", "jung", "individuation"],
    visualExplanation:
      "ถ้า Ego คือจุดศูนย์กลางของจิตสำนึก Self คือศูนย์กลางและขอบเขตของชีวิตทางจิตทั้งหมด ทั้งที่รู้ตัวและไม่รู้ตัว",
    technicalMeaning:
      "Self เป็นทั้งศูนย์กลางและองค์รวมของ Psyche เป็นหลักการที่จัดระเบียบและนำกระบวนการ individuation Jung แยก Self ออกจาก Ego อย่างชัดเจน",
    relatedConcepts: [
      { conceptSlug: "ego", relationType: "part-of", reason: "Ego เป็นส่วนหนึ่งภายใต้ Self" },
      { conceptSlug: "individuation", relationType: "related", reason: "Individuation คือกระบวนการเข้าใกล้ Self" },
      { conceptSlug: "archetype", relationType: "related", reason: "Self เป็น archetype ของความเป็นองค์รวม" },
      { conceptSlug: "concept", relationType: "related", reason: "Self คือศูนย์รวมของ Psyche" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Aion", relatedClaim: "นิยาม Self และความต่างจาก Ego" },
    ],
    relatedCTA: { conceptSlugs: ["ego", "individuation", "archetype"], showConstellationMap: false },
  },

  {
    id: "concept-archetype",
    title: "Archetype",
    slug: "archetype",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Archetype",
    thaiName: "แบบฉบับดั้งเดิม",
    originalTerm: "arkhetupon (Greek)",
    partOfSpeech: "noun",
    languageRoot: "Greek",
    shortDescription: "แบบแผนร่วมที่ปรากฏซ้ำในจิตไร้สำนึก ความฝัน และตำนานของมนุษยชาติ",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "intermediate",
    tags: ["archetype", "jung", "symbol", "myth"],
    visualExplanation:
      "Archetype ไม่ใช่ภาพตายตัว แต่เป็นแนวโน้มที่ทำให้เกิดภาพและเรื่องเล่าคล้าย ๆ กันข้ามวัฒนธรรม เช่น แม่ วีรบุรุษ หรือเงา",
    technicalMeaning:
      "Archetype เป็นโครงสร้างเชิงแบบแผนใน Collective Unconscious ตัวมันเองไม่มีเนื้อหาตายตัว แต่จัดรูปประสบการณ์ให้ออกมาเป็นภาพและสัญลักษณ์เฉพาะวัฒนธรรม",
    relatedConcepts: [
      { conceptSlug: "collective-unconscious", relationType: "part-of", reason: "Archetype อยู่ในชั้น Collective Unconscious" },
      { conceptSlug: "self", relationType: "related", reason: "Self เป็น archetype ของความเป็นองค์รวม" },
      { conceptSlug: "shadow", relationType: "related", reason: "Shadow เป็นหนึ่งใน archetype สำคัญ" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "The Archetypes and the Collective Unconscious", relatedClaim: "นิยาม archetype" },
    ],
    roots: {
      etymology: "arkhetupon ภาษากรีก หมายถึง แบบแรก หรือ ต้นแบบ",
      caution: "archetype ไม่ใช่ภาพสำเร็จรูป การตีความเป็นภาพตายตัวเป็นความเข้าใจผิดที่พบบ่อย",
    },
    relatedCTA: { conceptSlugs: ["collective-unconscious", "self", "shadow"], showConstellationMap: false },
  },

  {
    id: "concept-individuation",
    title: "Individuation",
    slug: "individuation",
    status: "published",
    contentType: "concept",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Individuation",
    thaiName: "กระบวนการปัจเจกภาพ",
    partOfSpeech: "noun",
    shortDescription: "กระบวนการที่ชีวิตภายในค่อย ๆ จัดความสัมพันธ์ของตัวเองและเข้าใกล้ Self",
    framework: "Analytical Psychology",
    mainThinkers: ["Carl Jung"],
    difficulty: "advanced",
    tags: ["individuation", "jung", "self"],
    visualExplanation:
      "Individuation ไม่ใช่การพัฒนาตัวเองให้สมบูรณ์แบบ แต่เป็นการค่อย ๆ รับรู้และจัดความสัมพันธ์ระหว่างส่วนต่าง ๆ ของชีวิตภายในอย่างซื่อตรง",
    technicalMeaning:
      "Individuation คือกระบวนการที่ Ego สร้างความสัมพันธ์กับ unconscious และเคลื่อนเข้าหา Self โดยรวม Shadow, Persona และเนื้อหาอื่นเข้ามาอย่างมีสติ ไม่ใช่การกำจัดส่วนใดทิ้ง",
    relatedConcepts: [
      { conceptSlug: "self", relationType: "source-of", reason: "Self เป็นเป้าหมายที่จัดระเบียบกระบวนการ individuation" },
      { conceptSlug: "ego", relationType: "related", reason: "Ego ต้องสร้างความสัมพันธ์ใหม่กับ unconscious" },
      { conceptSlug: "shadow", relationType: "related", reason: "การรวม Shadow เป็นขั้นสำคัญของ individuation" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Two Essays on Analytical Psychology", relatedClaim: "คำอธิบายกระบวนการ individuation" },
      { sourceType: "editorial-interpretation", title: "การเรียบเรียงของ ARCHRON", relatedClaim: "เน้นย้ำว่า individuation ไม่ใช่ self-help" },
    ],
    relatedCTA: { conceptSlugs: ["self", "ego", "shadow"], showConstellationMap: false },
  },

  {
    id: "person-carl-jung",
    title: "Carl Jung",
    slug: "carl-jung",
    status: "published",
    contentType: "person",
    author: "ARCHRON",
    publishedAt: "2026-06-28",
    updatedAt: "2026-06-28",
    mainTerm: "Carl Jung",
    thaiName: "คาร์ล ยุง",
    shortDescription: "นักจิตวิทยาชาวสวิส ผู้วางรากฐานจิตวิทยาวิเคราะห์ (Analytical Psychology)",
    framework: "Analytical Psychology",
    difficulty: "intermediate",
    tags: ["jung", "depth-psychology"],
    visualExplanation:
      "Carl Jung (1875-1961) เป็นผู้พัฒนาแนวคิดอย่าง Self, Shadow, Archetype และ Individuation ซึ่งเป็นเสาหลักของจิตวิทยาเชิงลึก",
    technicalMeaning:
      "งานของ Jung วางกรอบให้กับการศึกษาจิตไร้สำนึกแบบที่ไม่ลดทอนเหลือเพียงแรงขับทางเพศ และเปิดพื้นที่ให้สัญลักษณ์ ตำนาน และศาสนาในฐานะข้อมูลของชีวิตทางจิต",
    relatedConcepts: [
      { conceptSlug: "self", relationType: "source-of", reason: "Jung เป็นผู้พัฒนาแนวคิด Self" },
      { conceptSlug: "shadow", relationType: "source-of", reason: "Shadow เป็นแนวคิดหลักในงานของ Jung" },
      { conceptSlug: "archetype", relationType: "source-of", reason: "Jung เป็นผู้วางแนวคิด archetype" },
      { conceptSlug: "individuation", relationType: "source-of", reason: "Individuation เป็นแกนกลางของงาน Jung" },
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Psychological Types", year: "1921", relatedClaim: "งานสำคัญที่วางแนวคิดประเภททางจิตวิทยา" },
      { sourceType: "secondary-source", title: "งานศึกษาเกี่ยวกับ Jung", relatedClaim: "บริบทและการตีความงานของ Jung" },
    ],
    relatedCTA: { conceptSlugs: ["self", "shadow", "archetype", "individuation"], showConstellationMap: false },
  },

  {
    id: "article-sea-journey",
    title: "การเดินทางทางทะเลในยามค่ำคืน: การเผชิญหน้ากับจิตไร้สำนึก",
    slug: "night-sea-journey",
    status: "published",
    contentType: "article",
    author: "ARCHRON",
    publishedAt: "2026-06-29",
    updatedAt: "2026-06-29",
    shortDescription: "สำรวจสัญลักษณ์การเดินทางทางทะเลในยามค่ำคืน (Night Sea Journey) ในฐานะภาพแทนของการเดินทางผ่านความมืดมิดของจิตใจเพื่อการกำเนิดใหม่ของตัวตน",
    framework: "Analytical Psychology",
    difficulty: "intermediate",
    tags: ["unconscious", "symbol", "individuation", "archetype"],
    visualExplanation: "การเดินทางในความมืดที่ไม่มีดวงดาว เพื่อค้นหาแสงสว่างที่ซ่อนอยู่ภายในส่วนลึกที่สุดของจิตใจ",
    technicalMeaning: "วิเคราะห์สัญลักษณ์ Night Sea Journey ตามแนวคิดของ Carl Jung ในฐานะกระบวนการที่ Ego ยอมจมลงสู่ Collective Unconscious เพื่อไปปฏิสัมพันธ์กับ archetypal structures และกลับขึ้นมาพร้อมกับบูรณาการตัวตนใหม่",
    bodyMarkdown: `## การเดินทางทางทะเลในยามค่ำคืน (Night Sea Journey)

ในจิตวิทยาวิเคราะห์ของ **คาร์ล ยุง (Carl Jung)** สัญลักษณ์การเดินทางทางทะเลในยามค่ำคืนเป็นสัญลักษณ์สากลที่สะท้อนถึงการเดินทางผ่านความมืดมิดของจิตใจเพื่อการกำเนิดใหม่ของตัวตน

### 1. ความหมายของสัญลักษณ์

การเดินทางในยามค่ำคืนบนทะเลที่ปั่นป่วนหมายถึงสภาวะที่ Ego หรือจิตสำนึกสูญเสียการควบคุมและต้องเผชิญหน้ากับความลึกซึ้งของจิตไร้สำนึก (Unconscious) มันไม่ได้เป็นเพียงความล้มเหลว แต่เป็นขั้นตอนจำเป็นของการพัฒนาปัจเจกภาพ (Individuation)

### 2. การเผชิญหน้าและบูรณาการ

เมื่อเผชิญกับมอนสเตอร์หรือความมืดในทะเลลึก บุคคลจะค่อย ๆ ค้นพบส่วนที่ขาดหายไปของตัวเอง (เช่น Shadow หรือ Anima/Animus) และนำมันกลับมาผสมผสานเข้ากับจิตสำนึก ทำให้เกิดการเติบโตและการหลอมรวมเข้ากับ Self ในที่สุด`,
    relatedConcepts: [
      { conceptSlug: "unconscious", relationType: "related", reason: "ทะเลในยามค่ำคืนคือสัญลักษณ์แทนจิตไร้สำนึก" },
      { conceptSlug: "individuation", relationType: "used-in", reason: "การเดินทางทางทะเลในยามค่ำคืนเป็นเสมือนแผนที่จำลองของกระบวนการปัจเจกภาพ" }
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "Collected Works Vol. 12: Psychology and Alchemy", relatedClaim: "บทวิเคราะห์สัญลักษณ์การเดินทางทางทะเลในยามค่ำคืน" }
    ],
    roots: {
      etymology: "Night Sea Journey (Nekyia) มีรากมาจากพิธีกรรมโบราณและการสืบหาความรู้ในโลกหลังความตาย",
      caution: "การเผชิญหน้ากับจิตไร้สำนึกมีความเสี่ยงที่ Ego จะถูกกลืนกิน หากไม่มีสติและการนำทางที่เหมาะสม"
    }
  },

  {
    id: "article-archetypes-intro",
    title: "ถอดรหัสแบบฉบับดั้งเดิม: วิธีที่ตำนานจัดรูปประสบการณ์ของเรา",
    slug: "decoding-archetypes",
    status: "published",
    contentType: "article",
    author: "ARCHRON",
    publishedAt: "2026-06-30",
    updatedAt: "2026-06-30",
    shortDescription: "ทำความเข้าใจแนวคิดแบบฉบับดั้งเดิม (Archetype) และความสำคัญของการรู้เท่าทันโครงสร้างร่วมทางจิตที่คอยกำหนดพฤติกรรมและการรับรู้ของเรา",
    framework: "Analytical Psychology",
    difficulty: "beginner",
    tags: ["archetype", "collective-unconscious", "symbol"],
    visualExplanation: "พิมพ์เขียวทางจิตที่มองไม่เห็น แต่เป็นตัวกำหนดรูปร่างของทุกประสบการณ์ในชีวิตเรา",
    technicalMeaning: "วิเคราะห์การทำงานของ Archetypes ใน Collective Unconscious และวิธีที่โครงสร้างเหล่านี้แปรเปลี่ยนประสบการณ์ส่วนบุคคลให้กลายเป็นภาพแทนที่เข้าใจได้ง่ายผ่านโครงเรื่องและสัญลักษณ์ทางวัฒนธรรม",
    bodyMarkdown: `## ถอดรหัสแบบฉบับดั้งเดิม (Archetypes)

แนวคิดเรื่อง **Archetype** เป็นหนึ่งในแนวคิดหลักที่ผู้คนมักเข้าใจคลาดเคลื่อนมากที่สุดในจิตวิทยาเชิงลึก

### 1. แบบแผนร่วมไม่ใช่ภาพสำเร็จรูป

ยุงเน้นย้ำว่า Archetype ไม่ใช่ภาพที่ถูกโปรแกรมไว้ล่วงหน้าในสมอง แต่เป็น **โครงสร้างที่ไม่มีเนื้อหา** คล้ายกับร่องน้ำที่รอให้น้ำ (ประสบการณ์ชีวิตส่วนบุคคล) ไหลผ่านและจัดรูปตามร่องนั้น

### 2. อิทธิพลต่อพฤติกรรมและสังคม

เมื่อเราตกอยู่ภายใต้อิทธิพลของ Archetype ใดอย่างรุนแรง (เช่น Hero หรือ Persona) เราจะแสดงพฤติกรรมตามทิศทางของแบบแผนนั้นโดยไม่รู้ตัว การตระหนักรู้เท่าทันจะช่วยให้เรามีอิสระจากการถูกครอบงำและปรับความสัมพันธ์กับชีวิตภายในได้ดียิ่งขึ้น`,
    relatedConcepts: [
      { conceptSlug: "archetype", relationType: "related", reason: "อธิบายภาพรวมและกลไกการทำงานของ Archetype" },
      { conceptSlug: "collective-unconscious", relationType: "part-of", reason: "Archetypes ตั้งอยู่ในจิตไร้สำนึกร่วม" }
    ],
    references: [
      { sourceType: "primary-source", author: "C. G. Jung", title: "The Archetypes and the Collective Unconscious", relatedClaim: "แนวคิดพื้นฐานและการทำงานของ Archetypes" }
    ],
    roots: {
      etymology: "มาจากภาษากรีก arkhe (ต้นกำเนิด) และ typos (แบบแผน/รอยพิมพ์)",
      caution: "หลีกเลี่ยงการนำไปใช้เป็นแบบทดสอบบุคลิกภาพสำเร็จรูป ซึ่งลดทอนความลึกและจุดประสงค์ดั้งเดิมของทฤษฎี"
    }
  }
];

export function getEntryBySlug(slug: string): ContentEntry | undefined {
  return entries.find((e) => e.slug === slug);
}

export function allEntrySlugs(): string[] {
  return entries.map((e) => e.slug);
}
