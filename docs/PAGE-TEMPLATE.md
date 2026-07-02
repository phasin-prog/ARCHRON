# 🏛️ PAGE-TEMPLATE — โครงหน้ามาตรฐาน ARCHRON

> คู่มือสร้าง/ปรับปรุงหน้า static ให้กลิ่นอายตรงกันทุกหน้า ("หอดูดาว/ห้องสมุดยามค่ำ")
> ใช้คู่กับ `AGENTS.md` (กฎ) และ `docs/AGENT-HANDOFF.md` §2 (เส้นทางงานหน้า static)

## ชิ้นส่วนหลัก

| ชิ้นส่วน | ที่อยู่ | หน้าที่ |
|---|---|---|
| `PageScaffold` / `PageSection` | `components/page-scaffold.tsx` | โครงหน้า: Ambient Observatory (opt-in) → PageHeader → เนื้อหา → PageNav |
| ไอคอน 3 มิติ Isometric Grid (Dynamic Colour) | `public/icons/archron-icons.svg` (sprite) + คลาส `.icon-3d` | วัตถุ iso 3 หน้าบนแท่นตาราง — ทุกโทนคำนวณจาก cosmology accent ของหน้า |
| พื้นหลังไอคอน (จานรอง) | คลาส `.icon-tile` | จานรองมุมอสมมาตรภาษาเดียวกับ `.archron-card` — ผิว/ขอบผสมจาก accent ของหน้า |
| พื้นหลังหอดูดาว | `public/backgrounds/*.svg` + คลาส `.ambient-observatory` | ชั้นดาว ivory + เส้นกลุ่มดาว Dynamic Colour (mask) |

## ไอคอน 3 มิติ Isometric Grid แบบ Dynamic Colour

Sprite: `public/icons/archron-icons.svg` — id ที่มี: `reading-set` · `achievement` · `level` · `source-primary` · `source-secondary` · `interpretation` · `lantern` (มีไฟล์เดี่ยวชื่อเดียวกันสำหรับใช้เป็น `<img>` ด้วย — ได้โทนทองมาตรฐานจากค่า fallback)

```tsx
{/* โทนทั้งหมด (เนื้อวัสดุ/เงา/ไฮไลต์) คำนวณจาก --cosmology-accent ของหน้า — เปลี่ยนหน้าแล้ว morph เอง */}
<svg className="icon-3d" aria-hidden="true"><use href="/icons/archron-icons.svg#lantern" /></svg>

{/* บนจานรอง (พื้นหลังไอคอน) */}
<span className="icon-tile">
  <svg className="icon-3d" aria-hidden="true"><use href="/icons/archron-icons.svg#level" /></svg>
</span>

{/* บังคับโทนหลักเป็น token อื่น (โทนรองคำนวณตามอัตโนมัติ) */}
<svg className="icon-3d" style={{ "--ico-main": "var(--color-lumen)" } as React.CSSProperties} aria-hidden="true">
  <use href="/icons/archron-icons.svg#achievement" />
</svg>
```

หลักการ: ข้างใน sprite ระบายด้วย CSS vars (`--ico-main/--ico-light/--ico-deep/--ico-ivory`) ซึ่งคลาส `.icon-3d` ผูกกับ `--cosmology-accent` ผ่าน `color-mix` — ได้ไอคอนมีมิติ (ไล่เฉด+เงา+ไฮไลต์) ที่ยังเป็น Dynamic Colour เต็มรูปแบบ
เพิ่มไอคอนใหม่: เพิ่ม `<symbol>` ใน sprite (ผืน 48×48 · สไตล์ Isometric Grid 3D: วัตถุตั้งบนแท่นตาราง iso เดียวกัน · สามหน้าสามค่าแสง — บน=light, ซ้าย=main, ขวา=deep · เงาตกพื้น Shadow Black · ประกาย/เรืองเป็นจุดชีวิต)

> หมายเหตุ: ชุดไอคอนเส้นเดิมใน `components/icons.tsx` ยังใช้งานตามปกติ — ชุด Isometric 3D นี้เป็น "ไฟล์ asset" สำหรับงานปรับปรุงรายหน้า ไม่แตะของเดิม

## ตัวอย่างหน้าใหม่

```tsx
import type { Metadata } from "next";
import { PageScaffold, PageSection } from "@/components/page-scaffold";

export const metadata: Metadata = {
  title: "ชื่อหน้า — Archron",
  description: "คำอธิบายหน้า (อย่าลืม — ทุกหน้าต้องมี description)",
};

export default function Page() {
  return (
    <PageScaffold
      kicker="หมวดของหน้า"
      title="ชื่อหน้า"
      lead="คำโปรยสั้น อธิบายว่าหน้านี้มีไว้เพื่ออะไร"
      breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ชื่อหน้า" }]}
      ambient             // เปิดชั้นดาว (เฉพาะหน้าที่อยากให้บรรยากาศลึกขึ้น)
      navCurrent="/route" // ต้องตรงกับ PAGE_ORDER ใน components/page-nav.tsx
    >
      <PageSection kicker="ส่วนที่ 1" title="หัวข้อส่วน">
        {/* เนื้อหา — ใช้ .archron-card / tag-pill / token utilities เดิม */}
      </PageSection>
    </PageScaffold>
  );
}
```

## กติกาบังคับ (สรุปจาก AGENTS.md)

1. **Thai-first** — ห้ามเพิ่ม EN route/switcher · อังกฤษเฉพาะชื่อเฉพาะและศัพท์วิชาการ
2. **Token เท่านั้น** — สีผ่าน `var(--color-*)` / `var(--accent)` / `var(--cosmology-accent)` + `color-mix` · **ห้าม hardcode hex ใน TSX**
3. **Motion** — ใช้ `--ease-*` / `--dur-*` · animate เฉพาะ `transform`/`opacity` · เคารพ `prefers-reduced-motion`
4. **Metadata** — ทุกหน้าต้องมี `title` **และ** `description`
5. **ห้ามแตะ global chrome** (`site-header` / `site-footer` / `layout` / `template`) โดยไม่ได้รับคำสั่ง
6. **หน้าอ่านข้อมูล DB** — ใช้ `getPublicEntries()` + `export const revalidate = 300` (ดู HANDOFF §3)
7. `npm run build` + `npm run lint` ต้องเขียวก่อน commit

## ลำดับชั้น z-index ของพื้นหลัง

```
z-0  .accent-aura          (mount ใน layout — มีทุกหน้า)
z-0  .ambient-observatory  (opt-in ต่อหน้า — ผ่าน PageScaffold prop `ambient`)
z-10 เนื้อหาหน้า            (PageScaffold ห่อให้อัตโนมัติ)
```
