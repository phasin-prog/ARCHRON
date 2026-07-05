# Archron Mobile Navigation & Chrome Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ยกเครื่องเมนูและ Chrome บนมือถือ/แท็บเล็ต (`< lg`) ของ Archron ให้เป็น Modern Full-screen Glass Overlay ที่สวยงาม หรูหรา ใช้งานง่ายตามแนวทาง Impeccable Design และ Thai-first

**Architecture:** ปรับปรุงไฟล์ `components/site-header.tsx` ให้เปลี่ยนจาก Dropdown list ใต้ Header มาเป็น Full-screen Overlay (`fixed inset-0 z-50 flex flex-col`) พร้อมระบบ Body Scroll Lock, ช่องค้นหาฝังในตัว, การจัดกลุ่มเมนูหลักแบบ Feature Cards และเมนูเสริมแบบ Grid 2 คอลัมน์ รวมถึงส่วนจัดการบัญชีผู้ใช้ยึดติดที่ด้านล่างสุด (Bottom Pinned)

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Clerk (`@clerk/nextjs`), TypeScript, Playwright (E2E Testing), Vitest / ESLint

## Global Constraints

- **Thai-first:** UI ทุกส่วนเป็นภาษาไทย · `lang="th"` · ไม่มี i18n / locale switcher / EN routes · คงภาษาอังกฤษเฉพาะชื่อเฉพาะ (Archron, Manifesto, Studio) และศัพท์วิชาการ
- **Design tokens (`app/globals.css`):** พื้น `--color-deep-navy #080B16` / `--color-midnight #0B1020` / `surface-container*` · ทอง `--color-antique-gold #C8A85A` (เนื้อหา) · `--color-burnished-gold #D4AF37` (chrome/หน้าใหม่) · ตัวอักษร `--color-ivory` / `--color-on-surface` · เส้น `--color-slate-boundary`
- **Global Chrome Permission:** อนุญาตให้แก้ global chrome (`components/site-header.tsx`) ตามที่ยืนยันกับผู้ใช้ผ่านกระบวนการสัมภาษณ์ โดยไม่แตะต้อง Desktop Nav (`lg+`) และ Layout อื่นๆ
- **No Hallucinated Data:** ใช้ข้อมูลจริงที่มีอยู่ใน `NAV` และคอมโพเนนต์ไอคอนจาก `components/icons.tsx` เท่านั้น
- **Build & Lint Green:** `npm run build` และ `npm run lint` ต้องเขียวก่อน commit

---

### Task 1: Create E2E Test & Implement Body Scroll Lock in SiteHeader

**Files:**
- Create: `tests/mobile-nav.spec.ts`
- Modify: `components/site-header.tsx:89-126`

**Interfaces:**
- Consumes: `open` state in `SiteHeader`
- Produces: Body overflow locking (`document.body.style.overflow = "hidden"`) when mobile menu is open, and automated test coverage.

- [ ] **Step 1: Write the failing E2E test for Mobile Navigation**

Create `tests/mobile-nav.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation Overlay', () => {
  test.beforeEach(async ({ page }) => {
    // ตั้งค่า viewport เป็นหน้าจอมือถือ (iPhone 12 / Pixel 5 size < 1024px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('should open full-screen overlay and lock body scroll when hamburger is clicked', async ({ page }) => {
    // ตรวจสอบว่าปุ่ม hamburger มีอยู่บนหน้าจอมือถือ
    const menuBtn = page.getByRole('button', { name: 'เปิดเมนู' });
    await expect(menuBtn).toBeVisible();

    // กดเปิดเมนู
    await menuBtn.click();

    // ตรวจสอบว่า Overlay เปิดขึ้นและมี role dialog
    const overlay = page.getByRole('dialog', { name: 'เมนูนำทางและบัญชีผู้ใช้' });
    await expect(overlay).toBeVisible();

    // ตรวจสอบว่าช่องค้นหาฝังในตัว (Integrated Search) ปรากฏอยู่
    const searchLink = overlay.getByRole('link', { name: /ค้นหาความรู้/ });
    await expect(searchLink).toBeVisible();

    // ตรวจสอบว่า Body ถูกล็อกไม่ให้ scroll
    const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflow).toBe('hidden');

    // กดปุ่มปิดเมนู
    const closeBtn = overlay.getByRole('button', { name: 'ปิดเมนู' });
    await closeBtn.click();

    // ตรวจสอบว่าเมนูปิดลงและคืนค่า body scroll
    await expect(overlay).toBeHidden();
    const bodyOverflowAfter = await page.evaluate(() => document.body.style.overflow);
    expect(bodyOverflowAfter).toBe('');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/mobile-nav.spec.ts`
Expected: FAIL with "dialog 'เมนูนำทางและบัญชีผู้ใช้' not found" and body overflow not hidden.

- [ ] **Step 3: Write minimal implementation for Body Scroll Lock in SiteHeader**

In `components/site-header.tsx`, add the `useEffect` hook right after the scroll listener (around line 89):
```tsx
  // ล็อกการเลื่อนหน้าเว็บ (Body scroll lock) เมื่อเปิดเมนูมือถือ
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
```

- [ ] **Step 4: Verify code builds and lints cleanly**

Run: `npm run lint`
Expected: PASS with no ESLint errors or warnings.

- [ ] **Step 5: Commit Task 1 Body Lock & Test scaffolding**

```bash
git add tests/mobile-nav.spec.ts components/site-header.tsx
git commit -m "test: add mobile nav e2e test and implement body scroll lock"
```

---

### Task 2: Implement Modern Full-screen Glass Overlay with Cards & Grid

**Files:**
- Modify: `components/site-header.tsx:347-442`
- Test: `tests/mobile-nav.spec.ts`

**Interfaces:**
- Consumes: `PRIMARY_NAV`, `STANDARD_NAV`, `UTILITY_NAV`, `SUPPORT`, `isActive`, `setOpen`, `clerk`, `open`
- Produces: Full-screen Glassmorphism overlay with Top Bar, Integrated Search Bar, Feature Card Stack, 2-Column Grid Utility Nav, and Bottom Pinned User Section.

- [ ] **Step 1: Write additional test assertions for Navigation & User Card**

In `tests/mobile-nav.spec.ts`, append a test case verifying link navigation and section layout:
```typescript
  test('should display feature cards and grid items, and close menu on navigation', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: 'เปิดเมนู' });
    await menuBtn.click();

    const overlay = page.getByRole('dialog', { name: 'เมนูนำทางและบัญชีผู้ใช้' });
    await expect(overlay).toBeVisible();

    // ตรวจสอบว่ามีลิงก์หลักใน Feature Cards
    const articlesLink = overlay.getByRole('link', { name: /คลังความรู้/ });
    await expect(articlesLink).toBeVisible();
    await expect(overlay.getByText('บทความ งานเขียน และบทวิเคราะห์เชิงลึก')).toBeVisible();

    // ตรวจสอบว่ามีส่วนหัว เพิ่มเติม สำหรับ Grid
    await expect(overlay.getByText('เพิ่มเติม')).toBeVisible();

    // ตรวจสอบปุ่มเข้าสู่ระบบ ( SignedOut state )
    const loginBtn = overlay.getByRole('link', { name: 'เข้าสู่ระบบ' });
    await expect(loginBtn).toBeVisible();

    // ทดสอบคลิกลิงก์คลังความรู้ เมนูต้องปิดลงและนำทางไปที่ /articles
    await articlesLink.click();
    await expect(overlay).toBeHidden();
    await expect(page).toHaveURL(/\/articles/);
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx playwright test tests/mobile-nav.spec.ts`
Expected: FAIL on finding text "บทความ งานเขียน และบทวิเคราะห์เชิงลึก" or dialog structure.

- [ ] **Step 3: Implement Full-screen Glass Overlay in SiteHeader**

In `components/site-header.tsx`, replace the old mobile dropdown structure (lines 347-440) with:
```tsx
      {/* Mobile / tablet (< lg): Modern Full-screen Glass Overlay */}
      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="เมนูนำทางและบัญชีผู้ใช้"
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-deep-navy/95 backdrop-blur-2xl transition-all duration-300 lg:hidden"
        >
          {/* Top Bar */}
          <div className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-boundary/30 bg-deep-navy/90 px-4 sm:px-6 backdrop-blur-md">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 text-accent hover:opacity-85 transition-opacity"
              aria-label="ARCHRON หน้าแรก"
            >
              <ArchronLogomark className="h-7 w-7 shrink-0" />
              <span className="font-wordmark text-[21px] font-semibold tracking-[0.2em]">ARCHRON</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-on-surface transition-colors hover:bg-white/10"
              aria-label="ปิดเมนู"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Main Content Area: Search Bar + Nav Groups */}
          <div className="flex-1 px-4 py-6 sm:px-6 space-y-6">
            {/* Integrated Search Bar */}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-boundary/40 bg-white/[0.04] px-4 py-3 text-on-surface-variant transition-all hover:border-accent/50 hover:bg-white/[0.06] hover:text-ivory shadow-sm"
            >
              <SearchIcon className="h-5 w-5 text-accent" />
              <span className="text-base font-medium">ค้นหาความรู้ แนวคิด หรือสำนักคิด...</span>
            </Link>

            {/* Primary & Standard Nav (Feature Cards Stack) */}
            <div className="space-y-2.5">
              {[...PRIMARY_NAV, ...STANDARD_NAV].map((item) => {
                let subLabel = "สำรวจและค้นหาเนื้อหาในคลังความรู้";
                if (item.href === "/articles") subLabel = "บทความ งานเขียน และบทวิเคราะห์เชิงลึก";
                else if (item.href === "/concepts") subLabel = "คำศัพท์และโครงสร้างแนวคิดทางจิตวิทยา";
                else if (item.href === "/schools") subLabel = "สำนักคิด นักปราชญ์ และผู้รากฐานทฤษฎี";

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                      isActive(item.href)
                        ? "border-accent/60 bg-accent/10 shadow-[0_0_20px_rgba(200,168,90,0.15)]"
                        : "border-slate-boundary/30 bg-white/[0.025] hover:border-accent/40 hover:bg-white/[0.06]"
                    }`}
                  >
                    <item.Icon
                      className={`mt-0.5 h-6 w-6 shrink-0 transition-colors ${
                        isActive(item.href) ? "text-accent" : "text-accent/80"
                      }`}
                    />
                    <div className="flex flex-col">
                      <span
                        className={`text-base font-semibold tracking-wide ${
                          isActive(item.href) ? "text-accent" : "text-ivory"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="mt-0.5 text-xs text-on-surface-variant/70 font-normal">
                        {subLabel}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Utility Nav Section (2-Column Grid) */}
            <div className="pt-2">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-px flex-1 bg-slate-boundary/30" aria-hidden="true" />
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/50">
                  เพิ่มเติม
                </span>
                <span className="h-px flex-1 bg-slate-boundary/30" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {UTILITY_NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-sm transition-all ${
                      isActive(item.href)
                        ? "border-accent/50 bg-accent/10 font-semibold text-accent"
                        : "border-white/5 bg-white/[0.015] text-on-surface-variant hover:border-white/15 hover:bg-white/[0.05] hover:text-ivory"
                    }`}
                  >
                    <item.Icon className="h-4 w-4 shrink-0 text-accent" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Pinned Section: User Card & Support Footer */}
          <div className="mt-auto shrink-0 border-t border-slate-boundary/30 bg-deep-navy/80 px-4 py-5 sm:px-6 backdrop-blur-md space-y-4">
            <SignedOut>
              <Link
                href="/th/login"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-soft-gold py-3 text-base font-semibold text-deep-navy shadow-[0_0_20px_rgba(200,168,90,0.15)] transition-all hover:opacity-95"
              >
                <LoginIcon className="h-5 w-5" />
                <span>เข้าสู่ระบบ</span>
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-accent/30 bg-accent/15 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-deep-navy"
                  >
                    <PersonIcon className="h-4 w-4 shrink-0" />
                    <span>โปรไฟล์ของฉัน</span>
                  </Link>
                  <Link
                    href="/studio"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-boundary/40 bg-white/5 py-2.5 text-sm font-medium text-ivory transition-all hover:bg-white/10"
                  >
                    <EditIcon className="h-4 w-4 shrink-0 text-accent" />
                    <span>Studio</span>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    clerk.signOut();
                  }}
                  className="flex w-full items-center justify-center gap-2 py-1.5 text-xs font-medium text-danger/80 transition-colors hover:text-danger cursor-pointer"
                >
                  <LogoutIcon className="h-4 w-4 shrink-0" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </SignedIn>

            {/* Support Project Link */}
            {SUPPORT ? (
              <div className="pt-1 text-center">
                <Link
                  href={SUPPORT.href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-accent/20 px-4 py-1 text-xs text-soft-gold/80 transition-colors hover:border-accent/40 hover:bg-accent/5 hover:text-soft-gold"
                >
                  <HeartIcon className="h-3.5 w-3.5 text-accent" />
                  <span>สนับสนุนโครงการ Archron</span>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
```

- [ ] **Step 4: Run E2E test to verify it passes**

Run: `npx playwright test tests/mobile-nav.spec.ts`
Expected: PASS (All test cases passed cleanly).

- [ ] **Step 5: Run full project verification (Lint & Build)**

Run:
```bash
npm run lint
npm run build
```
Expected: PASS with green status across both linting and production build.

- [ ] **Step 6: Commit Task 2 completion**

```bash
git add components/site-header.tsx tests/mobile-nav.spec.ts
git commit -m "feat: implement modern full-screen glass overlay for mobile navigation"
```
