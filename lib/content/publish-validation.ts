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
  id: string;                   // UUID — สร้างอัตโนมัติเมื่อเปิดบทความใหม่
  title: string;
  slug: string;
  status: string;
  contentType: string;
  framework: string;
  mainThinker: string;
  difficulty: string;
  tags: string[];
  visualExplanation: string;
  technicalMeaning: string;
  bodyMarkdown: string;
  relatedConcepts: EditorRelatedConcept[];
  references: EditorReference[];
  rootsEtymology: string;
  rootsMeaningShift: string;
  rootsCaution: string;
  coverImage: string;  // R2 URL or empty
  shortDescription: string;
  school: string;
  rowName: string;     // ชื่อแสดง (auto: title ถ้าไม่ใส่)
  rowCode: string;     // รหัสสั้น (auto: ART-001, CON-003 — ไม่แก้เอง)
};

export const EMPTY_DRAFT: EditorDraft = {
  id: "",
  title: "",
  slug: "",
  status: "draft",
  contentType: "article",
  framework: "",
  mainThinker: "",
  difficulty: "beginner",
  tags: [],
  visualExplanation: "",
  technicalMeaning: "",
  bodyMarkdown: "",
  relatedConcepts: [],
  references: [],
  rootsEtymology: "",
  rootsMeaningShift: "",
  rootsCaution: "",
  coverImage: "",
  shortDescription: "",
  school: "",
  rowName: "",
  rowCode: "",
};

export type ChecklistItem = { label: string; ok: boolean };

export function getPublishChecklist(d: EditorDraft): ChecklistItem[] {
  const hasRefsOrNeedsCheck =
    d.references.length > 0 || d.status === "needs-source-check";
  const hasRoots =
    d.rootsEtymology.trim() !== "" || d.rootsCaution.trim() !== "";
  return [
    { label: "มี Title", ok: d.title.trim() !== "" },
    { label: "มี Slug", ok: d.slug.trim() !== "" },
    { label: "มี Content Type", ok: d.contentType !== "" },
    { label: "มี Framework", ok: d.framework.trim() !== "" },
    { label: "มีคำอธิบายให้เห็นภาพ", ok: d.visualExplanation.trim() !== "" },
    { label: "มีความหมายทางวิชาการ / เทคนิค", ok: d.technicalMeaning.trim() !== "" },
    { label: "มี Related Concepts อย่างน้อย 1", ok: d.relatedConcepts.length > 0 },
    {
      label: "มี References หรือ Status = Needs Source Check",
      ok: hasRefsOrNeedsCheck,
    },
    { label: "มี Roots หรือเหตุผลที่ยังไม่ใส่", ok: hasRoots },
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
