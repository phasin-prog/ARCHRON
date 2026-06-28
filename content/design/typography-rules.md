# The Soul's Compass — Typography Rules v0.1

> อ้างอิงหลัก editorial typography (Hierarchy · Contrast · Alignment · White Space · Consistency)
> นำมาใช้บน **โทน midnight ของแบรนด์** (ไม่ใช่ครีม) และ **Thai-first**

## 5 หลักการ
1. **Hierarchy** — ลำดับชัดด้วยขนาด/น้ำหนัก: display (hero) > section heading > card heading > body > caption/meta. ใช้ type scale เดียวทั้งเว็บ
2. **Contrast** — จับคู่ serif กับ sans และใช้ italic เป็น accent: หัวเรื่องไทย Noto Serif Thai, เนื้อหา IBM Plex Sans Thai, accent/ตัวเลข/ภาษาอังกฤษ Playfair Display หรือ Cormorant (อาจ italic). ห้าม italic ทั้งย่อหน้า
3. **Alignment** — เนื้อหาหลักชิดซ้าย, manifesto/quote จัดกึ่งกลางได้; ไม่ผสมหลายแนวในบล็อกเดียว
4. **White Space** — ให้พื้นที่หายใจ: hero padding สูง, ระยะ section กว้าง, จำกัดความกว้างบรรทัด ~58–62ch, line-height ไทย 1.85–1.95
5. **Consistency** — ใช้ token เดียว (ขนาด/line-height/letter-spacing) ทั่วทั้งเว็บ ไม่ตั้งค่าเฉพาะหน้า

## Roles
| บทบาท | ฟอนต์ | ลักษณะ |
|------|------|--------|
| Display / H1 | Noto Serif Thai 600 | clamp ~2.6–4.8rem, line-height 1.18, text-wrap balance, accent italic Playfair |
| Section H2 | Noto Serif Thai 600 | clamp ~1.85–2.8rem, line-height 1.3 |
| Card H3 | Noto Serif Thai 600 | ~1.3rem |
| Body | IBM Plex Sans Thai 400 | ~17px, line-height 1.88, max ~62ch |
| Lead / Pull line | Noto Serif Thai | ~1.28rem, มีเส้นทองซ้าย |
| Eyebrow / Label / Nav | IBM Plex Sans Thai 500 | ~0.82rem, letter-spacing 0.16–0.18em |
| Caption / Meta | IBM Plex Sans Thai | ~0.8rem, สี muted |
| Numerals / Wordmark | Playfair Display / Cormorant | high-contrast serif |
| Pull-quote (manifesto) | Noto Serif Thai 600 | clamp ~1.5–2.2rem, line-height 1.5, มีเครื่องหมายอ้างทอง |

## ข้อห้าม (สอดคล้อง Brand)
- ห้ามทำ pull-quote เป็นคำคม/aphorism ลอย ๆ — ใช้กับข้อความที่มีฐาน/อนุมัติแล้วเท่านั้น
- ห้าม italic ทั้งย่อหน้า, ห้าม decorative font จนอ่านยาก
- ห้ามบีบ body ไทยจน line-height ต่ำกว่า 1.8
- Thai-first — ไม่สลับเป็นโทนครีม/ภาษาอังกฤษโดยไม่ได้สั่ง

## หมายเหตุการ implement
preview สาธิตหลักนี้แล้ว (artifact). ใน repo: ปรับ app/globals.css (base type) + ใช้ utility/role ใน component ผ่าน Frontend แล้ว verify build; เว็บฟอนต์โหลดผ่าน next/font/google (Noto Serif Thai + IBM Plex Sans Thai + Playfair Display)
