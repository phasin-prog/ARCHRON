# ARCHRON — Content Architecture v0.1

> Phase 3 · จัดทำโดย Orchestrator (draft) · อิง Brand v0.1 + Reading Page Template v1
> ⚠️ draft — Content Architecture Agent (ร่วมกับ Wiki Architecture) เป็นเจ้าของจริง ให้ review เป็น v1
> content model อยู่ที่ `types/content.ts`

---

## 1. Content Type List

| Type | ใช้ทำอะไร |
|------|-----------|
| article | บทความอธิบาย/วิเคราะห์/ตีความประเด็นหนึ่ง |
| concept | หน้าแนวคิดหลัก เช่น Ego, Shadow, Self |
| reading-set | ชุดอ่าน/ซีรีส์ที่มีลำดับ |
| source-note | บันทึกจากแหล่งอ้างอิง |
| person | นักคิด |
| book | หนังสือ/งานเขียน |
| school | สำนักคิด/สาย |
| symbol | สัญลักษณ์ |
| term | คำศัพท์เฉพาะ |

> โครง node เชิงลึกของ concept/person/book/school/symbol/term กำหนดเต็มใน Phase 7 (Wiki Architecture)

---

## 2. Required Fields (ต่อ content type)

**ทุก type ต้องมี:** title · slug · status · contentType

| Type | field ที่ควรมีเพิ่ม |
|------|---------------------|
| article | framework, visualExplanation, technicalMeaning, relatedConcepts (≥1), references *หรือ* status=needs-source-check, difficulty |
| concept | mainTerm, shortDescription, technicalMeaning, relatedConcepts, references, roots (หรือเหตุผลที่ยังไม่ใส่) |
| reading-set | shortDescription, รายการ article ตามลำดับ, relatedConcepts |
| source-note | references (อย่างน้อย 1), relatedClaim, sourceType |
| person/book/school/symbol/term | ตาม node schema (Phase 7) |

**Optional (ใส่ต่อเมื่อมั่นใจ):** ipa · originalTerm · languageRoot · partOfSpeech · roots
> กฎ: ถ้าไม่มั่นใจ etymology/IPA/POS → ห้ามใส่

---

## 3. Reading Template (ลำดับ 12 ขั้นของหน้าอ่าน)
1. Title / Concept Identity
2. Thai Name / Original Term / IPA / Part of Speech
3. สำนัก / กรอบทฤษฎี (Framework)
4. ข้อมูลผู้เขียน
5. วันเผยแพร่ & อัปเดต
6. คำอธิบายให้เห็นภาพ
7. ความหมายทางวิชาการ / เทคนิค
8. แนวคิดที่เกี่ยวข้อง
9. เอกสารอ้างอิง
10. Roots — ที่มาของคำ / ประวัติศาสตร์
11. อ่านต่อ / Related Articles
12. CTA ไป Constellation Map (ถ้ารายการเยอะ)

---

## 4. Roots Rule
- Roots = etymology / historical usage / meaning shift / caution
- อยู่ท้ายเนื้อหาก่อน CTA
- **ห้ามใช้รากศัพท์แทนนิยามเชิงทฤษฎี** และห้ามทำให้คำดูศักดิ์สิทธิ์/สายมูเกินจริง
- ไม่มั่นใจ → เว้น หรือตั้ง status = needs-source-check

---

## 5. Related Concepts Rule
- แต่ละ relation ต้องมี **relationType** + **reason สั้น ๆ** (ห้ามเชื่อมเพราะชื่อคล้าย)
- relationType: prerequisite / related / contrasts-with / part-of / source-of / used-in / influenced-by
- แบ่งกลุ่มแสดงผล: แนวคิดพื้นฐานควรอ่านก่อน · เชื่อมโดยตรง · ช่วยเปรียบเทียบ
- **ถ้า related รวม > 6 รายการ** → แสดง 3–6 รายการสำคัญในหน้าอ่าน แล้วส่งต่อ Constellation Map (Phase 12)

---

## 6. Source Separation Rule
- แยก **primary-source / secondary-source / commentary / editorial-interpretation** ออกจากกันเสมอ ห้ามรวมกลุ่มเดียว
- ทุก claim สำคัญต้องระบุได้ว่า source ใดรองรับ (relatedClaim)
- ข้อความที่เป็นการตีความของเว็บ ต้องติดป้าย editorial-interpretation
- ยังไม่มีแหล่ง → status = needs-source-check (ไม่ publish)

---

## 7. Tags & Difficulty
- **Tags** มีหน้าที่จริง (ค้นหา/เชื่อมโยง) เช่น jung, shadow, individuation, psychoanalysis, beginner — ห้าม tag คำสวย (deep, powerful, awakening)
- **Difficulty:** beginner / intermediate / advanced / source-note

---

## 8. Main Categories (ฐานเริ่มต้น ปรับตามเนื้อหาจริง)
Depth Psychology · Psychoanalysis · Philosophy · Symbol/Myth · Thinkers & Schools · Reading Paths · Source Notes

> Category = ที่เก็บ · Reading Path = ทางเดิน — ห้ามปนกัน
