// lib/content/prompt-library.ts — Prompt Library (Phase 58)
// คลังคำสั่ง AI สำหรับการเขียนบทความ

export type PromptCategory =
  | "writing"
  | "editing"
  | "research"
  | "translation"
  | "analysis";

export type PromptTemplate = {
  id: string;
  name: string;
  nameEn: string;
  category: PromptCategory;
  description: string;
  prompt: string;
  variables?: string[];
  tags: string[];
};

export const PROMPT_CATEGORY_LABEL: Record<PromptCategory, string> = {
  writing: "การเขียน",
  editing: "การแก้ไข",
  research: "การวิจัย",
  translation: "การแปล",
  analysis: "การวิเคราะห์",
};

export const PROMPT_CATEGORY_ICON: Record<PromptCategory, string> = {
  writing: "edit",
  editing: "spellcheck",
  research: "science",
  translation: "translate",
  analysis: "analytics",
};

export const promptLibrary: PromptTemplate[] = [
  // Writing Prompts
  {
    id: "write-intro",
    name: "เขียนบทนำ",
    nameEn: "Write Introduction",
    category: "writing",
    description: "เขียนบทนำสำหรับบทความที่ดึงดูดผู้อ่านและแนะนำหัวข้อ",
    prompt: "เขียนบทนำสำหรับบทความเรื่อง {title} ที่:\n1. ดึงดูดความสนใจของผู้อ่านตั้งแต่ย่อหน้าแรก\n2. แนะนำหัวข้อและขอบเขตของบทความ\n3. ระบุว่าผู้อ่านจะได้เรียนรู้อะไรจากบทความนี้\n4. ใช้น้ำเสียงที่เป็นทางการแต่เข้าถึงง่าย",
    variables: ["title"],
    tags: ["introduction", "hook", "structure"],
  },
  {
    id: "write-conclusion",
    name: "เขียนบทสรุป",
    nameEn: "Write Conclusion",
    category: "writing",
    description: "เขียนบทสรุปที่สรุปประเด็นสำคัญและให้มุมมองเชิงลึก",
    prompt: "เขียนบทสรุปสำหรับบทความที่กล่าวถึงประเด็นต่อไปนี้:\n{key_points}\n\nบทสรุปควรมี:\n1. การสรุปประเด็นสำคัญ\n2. มุมมองเชิงลึกหรือการเชื่อมโยงกับประเด็นที่กว้างกว่า\n3. คำถามหรือชวนคิดต่อ\n4. ไม่ introduire ข้อมูลใหม่",
    variables: ["key_points"],
    tags: ["conclusion", "summary", "reflection"],
  },
  {
    id: "write-examples",
    name: "เขียนตัวอย่าง",
    nameEn: "Write Examples",
    category: "writing",
    description: "เขียนตัวอย่างที่ช่วยให้ผู้อ่านเข้าใจแนวคิดได้ดีขึ้น",
    prompt: "เขียนตัวอย่างที่เป็นรูปธรรมสำหรับแนวคิด '{concept}' ที่:\n1. เชื่อมโยงกับชีวิตประจำวันของผู้อ่าน\n2. แสดงให้เห็นว่าแนวคิดนี้ทำงานอย่างไรในทางปฏิบัติ\n3. หลีกเลี่ยงการใช้ตัวอย่างที่ซ้ำซ้อนหรือทั่วไปเกินไป\n4. ระบุว่าตัวอย่างนี้สอดคล้องกับแนวคิดอย่างไร",
    variables: ["concept"],
    tags: ["examples", "illustration", "practical"],
  },
  {
    id: "write-analogy",
    name: "เขียนอุปมา",
    nameEn: "Write Analogy",
    category: "writing",
    description: "เขียนอุปมาที่ช่วยอธิบายแนวคิดที่ซับซ้อนให้เข้าใจง่าย",
    prompt: "สร้างอุปมาสำหรับแนวคิด '{concept}' ที่:\n1. ใช้สิ่งที่ผู้อ่านคุ้นเคยในชีวิตประจำวัน\n2. อธิบายได้ว่าทำไมอุปมานี้จึงเหมาะสม\n3. ระบุข้อจำกัดของอุปมา\n4. ไม่ใช้อุปมาที่ทำให้เข้าใจผิด",
    variables: ["concept"],
    tags: ["analogy", "metaphor", "explanation"],
  },

  // Editing Prompts
  {
    id: "edit-clarity",
    name: "ปรับความชัดเจน",
    nameEn: "Improve Clarity",
    category: "editing",
    description: "ปรับปรุงความชัดเจนของเนื้อหาโดยไม่เปลี่ยนความหมาย",
    prompt: "ปรับปรุงความชัดเจนของข้อความต่อไปนี้ โดย:\n1. ตัดคำที่ซ้ำซ้อนหรือไม่จำเป็นออก\n2. ใช้ประโยคที่สั้นและกระชับขึ้น\n3. รักษาความหมายเดิมไว้\n4. ทำให้ผู้อ่านทั่วไปเข้าใจได้ง่ายขึ้น\n\nข้อความ:\n{text}",
    variables: ["text"],
    tags: ["clarity", "conciseness", "editing"],
  },
  {
    id: "edit-academic",
    name: "ปรับภาษาวิชาการ",
    nameEn: "Make Academic",
    category: "editing",
    description: "ปรับภาษาให้เป็นทางการและเหมาะสมกับบทความวิชาการ",
    prompt: "ปรับภาษาของข้อความต่อไปนี้ให้เป็นภาษาวิชาการที่เหมาะสม โดย:\n1. ใช้คำศัพท์ที่ถูกต้องตามบริบททางวิชาการ\n2. รักษาความเป็นกลางทางวิชาการ (ไม่ใช้อารมณ์)\n3. ใช้โครงสร้างประโยคที่เป็นทางการ\n4. อ้างอิงแหล่งที่มาถ้ามี\n\nข้อความ:\n{text}",
    variables: ["text"],
    tags: ["academic", "formal", "scholarly"],
  },
  {
    id: "edit-flow",
    name: "ปรับการไหล",
    nameEn: "Improve Flow",
    category: "editing",
    description: "ปรับปรุงการไหลของเนื้อหาให้ราบรื่นขึ้น",
    prompt: "ปรับปรุงการไหลของเนื้อหาต่อไปนี้ โดย:\n1. เพิ่มคำเชื่อมโยงระหว่างย่อหน้า\n2. จัดเรียงประโยคใหม่ให้เป็นลำดับขั้นตอน\n3. ลบประโยคที่ไม่เกี่ยวข้องออก\n4. ทำให้ผู้อ่านติดตามได้ง่ายขึ้น\n\nข้อความ:\n{text}",
    variables: ["text"],
    tags: ["flow", "transition", "coherence"],
  },

  // Research Prompts
  {
    id: "research-findings",
    name: "สรุปผลวิจัย",
    nameEn: "Summarize Research",
    category: "research",
    description: "สรุปผลการวิจัยที่เกี่ยวข้องกับหัวข้อ",
    prompt: "สรุปผลการวิจัยที่เกี่ยวข้องกับ '{topic}' โดย:\n1. ระบุงานวิจัยหลักที่เกี่ยวข้อง\n2. สรุปผลลัพธ์สำคัญ\n3. ชี้ให้เห็นข้อจำกัดของงานวิจัย\n4. แนะนำทิศทางการวิจัยต่อ\n\nหัวข้อ: {topic}",
    variables: ["topic"],
    tags: ["research", "summary", "findings"],
  },
  {
    id: "research-critique",
    name: "วิจารณ์งานวิจัย",
    nameEn: "Critique Research",
    category: "research",
    description: "วิจารณ์จุดแข็งและจุดอ่อนของงานวิจัย",
    prompt: "วิจารณ์งานวิจัยเรื่อง '{research_title}' โดย:\n1. ระบุจุดแข็งของงานวิจัย\n2. ชี้ให้เห็นข้อจำกัดและจุดอ่อน\n3. วิเคราะห์วิธีวิจัย\n4. ให้คะแนนความน่าเชื่อถือ (1-5)\n\nงานวิจัย: {research_title}\nผลลัพธ์: {findings}",
    variables: ["research_title", "findings"],
    tags: ["critique", "evaluation", "methodology"],
  },

  // Translation Prompts
  {
    id: "translate-thai",
    name: "แปลเป็นภาษาไทย",
    nameEn: "Translate to Thai",
    category: "translation",
    description: "แปลเนื้อหาเป็นภาษาไทยที่สละสลวย",
    prompt: "แปลข้อความต่อไปนี้เป็นภาษาไทย โดย:\n1. ใช้ภาษาไทยที่สละสลวยและเป็นธรรมชาติ\n2. รักษาความหมายเดิมไว้\n3. ใช้คำศัพท์ที่เหมาะสมกับบริบททางวิชาการ\n4. หลีกเลี่ยงการแปลคำศัพท์เฉพาะที่ควรใช้คำเดิม\n\nข้อความ:\n{text}",
    variables: ["text"],
    tags: ["translation", "thai", "academic"],
  },
  {
    id: "translate-english",
    name: "แปลเป็นภาษาอังกฤษ",
    nameEn: "Translate to English",
    category: "translation",
    description: "แปลเนื้อหาเป็นภาษาอังกฤษที่ถูกต้อง",
    prompt: "แปลข้อความภาษาไทยต่อไปนี้เป็นภาษาอังกฤษ โดย:\n1. ใช้ภาษาอังกฤษที่ถูกต้องตามหลักไวยากรณ์\n2. รักษาความหมายเดิมไว้\n3. ใช้คำศัพท์ที่เหมาะสมกับบริบททางวิชาการ\n4. ระบุคำศัพท์เฉพาะที่ใช้คำเดิมภาษาไทย\n\nข้อความ:\n{text}",
    variables: ["text"],
    tags: ["translation", "english", "academic"],
  },

  // Analysis Prompts
  {
    id: "analyze-theme",
    name: "วิเคราะห์ธีม",
    nameEn: "Analyze Theme",
    category: "analysis",
    description: "วิเคราะห์ธีมหลักของเนื้อหา",
    prompt: "วิเคราะห์ธีมหลักของเนื้อหาต่อไปนี้ โดย:\n1. ระบุธีมหลักและธีมรอง\n2. วิเคราะห์ว่าธีมเหล่านี้เชื่อมโยงกันอย่างไร\n3. ชี้ให้เห็นรูปแบบที่ปรากฏซ้ำ\n4. ให้มุมมองเชิงลึกเกี่ยวกับธีม\n\nเนื้อหา:\n{text}",
    variables: ["text"],
    tags: ["analysis", "theme", "pattern"],
  },
  {
    id: "analyze-argument",
    name: "วิเคราะห์ข้อโต้แย้ง",
    nameEn: "Analyze Argument",
    category: "analysis",
    description: "วิเคราะห์ข้อโต้แย้งและความถูกต้อง",
    prompt: "วิเคราะห์ข้อโต้แย้งต่อไปนี้ โดย:\n1. ระบุข้อสรุปและเหตุผล\n2. วิเคราะห์ความถูกต้องของเหตุผล\n3. ชี้ให้เห็นข้อผิดพลาดเชิงตรรกศาสตร์ (ถ้ามี)\n4. ให้คะแนนความน่าเชื่อถือ (1-5)\n\nข้อโต้แย้ง:\n{text}",
    variables: ["text"],
    tags: ["argument", "logic", "evaluation"],
  },
];

export function getPromptById(id: string): PromptTemplate | undefined {
  return promptLibrary.find((p) => p.id === id);
}

export function getPromptsByCategory(category: PromptCategory): PromptTemplate[] {
  return promptLibrary.filter((p) => p.category === category);
}

export function searchPrompts(query: string): PromptTemplate[] {
  const q = query.toLowerCase();
  return promptLibrary.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
}

export function fillPromptTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}
