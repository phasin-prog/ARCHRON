# ARCHRON Color Grammar — Phase 04

> **วัตถุประสงค์**: กฎการใช้สีในระบบ ARCHRON
> **อ้างอิง**: EDS.md §11 · AES.md §12 · AGENT-HANDOFF §12

---

## Golden Rule (กฎเหล็ก)

> **สีพื้นหลังหลักต้องคง `--color-deep-navy` (#080B16) เสมอ ห้ามเปลี่ยนตามศาสตร์**
> The main background color must always remain `--color-deep-navy` (#080B16) — never change by domain.

---

## Color Hierarchy (ลำดับชั้นสี)

### 1. Background Colors (สีพื้นหลัง)

```text
Background Layer (ชั้นพื้นหลัง)
├── Canvas: #080B16 (Deep Navy) ← หลัก ห้ามเปลี่ยน
├── Surface: #121826 (Midnight Blue) ← การ์ด, panels
├── Raised: #1C2335 ← ยกเด่น
└── Sunken: #0B0D12 ← จมลึก
```

### 2. Content Colors (สีเนื้อหา)

```text
Content Layer (ชั้นเนื้อหา)
├── Primary Text: #F4F1EA (Ivory) ← ตัวอักษรหลัก
├── Secondary Text: #DEDAD2 (Soft Ivory) ← ตัวอักษรอง
├── Muted Text: #8A8F98 (Stone Gray) ← ข้อมูลเสริม
└── Headings: #F4F1EA (Ivory) ← หัวข้อ
```

### 3. Accent Colors (สีแต้ม)

```text
Accent Layer (ชั้นสีแต้ม)
├── Brand: #C79A4A (Sapientia) ← brand elements
├── Links: #E7D7A6 (Lumen) ← ลิงก์
├── Selection: #E7D7A6 (Lumen) ← เลือกข้อความ
├── Focus: #C79A4A (Sapientia) ← โฟกัสคีย์บอร์ด
└── Domain-specific: ตามตาราง domain accents
```

### 4. UI Colors (สีส่วนติดต่อผู้ใช้)

```text
UI Layer (ชั้นส่วนติดต่อผู้ใช้)
├── Borders: #2C3852 (Slate Boundary) ← เส้นขอบ
├── Dividers: #222C41 ← เส้นแบ่ง
├── Success: #7FB08A ← สำเร็จ
├── Warning: #D8B56A ← คำเตือน
├── Danger: #C9776A ← อันตราย
└── Info: #6E93A8 ← ข้อมูล
```

---

## Domain Color Rules (กฎสีตามศาสตร์)

### When to Use Domain Colors

| ใช้กับ | วิธีใช้ |
|---|---|
| **Title/Heading** | สี domain accent |
| **Icons** | สี domain accent |
| **Links** | สี domain accent (หรือ Lumen) |
| **Buttons** | สี domain accent |
| **Tags/Badges** | สี domain accent |
| **Selection** | สี domain accent |
| **Focus ring** | สี domain accent |
| **Charts/Timeline** | สี domain accent |
| **Relationship lines** | สี domain accent |

### When NOT to Use Domain Colors

| ห้ามใช้กับ | ทำไม |
|---|---|
| **Background** | ห้ามเปลี่ยน background หลัก |
| **Paragraph text** | ใช้ ivory/soft-ivory เท่านั้น |
| **Main reading surface** | ใช้ paper-stone เท่านั้น |
| **Body content** | ใช้ muted/secondary text เท่านั้น |

---

## Contrast Requirements (ความต่างสี)

### WCAG 2.1 AA Compliance

| ประเภท | อัตราส่วนความต่าง | ตัวอย่าง |
|---|---|---|
| **Normal text (<18px)** | ≥ 4.5:1 | Ivory on Canvas |
| **Large text (≥18px)** | ≥ 3:1 | Heading on Canvas |
| **UI components** | ≥ 3:1 | Button border on Canvas |
| **Focus indicators** | ≥ 3:1 | Focus ring on Canvas |

### Contrast Check Examples

```text
Ivory (#F4F1EA) on Canvas (#080B16): 15.3:1 ✓
Soft Ivory (#DEDAD2) on Canvas (#080B16): 12.8:1 ✓
Muted (#8A8F98) on Canvas (#080B16): 5.2:1 ✓
Gold (#C79A4A) on Canvas (#080B16): 6.8:1 ✓
Lumen (#E7D7A6) on Canvas (#080B16): 11.2:1 ✓
```

---

## Color Application Examples (ตัวอย่างการใช้สี)

### Article Card

```text
┌─────────────────────────────────────┐
│  [Icon] Psychology                  │  ← domain color icon
│                                     │
│  จิตวิทยาเชิงลึก                    │  ← heading (ivory)
│  คำอธิบายสั้นๆ เกี่ยวกับเนื้อหา    │  ← body (soft-ivory)
│                                     │
│  [标签] ระดับกลาง                    │  ← tag (domain accent)
│  อ่านต่อ →                          │  ← link (lumen)
│                                     │
│  ตรวจสอบหลักฐานปฐมภูมิ ✓            │  ← evidence (muted)
└─────────────────────────────────────┘
  border: 1px solid slate-boundary
  background: paper-stone
  shadow: elevation-2
```

### Thinker Card

```text
┌─────────────────────────────────────┐
│  [Portrait] Carl Jung               │  ← image
│                                     │
│  คาร์ล จุงก์                         │  ← heading (ivory)
│  1875-1961                          │  ← years (muted)
│  จิตวิทยาเชิงลึก                     │  ← domain (domain accent)
│                                     │
│  นักจิตวิทยาชาวสวิส...              │  ← bio (soft-ivory)
│                                     │
│  ดูทฤษฎี →                          │  ← link (lumen)
└─────────────────────────────────────┘
```

---

## Color Transition Rules (กฎการเปลี่ยนสี)

### Route Transitions

- **Duration:** 1.2s
- **Easing:** cubic-bezier(0.16, 1, 0.3, 1)
- **Properties:** --cosmology-accent, --surface-tint, --border-tint

### Hover States

- **Duration:** 200ms (fast)
- **Easing:** cubic-bezier(0.21, 0.6, 0.35, 1)
- **Effect:** Brighten by 10% (color-mix with white)

### Active States

- **Duration:** 100ms
- **Effect:** Darken by 20% (color-mix with black)

### Focus States

- **Style:** 3px solid ring
- **Color:** Gold (#C79A4A)
- **Offset:** 2px

---

## Accessibility Checklist (รายการตรวจสอบการเข้าถึง)

- [ ] ทุก text มี contrast ratio ≥ 4.5:1
- [ ] ทุก large text มี contrast ratio ≥ 3:1
- [ ] ทุก UI component มี contrast ratio ≥ 3:1
- [ ] Focus ring มองเห็นชัดเจน
- [ ] ไม่ใช้สีเพียงอย่างเดียวในการสื่อสารสถานะ
- [ ] รองรับ prefers-reduced-motion
- [ ] รองรับ prefers-color-scheme (dark/light)
