# The Soul's Compass — Wiki Architecture v0.1

> Phase 7 · จัดทำโดย Orchestrator (draft) · Wiki Architecture Agent เป็นเจ้าของจริง
> โค้ด: `lib/content/concept-registry.ts`, `lib/content/related.ts`

---

## Node Types
concept · person · book · school · symbol · term
แต่ละชนิดมีหน้าที่ต่างกัน — ห้ามทุกหน้ากลายเป็นบทความเหมือนกันหมด (รายละเอียด template เต็มอยู่ในสเปก Wiki Architecture Agent)

## Slug Rules
- สั้น · lowercase · ใช้ hyphen แทน space · ไม่เปลี่ยนบ่อย (กระทบ internal links/backlinks)
- ตัวอย่าง: `shadow`, `collective-unconscious`, `carl-jung`, `psychological-types`

## Alias Rules
- รองรับชื่อเรียกหลายแบบของ node เดียว เช่น Carl Jung → [C. G. Jung, Jung, ยุง, คาร์ล ยุง]
- ใช้ช่วยค้นหา/เชื่อมโยง — ห้ามสร้าง alias เยอะจนมั่ว

## Canonical Rule
- ถ้ามีหลายชื่อ ให้เลือก canonical เพียงหนึ่ง (เช่น Self) ที่เหลือเป็น alias/Thai label
- **ห้ามสร้าง node แยกเพราะแปลต่างกันเล็กน้อย** — `resolveConcept()` ตรวจ slug → title → thaiTitle → alias เพื่อกันซ้ำ

## Relation Types
prerequisite · related · contrasts-with · part-of · source-of · used-in · influenced-by
> ทุก relation ต้องมีเหตุผล (reason) — ห้ามเชื่อมเพราะชื่อคล้ายกันเฉย ๆ

## Backlinks
- Concept page ต้องรู้ว่ามีบทความใดอ้างถึง (`getBacklinksForConcept`)
- แสดงพร้อม context สั้น ๆ ว่าลิงก์กลับมาเพราะอะไร

## Related Articles
- `getRelatedArticles` ให้คะแนนจาก concept ร่วม > framework > thinker > updatedAt
- ถ้า related รวม > 6 → แสดง 3–6 รายการ + CTA ไป Constellation Map (`shouldUseConstellation`)
