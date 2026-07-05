# Design Spec: Archron Mobile Navigation & Chrome Redesign

**วันที่:** 2026-07-05  
**สถานะ:** รออนุมัติจากผู้ใช้ (Pending User Approval)  
**เป้าหมาย:** ยกระดับประสบการณ์ใช้งาน การแสดงผล และความสวยงามของเมนูนำทางและ Chrome บนหน้าจอมือถือและแท็บเล็ต (`< lg`) ในไฟล์ `components/site-header.tsx` ให้เป็นแบบ **Modern Full-screen Glass Overlay** ที่หรูหรา พรีเมียม และตอบสนองได้อย่างลื่นไหลตามแนวทาง Impeccable Design และกฎระเบียบใน `AGENTS.md`

---

## 1. บริบทและปัญหาปัจจุบัน (Context & Problem Statement)

ในปัจจุบัน ส่วนเมนูมือถือของ **Archron** เมื่อกดปุ่ม Hamburger (`<MenuIcon />`) จะแสดงผลเป็น Dropdown list รายการข้อความยาวต่อกันลงมาใต้ Header (`id="mobile-nav"`) ซึ่งมีข้อจำกัดดังนี้:
1. **ขาดมิติและความพรีเมียม:** โครงสร้างดูเป็นรายการข้อความธรรมดา (Plain vertical list) ไม่สมกับความเป็นคลังความรู้เชิงวิเคราะห์ระดับสูงและธีม Antique Gold / Midnight
2. **การใช้พื้นที่ยังไม่เต็มประสิทธิภาพ:** การเรียงลิงก์ทุกหมวดเป็นแถวเดี่ยวยาวลงมา ทำให้ผู้ใช้ต้องเลื่อนหน้าจอนานกว่าจะถึงส่วนบัญชีผู้ใช้หรือปุ่มเข้าสู่ระบบ
3. **การทับซ้อนและพื้นหลัง:** ไม่มีระบบป้องกันการเลื่อนหน้าเว็บด้านหลัง (Body Scroll Lock) ทำให้ผู้ใช้อาจเผลอเลื่อนเนื้อหาพื้นหลังขณะเปิดเมนูอยู่

---

## 2. สถาปัตยกรรมและการจัดวางใหม่ (Architecture & Layout Specification)

เราจะยกเครื่องโครงสร้างเมนูมือถือจาก Dropdown ใต้ Header มาเป็น **Modern Full-screen Glass Overlay** โดยแบ่งสัดส่วนหน้าจอออกเป็น 3 ส่วนหลักดังนี้:

```
+-------------------------------------------------------+
|  [Archron Logo & Wordmark]            [Close X Btn]   |  <- Top Bar (h-16)
+-------------------------------------------------------+
|  ( o ) ค้นหาความรู้ แนวคิด หรือสำนักคิด...           |  <- Integrated Search Bar
+-------------------------------------------------------+
|  [ คลังความรู้  - บทความและงานเขียนเชิงวิเคราะห์ ]    |  <- Primary Nav
|  [ สำรวจ      - คำศัพท์และแนวคิดสำคัญทางจิตใจ ]    |     (Feature Cards Stack)
|  [ ศาสตร์      - สำนักคิดและนักปราชญ์ผู้รากฐาน ]     |
+-------------------------------------------------------+
|  -- เพิ่มเติม (MORE EXPLORATION) -------------------  |
|  +-------------------------+ +----------------------+ |  <- Utility Nav
|  | [i] ปฏิญญา              | | ["] แหล่งอ้างอิง     | |     (2-Column Grid)
|  +-------------------------+ +----------------------+ |
|  | [?] คำถามที่พบบ่อย       | | [*] แผนผังดาว        | |
|  +-------------------------+ +----------------------+ |
+-------------------------------------------------------+
|                                                       |
|  +-------------------------+ +----------------------+ |  <- User Section
|  | [Person] โปรไฟล์ของฉัน  | | [Edit] Studio        | |     (Bottom Pinned
|  +-------------------------+ +----------------------+ |      Grid & Sign Out)
|             [Logout] ออกจากระบบ                        |
|                                                       |
|              ( o ) สนับสนุนโครงการ                     |  <- Support Pill
+-------------------------------------------------------+
```

### 2.1 โครงสร้างหลักและพฤติกรรม (Overlay & Body Lock)
- **Container Class:** `fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-deep-navy/95 backdrop-blur-2xl transition-all duration-300`
- **Body Scroll Lock:** เพิ่ม `useEffect` ใน `SiteHeader` เมื่อ `open === true` จะเพิ่มคลาสหรือสไตล์ `overflow: hidden` ให้กับ `document.body` เพื่อล็อกไม่ให้หน้าเว็บด้านหลังเลื่อน และคืนค่าเดิมเมื่อปิดเมนูหรือเปลี่ยนหน้า
- **Design Tokens:** ใช้พื้นหลังสี `--color-deep-navy` ผสานกับเส้นขอบ `--color-slate-boundary` และสีข้อความ `--color-ivory` / `--color-on-surface` ตามมาตรฐาน `AGENTS.md`

### 2.2 ส่วนหัวของเมนู (Top Navigation Bar)
- **ความสูงและระยะ:** ความสูงคงที่ `h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 border-b border-slate-boundary/30`
- **ด้านซ้าย (Brand):** โลโก้ `<ArchronLogomark />` และข้อความ `ARCHRON` กดแล้วเรียก `setOpen(false)` และนำทางไปที่ `/`
- **ด้านขวา (Close Button):** ปุ่มปิด `<CloseIcon />` ขนาดใหญ่ (`h-6 w-6`) ในกรอบวงกลม (`rounded-full bg-white/5 hover:bg-white/10 p-2 text-on-surface transition-colors`) เพื่อให้กดง่ายด้วยนิ้วมือ

### 2.3 ช่องค้นหาแบบฝังในตัว (Integrated Search Bar)
- **ตำแหน่ง:** อยู่ใต้ Top Bar ในส่วนเริ่มของพื้นที่เนื้อหาหลัก (`px-4 sm:px-6 pt-4 pb-2 shrink-0`)
- **การออกแบบ:** สร้างเป็น Link หรือ Input box ขนาดใหญ่ (`flex items-center gap-3 w-full rounded-xl bg-white/[0.04] border border-slate-boundary/40 px-4 py-3 text-on-surface-variant hover:border-accent/50 hover:text-on-surface transition-all`)
- **พฤติกรรม:** เมื่อกดจะนำทางไปที่ `/search` พร้อมปิดเมนูทันที เพื่อความรวดเร็วในการสืบค้นข้อมูล

### 2.4 การจัดกลุ่มเมนู (Information Architecture - Cards & Grid)
พื้นที่ตรงกลาง (`flex-1 px-4 sm:px-6 py-4 space-y-6`) จะถูกจัดระเบียบใหม่:
- **กลุ่มเมนูหลัก (Primary & Standard Nav - `/articles`, `/concepts`, `/schools`):**
  - แสดงเป็น **Vertical Feature Cards Stack**
  - แต่ละปุ่มมีการ์ดล้อมรอบ (`flex items-start gap-3.5 rounded-2xl border border-slate-boundary/30 bg-white/[0.025] hover:bg-white/[0.06] hover:border-accent/40 p-3.5 transition-all`)
  - แสดงไอคอนสีทอง Antique Gold (`text-accent h-6 w-6 shrink-0 mt-0.5`), ชื่อหมวดหมู่ตัวหนา (`text-base font-semibold text-ivory`), และคำอธิบายย่อย (Sub-label) สีรอง (`text-xs text-on-surface-variant/70 mt-0.5`)
- **กลุ่มเมนูเสริม (Utility Nav - `/manifesto`, `/sources`, `/faq`, `/constellation`):**
  - คั่นด้วยเส้นแบ่งและหัวข้อ `เพิ่มเติม` (`font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/40`)
  - จัดเป็น **Grid 2 คอลัมน์ (`grid grid-cols-2 gap-2 sm:gap-3`)**
  - แต่ละปุ่มเป็นมินิการ์ด (`flex items-center gap-2.5 rounded-xl bg-white/[0.015] hover:bg-white/[0.05] border border-white/5 p-3 text-sm text-on-surface-variant hover:text-ivory transition-all`)

### 2.5 ส่วนบัญชีผู้ใช้และปุ่มสนับสนุน (Bottom Pinned Section)
ยึดติดที่ด้านล่างสุดของ Overlay (`mt-auto shrink-0 border-t border-slate-boundary/30 bg-deep-navy/80 px-4 sm:px-6 pt-4 pb-6 space-y-4`):
- **กรณีเข้าสู่ระบบแล้ว (`<SignedIn>`):**
  - **User Action Grid (2 คอลัมน์):**
    - ปุ่ม **โปรไฟล์ของฉัน (`/profile`)**: `flex items-center justify-center gap-2 rounded-xl bg-accent/15 border border-accent/30 py-2.5 text-sm font-semibold text-accent hover:bg-accent hover:text-deep-navy transition-all`
    - ปุ่ม **Studio (`/studio`)**: `flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-slate-boundary/40 py-2.5 text-sm font-medium text-ivory hover:bg-white/10 transition-all`
  - **ปุ่มออกจากระบบ (Sign Out):** `flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-danger/80 hover:text-danger transition-colors cursor-pointer`
- **กรณีผู้ใช้ยังไม่ได้ล็อกอิน (`<SignedOut>`):**
  - ปุ่ม **เข้าสู่ระบบ (`/th/login`)**: `flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-accent to-soft-gold py-3 text-base font-semibold text-deep-navy shadow-[0_0_20px_rgba(200,168,90,0.15)] hover:opacity-95 transition-all`
- **ปุ่มสนับสนุนโครงการ (`/support`):**
  - แสดงเป็นข้อความลิงก์หรือปุ่ม Outline กึ่งกลางด้านล่างสุด `inline-flex items-center justify-center gap-1.5 w-full text-xs text-soft-gold/80 hover:text-soft-gold py-1`

---

## 3. รายละเอียดแอนิเมชันและการเคลื่อนไหว (Motion & Micro-interactions)

- **การเปิด-ปิดเมนู:** ใช้เทคนิค CSS Transition หรือ Tailwind classes เพื่อให้เมนู Fade และ Scale เข้ามาอย่างนุ่มนวล (`opacity-0 scale-98` -> `opacity-100 scale-100`) ตามระยะเวลา `--dur-base` และความลื่นไหล `--ease-soft`
- **Accessibility & Reduced Motion:** ตรวจสอบและเคารพการตั้งค่า `prefers-reduced-motion` เพื่อปิดแอนิเมชันที่ไม่จำเป็นสำหรับผู้ที่มีอาการไวต่อการเคลื่อนไหว
- **Touch Feedback:** ทุกปุ่ม (Cards, Grid items, Buttons) มีการเปลี่ยนสีพื้นหลังและขอบ (Hover/Active states) เพื่อให้ผู้ใช้รู้ทันทีเมื่อสัมผัสโดน

---

## 4. ข้อกำหนดและขอบเขตตามกฎ AGENTS.md (Guardrails & Constraints)

1. **Thai-first:** ข้อความบน UI ทั้งหมดเป็นภาษาไทย (ยกเว้นคำเฉพาะ ARCHRON, Studio) ไม่มีการเพิ่มภาษาอังกฤษหรือระบบ i18n
2. **Design Tokens:** ใช้ตัวแปรสีและฟอนต์จาก `app/globals.css` เท่านั้น ห้ามฮาร์ดโค้ดสีที่ไม่เข้ากับธีม
3. **Global Chrome Permission:** ได้รับอนุญาตจากผู้ใช้ผ่านกระบวนการสัมภาษณ์ให้ปรับปรุงเฉพาะพฤติกรรมการแสดงผลเมนูมือถือในไฟล์ `components/site-header.tsx` เท่านั้น โดยไม่กระทบกับเลย์เอาต์บน Desktop (`lg+`) และไฟล์ Layout อื่นๆ
4. **No Hallucinated Data:** ใช้ข้อมูลรายการลิงก์และไอคอนที่มีอยู่จริงในระบบ (`NAV`, `PRIMARY_NAV`, `STANDARD_NAV`, `UTILITY_NAV`, `SUPPORT`) ไม่แต่งหมวดหมู่ใหม่ขึ้นเอง

---

## 5. แผนการตรวจสอบและทดสอบ (Verification Plan)

1. **Automated Verification:**
   - รันคำสั่ง `npm run lint` เพื่อตรวจสอบความถูกต้องของโค้ด TypeScript และ React Hooks (เช่น การใช้ `useEffect` สำหรับ Body lock)
   - รันคำสั่ง `npm run build` เพื่อตรวจสอบว่าการคอมไพล์ผ่านเขียว 100% ก่อนทำการ Commit (ตามกฎข้อ 9)
2. **Manual Verification / User Walkthrough:**
   - ตรวจสอบการแสดงผลบนหน้าจอขนาดเล็ก (`< 1024px` หรือ `< lg`)
   - ทดสอบการกดเปิดเมนู Hamburger ว่าขยายเต็มหน้าจอ พร้อมพื้นหลัง Glassmorphism สวยงาม
   - ทดสอบว่าเมื่อเปิดเมนู หน้าเว็บด้านหลังต้องไม่สามารถเลื่อนได้ (Body Scroll Lock)
   - ทดสอบการคลิกปุ่มปิด (X), ปุ่มค้นหา, ลิงก์ในเมนูหลักแบบ Card, ลิงก์ใน Grid 2 คอลัมน์, และปุ่มในส่วน User Card ว่าพาไปถูกหน้าและปิดเมนูให้อัตโนมัติ
