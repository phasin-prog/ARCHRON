# Support Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the entire `/support` page with the Covenant/ARCHRON Companion philosophy

**Architecture:** Single page rewrite — no new components, stylesheets, or dependencies. Uses existing `PageScaffold` wrapper.

**Tech Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript

---

## Global Constraints

- Thai-first: all UI text in Thai
- No marketing language, urgency, FOMO, or conversion language
- Never use: Premium, VIP, Exclusive Content, donor rankings, tiers, gamification
- Use instead: Companion, ผู้อุปถัมภ์
- No invented systems (no newsletters, Discord, private forums)
- External links use `target="_blank" rel="noopener noreferrer"`
- Existing `PageScaffold` component reused as-is
- Tone: calm, scholarly, human, honest, humble, warm, inviting, timeless

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `app/support/page.tsx` | Rewrite | Entire Support page — 7 sections, metadata |

---

### Task 1: Rewrite app/support/page.tsx

**Files:**
- Modify: `app/support/page.tsx` — full rewrite

**Consumes:** `PageScaffold` from `@/components/page-scaffold`
**Produces:** Working `/support` page with 7 sections

- [ ] **Step 1: Update metadata**

Replace existing `metadata` export with:

```typescript
export const metadata: Metadata = {
  title: "สนับสนุน — ARCHRON",
  description:
    "ร่วมดูแลคลังความรู้ภาษาไทยด้านจิตวิทยาและปรัชญาให้คงอยู่ — สนับสนุนผ่าน ARCHRON Companion, การวิเคราะห์ Jungian Type Guide, หรือการร่วมเขียน",
};
```

- [ ] **Step 2: Write the page component with all 7 sections**

Replace the entire `SupportPage` component. The structure:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { PageScaffold } from "@/components/page-scaffold";

export const metadata: Metadata = {
  title: "สนับสนุน — ARCHRON",
  description:
    "ร่วมดูแลคลังความรู้ภาษาไทยด้านจิตวิทยาและปรัชญาให้คงอยู่ — สนับสนุนผ่าน ARCHRON Companion, การวิเคราะห์ Jungian Type Guide, หรือการร่วมเขียน",
};

const COMPANIONS = [
  // Static list of ARCHRON Companion names (add real names here)
];

export default function SupportPage() {
  return (
    <PageScaffold
      className="atmo-biography"
      breadcrumb={[
        { label: "หน้าแรก", href: "/" },
        { label: "สนับสนุน" },
      ]}
      kicker="สนับสนุน"
      title="สนับสนุนคลังความรู้นี้ให้คงอยู่"
      lead="ARCHRON ไม่ใช่ธุรกิจ ไม่มี paywall — เป็นคลังความรู้ที่เปิดกว้างสำหรับทุกคน หากคุณเห็นว่าสิ่งนี้มีค่าที่จะคงอยู่ นี่คือหนทาง"
      ambient
      navCurrent="/support"
    >
      {/* Section 2: Why knowledge must be open */}
      <section className="mx-auto max-w-3xl px-6">
        <h2 className="font-serif text-2xl text-ivory">ทำไมความรู้ต้องเปิดกว้าง</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-soft-ivory">
          <p>
            ความรู้ทางจิตวิทยา ปรัชญา มานุษยวิทยา และศาสตร์ที่ว่าด้วยความเป็นมนุษย์
            ไม่ใช่สินค้าที่ควรถูกขายเป็นชิ้น ๆ ภายใต้ paywall หรือรอการปลดล็อก
          </p>
          <p>
            ARCHRON ดำรงอยู่เพราะความเชื่อที่ว่าผลงานทางปัญญาเหล่านี้เป็นมรดกร่วมของมนุษย์
            — ทุกคนควรสามารถเข้าถึง เข้าใจ และนำไปคิดต่อได้โดยไม่มีกำแพง
          </p>
          <p>
            เนื้อหาหลักของคลังนี้จะยังคงเปิดให้อ่านฟรีต่อไป
          </p>
        </div>
      </section>

      {/* Section 3: Why support matters */}
      <section className="mx-auto mt-16 max-w-3xl px-6">
        <h2 className="font-serif text-2xl text-ivory">การดำรงอยู่ของคลังความรู้มีค่าใช้จ่าย</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-soft-ivory">
          <p>
            เซิร์ฟเวอร์ โดเมน ที่จัดเก็บข้อมูล หนังสืออ้างอิงวิชาการ
            เวลาที่ใช้ในการค้นคว้า เขียน แปล เรียบเรียง และจัดระบบความรู้
            — ล้วนมีค่าใช้จ่าย
          </p>
          <p>
            การสนับสนุนจากผู้ที่เห็นคุณค่าของคลังนี้คือสิ่งที่ทำให้ทุกอย่างยังคงเดินหน้าต่อไปได้
          </p>
        </div>
      </section>

      {/* Section 4: Ways to support */}
      <section className="mx-auto mt-16 max-w-6xl px-6">
        <h2 className="font-serif text-2xl text-ivory">หนทางแห่งการสนับสนุน</h2>
        <p className="mt-3 text-sm text-muted">
          ทุกทางเท่าเทียมกัน — ไม่มีทางไหน "สำคัญ" กว่าทางอื่น
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="archron-panel p-6">
            <span className="material-symbols-outlined text-[24px] text-lumen">menu_book</span>
            <h3 className="mt-3 font-serif text-lg text-ivory">อ่านอย่างตั้งใจ</h3>
            <p className="mt-2 text-xs leading-relaxed text-soft-ivory">
              ใช้เวลากับเนื้อหา อ่านแหล่งอ้างอิง และแยกข้อเท็จจริงจากการตีความ
            </p>
          </article>
          <article className="archron-panel p-6">
            <span className="material-symbols-outlined text-[24px] text-lumen">share</span>
            <h3 className="mt-3 font-serif text-lg text-ivory">แบ่งปันอย่างมีบริบท</h3>
            <p className="mt-2 text-xs leading-relaxed text-soft-ivory">
              ส่งต่อแนวคิดพร้อมบริบทเดิม ไม่ตัดทอนให้กลายเป็นคำคมสั้นที่ขาดความหมาย
            </p>
          </article>
          <article className="archron-panel p-6">
            <span className="material-symbols-outlined text-[24px] text-lumen">rate_review</span>
            <h3 className="mt-3 font-serif text-lg text-ivory">แจ้งข้อผิดพลาด</h3>
            <p className="mt-2 text-xs leading-relaxed text-soft-ivory">
              ช่วยทักท้วงหรือเพิ่มเติมข้อมูลอ้างอิง เพื่อให้คลังความรู้นี้ถูกต้องสมบูรณ์ยิ่งขึ้น
            </p>
          </article>
        </div>
      </section>

      {/* Section 5: ARCHRON Companion */}
      <section className="mx-auto mt-16 max-w-3xl px-6">
        <div className="archron-panel border-antique-gold/30 p-8 text-center">
          <h2 className="font-serif text-2xl text-antique-gold">ARCHRON Companion</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-soft-ivory">
            Companion คือผู้ที่เลือกเดินเคียงข้างโครงการนี้ เงียบๆ และช่วยให้มันคงอยู่
            — ไม่ใช่การซื้อสิทธิพิเศษ แต่เป็นการร่วมดูแลคลังความรู้ที่คุณอยากให้คนรุ่นหลังมี
          </p>
          <div className="mx-auto mt-8 inline-block rounded-lg border border-antique-gold/20 bg-white/[0.02] px-8 py-6">
            <p className="text-xs text-muted">ธนาคารกสิกรไทย</p>
            <p className="mt-1 text-sm text-ivory">พศิน พสุมาตร</p>
            <p className="mt-3 font-mono text-lg tracking-wider text-antique-gold">
              146-1-96727-9
            </p>
            {/* PromptPay QR Code image here when available */}
          </div>
          <p className="mt-6 text-xs text-muted">
            เท่าไหร่ก็ได้ ทุกจำนวนช่วยให้ห้องสมุดนี้คงอยู่
          </p>
        </div>
        {COMPANIONS.length > 0 && (
          <div className="mt-10 text-center">
            <h3 className="font-serif text-base text-soft-ivory">ARCHRON Companions</h3>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted">
              {COMPANIONS.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Section 6: Jungian Type Guide */}
      <section className="mx-auto mt-16 max-w-6xl px-6">
        <Link
          href="/guide"
          className="archron-card group flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45 border-burnished-gold/25"
        >
          <div>
            <div className="flex items-start justify-between">
              <span
                className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-[0.9rem_0.3rem] border border-slate-boundary/40 bg-surface-container-low"
                style={{ borderColor: "color-mix(in srgb, var(--color-burnished-gold) 26%, var(--color-slate-boundary))" }}
              >
                <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": "var(--color-burnished-gold)" } as React.CSSProperties}>
                  <use href="/icons/archron-icons.svg#lantern" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 font-serif text-xl text-ivory group-hover:text-burnished-gold">
              อีกหนึ่งหนทางที่จะร่วมเดิน
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-soft-ivory/85">
              Jungian Psychological Type Guide — การวิเคราะห์เชิงลึกทางจิตวิทยาแบบ Jungian
              ที่รายได้ส่วนหนึ่งสนับสนุนคลังความรู้นี้
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-burnished-gold">
            ดูรายละเอียด
            <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </span>
        </Link>
      </section>

      {/* Section 7: Collaborate */}
      <section className="mx-auto mt-8 max-w-6xl px-6">
        <Link
          href="/studio"
          className="archron-card group flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-burnished-gold/45"
        >
          <div>
            <div className="flex items-start justify-between">
              <span
                className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-[0.9rem_0.3rem] border border-slate-boundary/40 bg-surface-container-low"
              >
                <svg className="icon-3d" aria-hidden="true" style={{ "--ico-main": "var(--cosmology-accent)" } as React.CSSProperties}>
                  <use href="/icons/archron-icons.svg#interpretation" />
                </svg>
              </span>
            </div>
            <h3 className="mt-4 font-serif text-xl text-ivory group-hover:text-burnished-gold">
              ร่วมเป็นส่วนหนึ่งของเนื้อหา
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-soft-ivory/85">
              หากคุณมีความรู้ในศาสตร์ที่เกี่ยวข้องและต้องการร่วมเขียน ร่วมตรวจสอบ
              หรือร่วมเรียบเรียงคลังความรู้แห่งนี้ — สมัครเป็นนักเขียนร่วมอ้างอิง
            </p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-burnished-gold">
            เข้าสู่ห้องทำงานผู้เขียน (Studio)
            <span className="material-symbols-outlined text-[14px] transition-transform duration-300 group-hover:translate-x-0.5">
              arrow_forward
            </span>
          </span>
        </Link>
      </section>

      {/* Section 8: Closing */}
      <section className="mx-auto mt-20 max-w-2xl px-6 text-center">
        <p className="text-sm leading-relaxed text-soft-ivory/70">
          ARCHRON จะยังคงเปิดกว้างสำหรับทุกคน<br />
          หากคุณเลือกที่จะช่วย คุณจะกลายเป็นหนึ่งในผู้ที่ quietly ดูแลคลังนี้ให้คงอยู่
        </p>
      </section>
    </PageScaffold>
  );
}
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Compiled successfully, no errors

- [ ] **Step 4: Commit**

```bash
git add app/support/page.tsx
git commit -m "feat: redesign support page — ARCHRON Companion + Covenant philosophy"
```

- [ ] **Step 5: Push**

```bash
git push
```
