# Support / Patron Page Redesign — ARCHRON

**Date:** 2026-07-06
**Approach:** C — "The Covenant"
**Status:** Spec ready for review

---

## Philosophy

This page is **not** a fundraising page. It is an invitation to preserve a library.

ARCHRON is intentionally simple. Do not invent systems that do not exist (no newsletters, Discord servers, private forums, membership tiers, or supporter-exclusive platforms).

Honesty is more important than perceived completeness.

**Golden rule:** Never "pay to unlock." Instead: "Support the continued existence of this library."

---

## Tone & Language

- Calm, scholarly, human, honest, humble, warm, inviting, timeless
- Natural Thai — no marketing clichés, urgency, FOMO, or conversion language
- Never use: Premium, VIP, Exclusive Content, donor rankings, sponsorship tiers, gamification
- Use instead: Companion, ผู้อุปถัมภ์

---

## Narrative Flow (7 sections)

### 1. Hero / บทนำ

A quiet, declaration-like invitation.

- **Heading:** "สนับสนุนคลังความรู้นี้ให้คงอยู่"
- **Lead:** หนึ่งบรรทัด — สะท้อนว่า ARCHRON ไม่ใช่ธุรกิจ แต่เป็นสถาบันความรู้
- **Subtitle:** อธิบายสั้นๆ ว่า ARCHRON คืออะไรและทำไมถึงมีอยู่

### 2. "ทำไมความรู้ต้องเปิดกว้าง"

- ความรู้ทางจิตวิทยา/ปรัชญาเป็นมรดกของมนุษย์ ไม่ใช่สินค้า
- ห้องสมุดนี้จึงไม่ล็อกเนื้อหาหลัก
- ผู้คนควรเข้าถึงแนวคิดเหล่านี้ได้โดยไม่มีกำแพง

### 3. "ทำไมเราต้องการความช่วยเหลือ"

โปร่งใส ซื่อสัตย์:

- เซิร์ฟเวอร์ + Domain + Storage
- หนังสือและแหล่งอ้างอิงวิชาการ
- เวลาในการค้นคว้า เขียน แปล เรียบเรียง
- น้ำเสียงเหมือนเพื่อนร่วมทาง

### 4. หนทางแห่งการสนับสนุน

ไม่ใช่ sales funnel — ทุกทางเท่าเทียมกัน:

- **อ่านอย่างตั้งใจ** — ใช้เวลากับเนื้อหา อ่านแหล่งอ้างอิง
- **แบ่งปันอย่างมีบริบท** — ส่งต่อแนวคิดพร้อมบริบท ไม่ตัดทอนเป็นคำคม
- **แจ้งข้อผิดพลาด** — ช่วยทักท้วงหรือเพิ่มเติมข้อมูลอ้างอิง
- **ร่วมเขียน** — แบ่งปันบทความที่ตรวจสอบอ้างอิงแล้ว → `/studio`
- **สนับสนุนผ่าน Psychological Type Guide** — รายได้หล่อเลี้ยงคลังความรู้ → `/guide`

### 5. "The Covenant" — ARCHRON Companion

ไม่ใช่ Supporter Wall / donor ranking

- **Heading:** "ARCHRON Companion"
- **Concept:** Companion คือผู้ที่เลือกเดินเคียงข้างโครงการนี้ เงียบๆ และช่วยให้มันคงอยู่
- **Display:** PromptPay QR Code + รายละเอียด
- **Bank:** ธนาคารกสิกรไทย
- **Account Name:** พศิน พสุมาตร
- **PromptPay / Account Number:** 146-1-96727-9
- **Amount:** ยืดหยุ่น เท่าไหร่ก็ได้
- **Form:** รายครั้ง (one-time)
- **Level:** ระดับเดียว — ไม่มี tier, ไม่มี exclusive benefits
- **No invented perks:** ไม่มี newsletter ส่วนตัว, ไม่มีกลุ่มสนทนาส่วนตัว, ไม่มีสิทธิพิเศษที่ยังไม่มี
- **Companion names:** แสดงรายชื่อผู้ที่เลือกเป็น Companion (ถ้าต้องการ) — ไม่เป็นลำดับ ไม่มีระดับ

### 6. "อีกหนึ่งหนทาง: Jungian Type Guide"

- **Heading:** "อีกหนึ่งหนทางที่จะร่วมเดิน"
- รายได้จาก Type Guide หล่อเลี้ยงคลังความรู้
- ไม่ใช่ "ซื้อบริการ" แต่เป็นการได้รับการวิเคราะห์เชิงลึกไปพร้อมกับการสนับสนุน
- ลิงก์ไป `/guide`

### 7. ส่งท้าย

ประโยคเงียบๆ ทิ้งท้าย:

> ARCHRON จะยังคงเปิดกว้างสำหรับทุกคน หากฉันเลือกที่จะช่วย ฉันจะกลายเป็นหนึ่งในผู้ที่ quietly ดูแลคลังนี้ให้คงอยู่

---

## Visual Direction

- ใช้ `PageScaffold` เช่นเดิม
- โทนมืดตาม cosmology
- PromptPay QR: display เป็น card ตรงกลาง
- ARCHRON Companion: รายชื่อ static array (เรียบๆ ไม่มีลำดับ)
- ไม่มี badges, tiers, rankings

---

## Implementation Notes

- `app/support/page.tsx` — rewrite เนื้อหาทั้งหมด
- `PageScaffold` import จาก `@/components/page-scaffold`
- `Metadata` ต้องอัปเดต description
- ไม่ต้องแก้ stylesheet หรือ component อื่น
- PromptPay QR: สร้าง QR code image หรือใช้ QR URL service
- ARCHRON Companion: static array of names (เริ่มต้นใส่ชื่อตัวอย่าง หรือปล่อยว่าง)
