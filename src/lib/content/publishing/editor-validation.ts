import type { EditorDraft } from "./publish-validation";

export type SeverityLevel = "error" | "warning" | "suggestion";

export type ValidationIssue = {
  fieldId: string;
  label: string;
  severity: SeverityLevel;
  message: string;
  whyItMatters: string;
  sectionName: string;
};

export function validateEditorDraft(
  draft: EditorDraft,
  touchedFields?: Set<string>
): {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
  all: ValidationIssue[];
  byField: Record<string, ValidationIssue>;
  canPublish: boolean;
} {
  const issues: ValidationIssue[] = [];
  const ct = draft.contentType || "article";
  const isArticle = ct === "article";
  const isConcept = ct === "concept";
  const isPerson = ct === "person";
  const isSymbol = ct === "symbol";
  const isTerm = ct === "term";

  // 1. Title
  if (!draft.title || !draft.title.trim()) {
    issues.push({
      fieldId: "field-title",
      label: "Title (ชื่อหัวข้อ)",
      severity: "error",
      message: "🛑 ระบุชื่อหัวข้อบทความหรือแนวคิดที่ชัดเจนและเข้าใจง่าย",
      whyItMatters: "ชื่อหัวข้อคือจุดแรกที่ผู้อ่านและระบบสืบค้นเห็น เป็นตัวแทนหลักของเนื้อหาในคลังความรู้",
      sectionName: "ข้อมูลพื้นฐาน",
    });
  }

  // 2. Slug
  if (!draft.slug || !draft.slug.trim()) {
    issues.push({
      fieldId: "field-slug",
      label: "Slug (ลิงก์ถาวร)",
      severity: "error",
      message: "🛑 กำหนด Slug เป็นภาษาอังกฤษตัวพิมพ์เล็กหรือตัวเลขคั่นด้วยยัติภังค์ (เช่น analytical-psychology)",
      whyItMatters: "Slug เป็น URL ถาวรของบทความ สำหรับใช้ในการอ้างอิงและเชื่อมโยง Wikilink [[...]]",
      sectionName: "ข้อมูลพื้นฐาน",
    });
  }

  const bm = draft.bodyMarkdown || "";

  const hasFrameworkSSOT =
    draft.framework.trim() !== "" ||
    /#[#]?\s*(กรอบคิด|กรอบทฤษฎี|Framework|แขนงวิชา)/i.test(bm) ||
    /\[Framework:\s*[^\]]+\]/i.test(bm);

  const hasVisualSSOT =
    draft.visualExplanation.trim() !== "" ||
    /#[#]?\s*(คำอธิบายเชิงประจักษ์|คำอธิบายให้เห็นภาพ|ภาพเปรียบเปรย|Visual Explanation|ตัวอย่างให้เห็นภาพ)/i.test(bm) ||
    />\s*\[!(NOTE|TIP|IMPORTANT)\]\s*คำอธิบาย/i.test(bm);

  const hasTechnicalSSOT =
    draft.technicalMeaning.trim() !== "" ||
    /#[#]?\s*(นิยาม|ความหมายทางวิชาการ|นิยามและแก่น|นิยามเชิงเทคนิค|Technical Meaning|แก่นทางวิชาการ)/i.test(bm);

  const hasRootsSSOT =
    (draft.rootsEtymology && draft.rootsEtymology.trim() !== "") ||
    (draft.rootsCaution && draft.rootsCaution.trim() !== "") ||
    /#[#]?\s*(รากศัพท์|ที่มาของคำ|Etymology|Roots|การเปลี่ยนความหมาย|รากคำ)/i.test(bm);

  const hasRelatedSSOT =
    (draft.relatedConcepts && draft.relatedConcepts.length > 0) ||
    /\[\[[^\]]+\]\]/.test(bm) ||
    /#[#]?\s*(แนวคิดที่เกี่ยวข้อง|Related Concepts|เชื่อมโยง)/i.test(bm);

  const hasRefsSSOT =
    (draft.references && draft.references.length > 0) ||
    draft.status === "needs-source-check" ||
    /\[\^?\d+\]/.test(bm) ||
    /#[#]?\s*(แหล่งอ้างอิง|อ้างอิง|References|Citations|ตำรา)/i.test(bm);

  // 3. Framework
  if (!isTerm && !isSymbol && !hasFrameworkSSOT) {
    issues.push({
      fieldId: "field-framework",
      label: "Framework (กรอบทฤษฎี/แขนงวิชา)",
      severity: "error",
      message: "🛑 เลือกกรอบทฤษฎีหลักหรือเขียนระบุหัวข้อ '## กรอบทฤษฎี (Framework)' ใน Body Markdown เพื่อให้ผู้อ่านและระบบ Constellation ทราบพิกัดความรู้",
      whyItMatters: "ช่วยให้ระบบสามารถเชื่อมโยงและจัดหมวดหมู่ความรู้ในแผนที่ Constellation ได้อย่างถูกต้องตามแนวทาง Academic Knowledge Graph",
      sectionName: "ข้อมูลพื้นฐานและกรอบแนวคิด",
    });
  }

  // 4. Visual Explanation
  if ((isArticle || isConcept || isSymbol || isTerm) && !hasVisualSSOT) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "คำอธิบายให้เห็นภาพ (Visual Explanation)",
      severity: "suggestion",
      message: "💡 แนะนำให้อธิบายภาพเปรียบเปรย หรือเขียนหัวข้อ '## คำอธิบายให้เห็นภาพ (Visual Explanation)' ใน Body Markdown เพื่อให้บุคคลทั่วไปเข้าใจแนวคิดนี้ได้ทันทีตั้งแต่ย่อหน้าแรก",
      whyItMatters: "ช่วยเปลี่ยนนามธรรมที่ซับซ้อนให้กลายเป็นภาพจำในใจผู้อ่าน ทำให้เนื้อหาวิชาการเข้าถึงง่ายและน่าติดตาม",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  // 5. Technical Meaning
  if ((isArticle || isConcept || isPerson) && !hasTechnicalSSOT) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "ความหมายทางวิชาการ / เทคนิค (Technical Meaning)",
      severity: "suggestion",
      message: "💡 แนะนำให้ระบุนิยามทางวิชาการหรือเขียนหัวข้อ '## นิยามและความหมายทางวิชาการ (Technical Meaning)' ใน Body Markdown เพื่อคงความแม่นยำตามมาตรฐาน Archron",
      whyItMatters: "เป็นรากฐานความแม่นยำทางวิชาการ สำหรับนักศึกษาและผู้ค้นคว้าที่ต้องการอ้างอิงและทำความเข้าใจแก่นทฤษฎีเชิงลึก",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  // 6. Roots / Etymology / Caution — แนะนำสำหรับ concept/term/article
  if ((isConcept || isTerm) && !hasRootsSSOT) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "รากศัพท์หรือเหตุผลที่ยังไม่ใส่ (Roots / Etymology)",
      severity: "suggestion",
      message: "💡 แนะนำให้ระบุที่มาและรากศัพท์ หรือเขียนหัวข้อ '## รากศัพท์และการเปลี่ยนความหมาย (Etymology & Roots)' ใน Body Markdown",
      whyItMatters: "การเข้าใจรากศัพท์และประวัติศาสตร์การเปลี่ยนความหมาย (Etymology) คือกุญแจสำคัญสู่ความเข้าใจจิตใจมนุษย์เชิงลึกตามวิถี Archron",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  if (isArticle && !hasRootsSSOT) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "รากศัพท์หรือที่มา (Roots / Etymology) — ไม่บังคับ",
      severity: "warning",
      message: "💡 หากบทความเกี่ยวข้องกับศัพท์เฉพาะ แนะนำให้ระบุรากศัพท์ หรือเขียนหัวข้อ '## รากศัพท์และการเปลี่ยนความหมาย (Etymology & Roots)' ใน Body Markdown (ไม่บังคับสำหรับบทความ)",
      whyItMatters: "รากศัพท์ช่วยให้ผู้อ่านเข้าใจที่มาของแนวคิด แต่บทความที่เป็นการตีความหรือวิเคราะห์อาจไม่จำเป็นต้องมี",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  // 7. Related Concepts
  if (!isTerm && !isSymbol && !hasRelatedSSOT) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "Related Concepts (แนวคิดที่เกี่ยวข้อง)",
      severity: "error",
      message: "🛑 ใช้ลิงก์ภายใน [[ชื่อโหนด]] ใน Body Markdown เพื่อเชื่อมโยงและขยายโครงข่ายปัญญา (Knowledge Graph)",
      whyItMatters: "โครงการ Archron ออกแบบในรูปแบบโครงข่ายความรู้ การเชื่อมโยงช่วยให้ผู้อ่านสำรวจหัวข้อที่เกี่ยวเนื่องและเห็นภาพรวมข้ามศาสตร์ได้ไม่รู้จบ",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  // 8. References
  if (!hasRefsSSOT) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "References (แหล่งอ้างอิง/ตำรา)",
      severity: "error",
      message: "🛑 เขียนหัวข้อ '## แหล่งอ้างอิง (References)' หรือใช้เชิงอรรถ [^1] ใน Body Markdown เพื่อระบุตำราหลัก",
      whyItMatters: "แหล่งอ้างอิงคือเกราะป้องกันข้อมูลคลาดเคลื่อน และเป็นการให้เกียรติปัญญาชนผู้บุกเบิกทฤษฎี",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  // 9. Body Markdown
  if (isArticle && (!draft.bodyMarkdown || !draft.bodyMarkdown.trim())) {
    issues.push({
      fieldId: "field-body-markdown",
      label: "เนื้อหาบทความ (Body Markdown)",
      severity: "error",
      message: "🛑 เขียนเนื้อหาบทความ (Body Markdown) เพื่อให้ผู้อ่านได้รับสาระสำคัญอย่างครบถ้วนสมบูรณ์",
      whyItMatters: "เนื้อหาหลักคือหัวใจของบทความ ที่อธิบายการเดินทางทางปัญญาและการวิเคราะห์เชิงลึก",
      sectionName: "ห้องเขียนเนื้อหาหลัก (Studio Workspace)",
    });
  }

  // Warnings
  if (!draft.shortDescription || draft.shortDescription.trim().length < 20) {
    issues.push({
      fieldId: "field-short-description",
      label: "คำอธิบายสั้น / บทคัดย่อ (Short Description)",
      severity: "warning",
      message: "⚠️ เขียนสรุปบทคัดย่อสั้น ๆ 1-2 ประโยค สำหรับแสดงบนการ์ดและผลลัพธ์การค้นหาในหน้าแรก",
      whyItMatters: "บทคัดย่อที่กระชับและดึงดูด ช่วยเพิ่มอัตราการคลิกอ่านและช่วยในด้าน SEO ของเว็บไซต์",
      sectionName: "ข้อมูลพื้นฐานและกรอบแนวคิด",
    });
  }

  if (!draft.tags || draft.tags.length === 0) {
    issues.push({
      fieldId: "field-tags",
      label: "คำค้น / แท็ก (Tags)",
      severity: "warning",
      message: "⚠️ เพิ่มคำค้น (Tags) อย่างน้อย 2-3 คำ คั่นด้วยคอมมา เพื่อช่วยในการจัดหมวดหมู่",
      whyItMatters: "คำค้นช่วยให้ผู้ใช้พบเนื้อหาของท่านได้ง่ายขึ้นเมื่อค้นหาด้วยคำศัพท์เฉพาะในระบบค้นหากลาง",
      sectionName: "ข้อมูลพื้นฐานและกรอบแนวคิด",
    });
  }

  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const suggestions = issues.filter((i) => i.severity === "suggestion");
  const canPublish = errors.length === 0;

  const byField: Record<string, ValidationIssue> = {};
  for (const issue of issues) {
    // Keep the highest severity issue per field
    if (!byField[issue.fieldId] || issue.severity === "error") {
      byField[issue.fieldId] = issue;
    }
  }

  return {
    errors,
    warnings,
    suggestions,
    all: issues,
    byField,
    canPublish,
  };
}
