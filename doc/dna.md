# ARCHRON Editorial DNA — Phase 02

> **วัตถุประสงค์**: DNA ของ Interface ทั้งระบบ — "ถ้าลบ logo ออก ยังรู้ว่าคือ ARCHRON"
> **อ้างอิง**: EDS.md ทั้งหมด · VOS.md §04 Visual Personality

---

## Visual Personality (บุคลิกภาพทางสายตา)

### ✅ ลักษณะที่ต้องสะท้อนออกมา (Embrace)

| ลักษณะ | ความหมาย | วิธีสะท้อนในดีไซน์ |
|---|---|---|
| **Elegant** | สง่างาม ประณีต | ใช้ serif font, สัดส่วนทอง, ระยะห่างโปร่ง |
| **Academic** | น่าเชื่อถือทางวิชาการ | citation system, evidence blocks, structured hierarchy |
| **Warm** | อบอุ่น นุ่มนวล | warm ivory text, soft shadows, gentle transitions |
| **Calm** | สงบเยือกเย็น | dark theme, minimal noise, balanced layout |
| **Curious** | ชวนให้สงสัยใคร่รู้ | related concepts, backlinks, "explore" CTAs |
| **Intellectual** | ลุ่มลึกทางปัญญา | deep color palette, layered information |
| **Organic** | กลมกลืนเป็นธรรมชาติ | rounded corners (not too round), soft gradients |
| **Minimal** | เรียบง่ายแต่ทรงพลัง | whitespace as editorial element, reduce noise |
| **Sophisticated** | มีระดับ วางตัวดี | consistent typography, muted colors, quality materials |
| **Timeless** | ยั่งยืนเหนือกาลเวลา | avoid trends, use classic proportions |

### ❌ ลักษณะที่ห้ามมีเด็ดขาด (Never)

| ลักษณะ | หลีกเลี่ยงเพราะ |
|---|---|
| **Corporate** | สีฟ้าตัดขาวแข็งกระด้าง ไม่อบอุ่น |
| **Cold** | ไร้ชีวิตจิตใจ ไม่ชวนอ่าน |
| **Gaming/Sci-Fi/Cyberpunk** | นีออนสะท้อนแสง ฉูดฉาด รบกวนสายตา |
| **Glass Everywhere** | กระจกฝ้าซ้อนกันจนลายตาและอ่านยาก |
| **Over Decorative** | ประดับประดาฟุ่มเฟือยไร้เหตุผล |

---

## Shape Language (ภาษาสื่อสารรูปทรง)

### รูปทรงที่ใช้

```text
Organic Rounded Rectangle (สี่เหลี่ยมมนอินทรีย์)
├── border-radius: 14-18px (การ์ดมาตรฐาน)
├── border-radius: 24px+ (hero, large cards)
└── border-radius: 9999px (avatar, pill buttons)

Gentle Shadows (เงาอ่อนนุ่ม)
├── elevation-2: card standard
├── elevation-3: panel/sidebar
└── elevation-4: floating elements

Soft Borders (เส้นขอบนุ่ม)
├── 1px solid slate-boundary/20-40%
└── ไม่ใช้เส้นขอบหนา >2px
```

### รูปทรงที่ห้ามใช้

- Sharp corners (มุมแหลม) ยกเว้น code blocks
- Thick borders (>2px)
- Hard shadows (เงาแข็ง)
- Neon glows (แสงนีออน)

---

## Pattern Identity (ลวดลายเฉพาะตัว)

### Decorative Elements (องค์ประกอบตกแต่ง)

1. **Paper Texture** — ลวดลายกระดาษโบราณ (opacity: 2-4%)
2. **Noise Grain** — เม็ดเกรนละเอียด (opacity: 2-4%)
3. **Constellation Lines** — เส้นโยงกลุ่มดาว (opacity: 4-6%)
4. **Ancient Geometry** — เรขาคณิตโบราณ (opacity: 2-4%)
5. **Soft Glow** — แสงเรืองรองเฉพาะจุด (opacity: 4-6%)

### กฎการใช้ลวดลาย

> **Controlled Opacity:** ความเข้มของลวดลายจำกัดไว้เพียง **2%, 4% หรือสูงสุดไม่เกิน 6%**
> ห้ามไล่สีฉูดฉาดหรือรบกวนสายตาเด็ดขาด

---

## Proportion Rules (กฎสัดส่วน)

### Golden Ratio Modularity

```text
Base Unit: 8px
├── 8 × 1 = 8px    (spacing-1)
├── 8 × 2 = 16px   (spacing-4)
├── 8 × 3 = 24px   (spacing-5)
├── 8 × 4 = 32px   (spacing-6)
├── 8 × 6 = 48px   (spacing-8)
├── 8 × 8 = 64px   (spacing-9)
└── 8 × 16 = 128px (spacing-12)
```

### Card Proportions

- **Standard Card:** width:height = 1:1.2 to 1:1.5
- **Horizontal Card:** width:height = 2:1 to 3:1
- **Hero Card:** width:height = 16:9 to 2:1

---

## Contrast Philosophy (ปรัชญาความต่าง)

### Hierarchy through Contrast

```text
High Contrast (ความต่างสูง)
├── Headings vs Body text (font-weight, size, color)
├── Primary CTA vs secondary actions
└── Active state vs default state

Medium Contrast (ความต่างปานกลาง)
├── Card borders vs background
├── Icons vs text
└── Tags vs content

Low Contrast (ความต่างต่ำ)
├── Secondary text vs primary text
├── Subtle borders vs background
└── Decorative elements vs content
```

### Color Contrast Ratios (WCAG 2.1 AA)

- **Normal text:** ≥ 4.5:1
- **Large text:** ≥ 3:1
- **UI components:** ≥ 3:1

---

## Empty Space Philosophy (ปรัชญาที่ว่าง)

> **"Whitespace is an editorial element, not empty void."**
> ที่ว่างคือ "องค์ประกอบทางงานบรรณาธิการชิ้นหนึ่ง" ไม่ใช่พื้นที่ว่างเปล่าที่ไร้ความหมาย

### Whitespace as Structure

```text
Identity ↓ Whitespace ↓ Context ↓ Whitespace ↓ Content ↓ Whitespace ↓ Evidence ↓ Whitespace ↓ Navigation
```

### Rules

1. **Between sections:** 48-64px (spacing-8 to spacing-9)
2. **Between blocks:** 24-32px (spacing-5 to spacing-6)
3. **Between items:** 16-24px (spacing-4 to spacing-5)
4. **Inside cards:** 24-32px padding (spacing-5 to spacing-6)
5. **Reading column:** max-width 68ch (measure token)

---

## Texture Language (ภาษาพื้นผิว)

### Allowed Textures

1. **Paper Texture** — กระดาษคุณภาพสูงปูบนแท่นจัดแสดงพิพิธภัณฑ์
2. **Subtle Noise** — เม็ดเกรนละเอียดเหมือน film grain
3. **Soft Gradient** — ไล่สีนุ่มนวลจาก midnight blue ลงสู่ deep navy
4. **Matte Surface** — ผิวด้าน ไม่มันวาว

### Forbidden Textures

1. **Glossy/Metallic** — ผิวมันวาวแบบโลหะ
2. **Glassmorphism** — กระจกฝ้าซ้อนกัน
3. **Neon Glow** — แสงนีออนสะท้อนแสง
4. **High-contrast gradients** — ไล่สีจัดๆ ฉูดฉาด

---

## Component DNA Inheritance (การสืบทอดยีนคอมโพเนนต์)

ทุกคอมโพเนนต์ใน ARCHRON ต้องสืบทอด DNA จากจีโนม 6 ชั้น:

```text
1. Identity → ต้องมี label/title/icon เสมอ
2. Context → ต้องระบุ domain/category ได้
3. Relationship → ต้องเชื่อมโยงกับ knowledge graph ได้
4. Content → ต้องแสดงเนื้อหาหลักได้
5. Evidence → ต้องมี citation/reference ได้
6. Navigation → ต้องมี CTA นำไปสู่ความรู้ต่อ
```

### Density Variants

| ระดับ | โครงสร้างยีนที่แสดงผล | ใช้กับ |
|---|---|---|
| **Light** | Identity → Summary → CTA | การ์ดเล็ก, Tooltip |
| **Medium** | Metadata → Summary → Relationship → CTA | การ์ดมาตรฐาน |
| **Heavy** | Full Layout → Reference → Evidence → Related | หน้าอ่านบทความเต็ม |

---

## DNA Compliance Checklist

- [ ] Identity ปรากฏเป็นสิ่งแรกสุดเสมอ
- [ ] Context มาก่อนคำอธิบายเนื้อหา
- [ ] Relationship ค้นพบง่ายแต่ไม่รกรุงรัง
- [ ] Evidence อยู่ส่วนท้ายก่อนปุ่มนำทาง
- [ ] Navigation คือบทสรุปปิดท้าย
- [ ] Whitespace ใช้เป็น editorial element
- [ ] สีแต้มไม่ยุ่งเกี่ยวกับ background หลัก
- [ ] ไม่มีลักษณะ Corporate/Cold/Gaming/Glass/Over-decorative
- [ ] ทุกองค์ประกอบมีเป้าหมายชัดเจน
- [ ] สืบทอดจีโนม 6 ชั้นตามลำดับ
