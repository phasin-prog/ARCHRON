# ARCHRON — Photography System (Phase 34)

> ระบบภาพถ่ายสำหรับ ARCHRON — แนวทางการใช้งานและการ treatment

---

## 1. Philosophy (ปรัชญา)

ภาพถ่ายใน ARCHRON ต้อง:
- **ให้ความรู้สึก** ของ "ห้องสมุด" หรือ "หอดูดาวทางปัญญา"
- **ไม่ใช่ decoration** แต่เป็น content
- **รักษาโทนมืด** ของระบบ
- **ไม่รบกวน** การอ่าน

---

## 2. Photo Types (ประเภทภาพถ่าย)

### 2.1 Thinker Portraits (ภาพนักคิด)
- ใช้แสดงนักคิด/นักปราชญ์
- สไตล์: black & white หรือ sepia tone
- กรอบ: วงกลม หรือกรอบเรียบ
- ห้าม: ภาพสีสดใส, ภาพการตลาด

### 2.2 Historical Photos (ภาพประวัติศาสตร์)
- ใช้แสดงเหตุการณ์หรือสถานที่ทางประวัติศาสตร์
- สไตล์: grayscale, vintage, grain
- treatment: sepia, contrast adjustment

### 2.3 Concept Illustrations (ภาพประกอบแนวคิด)
- ใช้แทน diagram เมื่อเหมาะกว่า
- สไตล์: abstract, minimal, monochrome

---

## 3. Treatment Rules (กฎการ Treatment)

### Color Treatment
```
.filter-grayscale { filter: grayscale(100%); }
.filter-sepia { filter: sepia(80%); }
.filter-vintage { filter: sepia(40%) contrast(1.1); }
.filter-muted { filter: saturate(0.6) brightness(0.9); }
```

### Overlay Treatments
```
.overlay-dark { background: rgba(11, 13, 18, 0.6); }
.overlay-gold { background: linear-gradient(to bottom, transparent, rgba(199, 154, 74, 0.2)); }
```

### Border Treatments
```
.border-subtle { border: 1px solid rgba(255, 255, 255, 0.06); }
.border-vintage { border: 2px solid rgba(199, 154, 74, 0.3); }
```

---

## 4. Size Guidelines (แนวทางขนาด)

| Context | Size | Aspect Ratio |
|---------|------|--------------|
| Thinker Card | 120x120px | 1:1 (circle) |
| Article Hero | 800x400px | 2:1 |
| Thumbnail | 400x300px | 4:3 |
| Banner | 1200x400px | 3:1 |

---

## 5. Responsive Behavior (การตอบสนอง)

- Mobile: ลดขนาด 50%
- Tablet: ลดขนาด 75%
- Desktop: ขนาดเต็ม

---

## 6. Performance (ประสิทธิภาพ)

- ใช้ Next.js Image component เสมอ
- ใช้ blur placeholder สำหรับ lazy load
- ใช้ WebP/AVIF format
- จำกัดขนาดไม่เกิน 200KB ต่อภาพ

---

## 7. Anti-Patterns (สิ่งที่ห้ามทำ)

- ❌ ห้ามใช้ภาพสีสดใส (vibrant colors)
- ❌ ห้ามใช้ภาพ stock ที่ดู generic
- ❌ ห้ามใช้ภาพที่มี text ซ้อนทับ
- ❌ ห้ามใช้ภาพที่มี watermark
- ❌ ห้ามใช้ภาพที่มี border หนา
- ❌ ห้ามใช้ภาพที่มี shadow หนัก
- ❌ ห้ามใช้ภาพที่มี gradient หลายสี
