# ARCHRON — Illustration System (Phase 33)

> ระบบภาพประกอบสำหรับ ARCHRON — แนวทางการออกแบบและใช้งาน

---

## 1. Philosophy (ปรัชญา)

ภาพประกอบใน ARCHRON ต้อง:
- **เสริมเนื้อหา** ไม่ใช่装饰 (decoration)
- **ให้ความเข้าใจ** ไม่ใช่แค่ความสวยงาม
- **รักษาโทน** ของ "ห้องสมุดแห่งความเข้าใจ"
- **ไม่รบกวน** การอ่าน (quiet interface)

---

## 2. Illustration Types (ประเภทภาพประกอบ)

### 2.1 Conceptual Diagrams (แผนภาพแนวคิด)
- ใช้อธิบายความสัมพันธ์ระหว่างแนวคิด
- สไตล์: minimal line art, ไม่ใช้สีฉูดฉาด
- สี: ใช้ tokens ที่มีอยู่ (--color-burnished-gold, --color-psyche)
- ตัวอย่าง: แผนภาพ Archetype, แผนภาพ Ego-Self

### 2.2 Timeline Visualizations (ภาพประกอบ Timeline)
- ใช้แสดงพัฒนาการตามกาลเวลา
- สไตล์: horizontal/vertical line with nodes
- สี: ใช้ตามยุคสมัย (ancient, enlightenment, modern, contemporary)

### 2.3 Knowledge Maps (แผนที่ความรู้)
- ใช้แสดงความเชื่อมโยงระหว่างสำนักคิด/นักคิด
- สไตล์: constellation style, nodes and edges
- สี: ตาม discipline accents

### 2.4 Empty State Illustrations (ภาพประกอบสถานะว่าง)
- ใช้เมื่อไม่มีเนื้อหา
- สtíl์: minimal, single color, line art
- สี: --color-muted (8A8F98)

---

## 3. Style Guidelines (แนวทางสไตล์)

### Line Weight
- หลัก: 1.5px (strokeWidth={1.5})
- บาง: 1px (สำหรับรายละเอียด)
- หนา: 2px (สำหรับเน้น)

### Colors
- ใช้ currentColor เป็นหลัก
- หรือใช้ CSS variables: --ico-main, --ico-light, --ico-deep
- ห้ามใช้สีนอก palette

### Complexity
- 保持ความเรียบง่าย (minimal)
- รายละเอียดเท่าที่จำเป็น
- ห้ามมี noise หรือ detail 过多

### Animation
- ห้าม animate 除非จำเป็นจริงๆ
- ถ้า animate ต้อง:
  - respects prefers-reduced-motion
  - 使 用 transform/opacity เท่านั้น
  - duration ไม่เกิน 300ms

---

## 4. SVG Sprite System (ระบบ SVG Sprite)

 ARCHRON ใช้ SVG sprite สำหรับ 3D isometric icons:

```html
<svg class="icon-3d" aria-hidden="true" style={{ "--ico-main": "#C79A4A" }}>
  <use href="/icons/archron-icons.svg#reading-set" />
</svg>
```

### CSS Variables for Icons
- `--ico-main`: สีหลัก (default: #C79A4A)
- `--ico-light`: สีสว่าง (default: #E7D7A6)
- `--ico-deep`: สีเข้ม (default: #6E5528)
- `--ico-ivory`: สีงาช้าง (default: #F4F1EA)

---

## 5. Placeholder System (ระบบPlaceholder)

เมื่อยังไม่มีภาพประกอบจริง ใช้:

### Icon Placeholders
```tsx
<span className="material-symbols-outlined text-[48px] text-muted">
  concept  {/* หรือ icon ที่เหมาะสม */}
</span>
```

### Gradient Placeholders
```tsx
<div className="h-48 rounded-lg bg-gradient-to-br from-surface-container to-surface-container-low" />
```

---

## 6. File Locations (ตำแหน่งไฟล์)

| ไฟล์ | หน้าที่ |
|------|---------|
| `public/icons/archron-icons.svg` | SVG sprite 3D isometric |
| `components/icons.tsx` | Line icons (React components) |
| `app/globals.css` | Icon CSS variables |

---

## 7. Anti-Patterns (สิ่งที่ห้ามทำ)

- ❌ ห้ามใช้ stock photos ที่ดู generic
- ❌ ห้ามใช้ illustration ที่ดู cartoon หรือ playful
- ❌ ห้ามใช้สีฉูดฉาด (neon, gradient หลายสี)
- ❌ ห้ามใช้ detail 过多 จนรบกวนเนื้อหา
- ❌ ห้าม animate ทุกอย่าง (visual noise)
