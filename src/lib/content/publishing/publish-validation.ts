// Publish validation (Phase 8/9) — ตรวจความพร้อมก่อน publish ตาม Publish Checklist v0.1

export type EditorRelatedConcept = {
  conceptSlug: string;
  relationType: string;
  reason: string;
};

export type EditorReference = {
  sourceType: string;
  title: string;
  relatedClaim: string;
};

export type EditorDraft = {
  id: string;                   // UUID , สร้างอัตโนมัติเมื่อเปิดบทความใหม่
  title: string;
  slug: string;
  status: string;
  contentType: string;

  // Common fields
  framework: string;
  difficulty: string;
  tags: string[];
  bodyMarkdown: string;
  relatedConcepts: EditorRelatedConcept[];
  references: EditorReference[];
  coverImage: string;  // R2 URL or empty
  shortDescription: string;
  school: string;
  rowName: string;     // ชื่อแสดง (auto: title ถ้าไม่ใส่)
  rowCode: string;     // รหัสสั้น (auto: ART-001, CON-003 , ไม่แก้เอง)

  // Concept-specific
  mainTerm: string;
  thaiName: string;
  originalTerm: string;
  partOfSpeech: string;
  languageRoot: string;
  ipa: string;
  visualExplanation: string;
  technicalMeaning: string;
  rootsEtymology: string;
  rootsMeaningShift: string;
  rootsCaution: string;

  // Person-specific
  mainThinker: string;
  bornYear: string;
  diedYear: string;
  nationality: string;
  keyIdeas: string;       // comma-separated string for form editing
  notableWorks: string;   // comma-separated string for form editing

  // Book-specific
  publicationYear: string;
  publisher: string;
  isbn: string;

  // School-specific
  founder: string;
  period: string;

  // CTA
  articleSlugs?: string[];
  conceptSlugs?: string[];
  readingSetSlugs?: string[];
};

export const EMPTY_DRAFT: EditorDraft = {
  id: "", title: "", slug: "", status: "draft", contentType: "article",
  framework: "", difficulty: "beginner", tags: [], bodyMarkdown: "",
  relatedConcepts: [], references: [], coverImage: "", shortDescription: "",
  school: "", rowName: "", rowCode: "",
  mainTerm: "", thaiName: "", originalTerm: "", partOfSpeech: "",
  languageRoot: "", ipa: "", visualExplanation: "", technicalMeaning: "",
  rootsEtymology: "", rootsMeaningShift: "", rootsCaution: "",
  mainThinker: "", bornYear: "", diedYear: "", nationality: "",
  keyIdeas: "", notableWorks: "",
  publicationYear: "", publisher: "", isbn: "",
  founder: "", period: "",
};

export type ChecklistItem = { label: string; ok: boolean };

export function getPublishChecklist(d: EditorDraft, contentType?: string): ChecklistItem[] {
  const ct = contentType || d.contentType;
  const bm = d.bodyMarkdown || "";

  const hasFrameworkSSOT =
    d.framework.trim() !== "" ||
    /#[#]?\s*(กรอบคิด|กรอบทฤษฎี|Framework|แขนงวิชา)/i.test(bm) ||
    /\[Framework:\s*[^\]]+\]/i.test(bm);

  const hasVisualSSOT =
    d.visualExplanation.trim() !== "" ||
    /#[#]?\s*(คำอธิบายเชิงประจักษ์|คำอธิบายให้เห็นภาพ|ภาพเปรียบเปรย|Visual Explanation|ตัวอย่างให้เห็นภาพ)/i.test(bm) ||
    />\s*\[!(NOTE|TIP|IMPORTANT)\]\s*คำอธิบาย/i.test(bm);

  const hasTechnicalSSOT =
    d.technicalMeaning.trim() !== "" ||
    /#[#]?\s*(นิยาม|ความหมายทางวิชาการ|นิยามและแก่น|นิยามเชิงเทคนิค|Technical Meaning|แก่นทางวิชาการ)/i.test(bm);

  const hasRootsSSOT =
    (d.rootsEtymology && d.rootsEtymology.trim() !== "") ||
    (d.rootsCaution && d.rootsCaution.trim() !== "") ||
    /#[#]?\s*(รากศัพท์|ที่มาของคำ|Etymology|Roots|การเปลี่ยนความหมาย|รากคำ)/i.test(bm);

  const hasRelatedSSOT =
    d.relatedConcepts.length > 0 ||
    /\[\[[^\]]+\]\]/.test(bm) ||
    /#[#]?\s*(แนวคิดที่เกี่ยวข้อง|Related Concepts|เชื่อมโยง)/i.test(bm);

  const hasRefsSSOT =
    d.references.length > 0 ||
    d.status === "needs-source-check" ||
    /\[\^?\d+\]/.test(bm) ||
    /#[#]?\s*(แหล่งอ้างอิง|อ้างอิง|References|Citations|ตำรา)/i.test(bm);

  const isArticle = ct === "article";
  const isConcept = ct === "concept";
  const isPerson = ct === "person";
  const isSymbol = ct === "symbol";
  const isTerm = ct === "term";

  return [
    { label: "มี Title", ok: d.title.trim() !== "" },
    { label: "มี Slug", ok: d.slug.trim() !== "" },
    { label: "มี Content Type", ok: d.contentType !== "" },
    {
      label: "มี Framework",
      ok: isTerm || isSymbol ? true : Boolean(hasFrameworkSSOT),
    },
    {
      label: "มีคำอธิบายให้เห็นภาพ",
      ok: isArticle || isConcept || isSymbol || isTerm ? Boolean(hasVisualSSOT) : true,
    },
    {
      label: "มีความหมายทางวิชาการ / เทคนิค",
      ok: isArticle || isConcept || isPerson ? Boolean(hasTechnicalSSOT) : true,
    },
    {
      label: "มี Related Concepts อย่างน้อย 1",
      ok: isTerm || isSymbol ? true : Boolean(hasRelatedSSOT),
    },
    {
      label: "มี References หรือ Status = Needs Source Check",
      ok: Boolean(hasRefsSSOT),
    },
    {
      label: isConcept || isTerm ? "มี Roots หรือเหตุผลที่ยังไม่ใส่" : "มี Roots (ไม่บังคับ)",
      ok: isConcept || isTerm ? Boolean(hasRootsSSOT) : true,
    },
    {
      label: "มีเนื้อหา (Body Markdown)",
      ok: isArticle ? bm.trim() !== "" : true,
    },
  ];
}

export function canPublish(items: ChecklistItem[]): boolean {
  return items.every((i) => i.ok);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
