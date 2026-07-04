# Intro Preloader TDD & E2E Testing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement E2E tests using Playwright for the `IntroPreloader` animation, and add the "Click Screen to Skip" feature using TDD.

**Architecture:** Use Playwright for E2E assertions over a 9-second window. The preloader's main container will intercept clicks to trigger the skip sequence, resetting page overflow and sessionStorage.

**Tech Stack:** Playwright, React, Next.js, GSAP.

## Global Constraints
* The animation timeline lasts 9.0 seconds in total.
* The preloader only renders if `sessionStorage.getItem("archron-intro-played")` is not `"1"` and `prefers-reduced-motion` is false.
* Clicking anywhere on the screen overlay must immediately trigger the `skip()` handler.

---

### Task 1: Playwright Test Environment Setup

**Files:**
* Modify: `package.json`
* Modify: `tsconfig.json`

**Interfaces:**
* Produces: `@playwright/test` package in devDependencies and test scripts.

- [ ] **Step 1: Install Playwright test package**
  Run: `npm install -D @playwright/test`
  Expected: `@playwright/test` added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add test script in package.json**
  Modify: [package.json](file:///c:/Users/User/Desktop/Archron/Archon/package.json) to add `"test": "playwright test"` inside the `scripts` section.
  ```json
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start",
      "lint": "eslint .",
      "test": "playwright test"
    }
  ```

- [ ] **Step 3: Verify TypeScript compilation**
  Run: `npm run build`
  Expected: Production build compiles successfully.

- [ ] **Step 4: Commit setup changes**
  Run:
  ```bash
  git add package.json tsconfig.json
  git commit -m "chore(tests): install playwright and add test scripts"
  ```

---

### Task 2: Implement "Click Screen to Skip" Feature (TDD)

**Files:**
* Modify: `components/hero/intro-preloader.tsx`
* Create: `tests/intro-preloader.spec.ts`

**Interfaces:**
* Consumes: `IntroPreloader` component rendering a clickable backdrop container.
* Produces: `skip` function triggered by clicking the overlay container.

- [ ] **Step 1: Write the failing E2E test for screen-click skip**
  Create: [tests/intro-preloader.spec.ts](file:///c:/Users/User/Desktop/Archron/Archon/tests/intro-preloader.spec.ts)
  ```typescript
  import { test, expect } from '@playwright/test';

  test.describe('Intro Preloader Skip Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Clear sessionStorage before each test
      await page.addInitScript(() => {
        window.sessionStorage.clear();
      });
    });

    test('should skip preloader when clicking anywhere on the screen', async ({ page }) => {
      await page.goto('http://localhost:3000');
      
      const overlay = page.locator('#intro-overlay');
      await expect(overlay).toBeVisible();
      
      // Wait 0.5 seconds and click the overlay center
      await page.waitForTimeout(500);
      await overlay.click({ position: { x: 100, y: 100 } });
      
      // The overlay should disappear immediately
      await expect(overlay).toBeHidden();
    });
  });
  ```

- [ ] **Step 2: Run test to verify it fails**
  Run local dev server in background (using a separate terminal/process or `npm run dev`) then run the test:
  Run: `npx playwright test tests/intro-preloader.spec.ts -g "should skip preloader when clicking anywhere on the screen"`
  Expected: FAIL (because `#intro-overlay` does not exist or clicking it does not skip).

- [ ] **Step 3: Implement overlay skip and add id="intro-overlay"**
  Modify: [components/hero/intro-preloader.tsx](file:///c:/Users/User/Desktop/Archron/Archon/components/hero/intro-preloader.tsx) to add `id="intro-overlay"` and `onClick={skip}` to the main container div:
  ```typescript
    return (
      <div
        ref={containerRef}
        id="intro-overlay"
        onClick={skip}
        className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer"
        style={{ backgroundColor: "var(--color-deep-navy)" }}
        aria-hidden="true"
        role="presentation"
      >
  ```
  Wait, clicking children should also trigger the click bubble, but the skip button should prevent bubble or trigger the same skip. Since the skip button also triggers skip, it is safe! Let's ensure other elements inside (like links or cover) don't cause side effects. Clicking anywhere triggers `skip()` which is what we want!

- [ ] **Step 4: Run test to verify it passes**
  Run: `npx playwright test tests/intro-preloader.spec.ts -g "should skip preloader when clicking anywhere on the screen"`
  Expected: PASS.

- [ ] **Step 5: Commit changes**
  Run:
  ```bash
  git add components/hero/intro-preloader.tsx tests/intro-preloader.spec.ts
  git commit -m "feat(preloader): support screen click to skip and add test case"
  ```

---

### Task 3: Complete E2E Test Suite (TDD)

**Files:**
* Modify: `tests/intro-preloader.spec.ts`

**Interfaces:**
* Consumes: `IntroPreloader` layout and states.
* Produces: E2E tests verifying Normal Flow, Skip Button, Keyboard shortcuts, Session Storage bypass, and Prefers-Reduced-Motion.

- [ ] **Step 1: Write additional E2E tests**
  Modify: [tests/intro-preloader.spec.ts](file:///c:/Users/User/Desktop/Archron/Archon/tests/intro-preloader.spec.ts) to append the other tests:
  ```typescript
  import { test, expect } from '@playwright/test';

  test.describe('Intro Preloader Full Suite', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        window.sessionStorage.clear();
      });
    });

    test('normal flow - should complete animation in 9 seconds', async ({ page }) => {
      await page.goto('http://localhost:3000');
      const overlay = page.locator('#intro-overlay');
      await expect(overlay).toBeVisible();

      // Check text existence
      const archeText = page.locator('text=Arche');
      await expect(archeText).toBeVisible();

      // Wait for complete 9-second window
      await page.waitForTimeout(9000);
      await expect(overlay).toBeHidden();
    });

    test('should skip when clicking explicit skip button', async ({ page }) => {
      await page.goto('http://localhost:3000');
      const overlay = page.locator('#intro-overlay');
      await expect(overlay).toBeVisible();

      const skipBtn = page.locator('button:has-text("ข้าม")');
      await page.waitForTimeout(500);
      await skipBtn.click();

      await expect(overlay).toBeHidden();
    });

    test('should skip when pressing Escape key', async ({ page }) => {
      await page.goto('http://localhost:3000');
      const overlay = page.locator('#intro-overlay');
      await expect(overlay).toBeVisible();

      await page.waitForTimeout(500);
      await page.keyboard.press('Escape');

      await expect(overlay).toBeHidden();
    });

    test('session storage - should bypass preloader on reload', async ({ page }) => {
      await page.goto('http://localhost:3000');
      const overlay = page.locator('#intro-overlay');
      await expect(overlay).toBeVisible();

      // Skip it
      await page.keyboard.press('Escape');
      await expect(overlay).toBeHidden();

      // Reload page
      await page.reload();
      await expect(overlay).toBeHidden();
    });

    test('prefers-reduced-motion - should bypass immediately', async ({ page }) => {
      // Create a context that emulates reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('http://localhost:3000');
      
      const overlay = page.locator('#intro-overlay');
      await expect(overlay).toBeHidden();
    });
  });
  ```

- [ ] **Step 2: Run test suite to verify passing**
  Run: `npx playwright test tests/intro-preloader.spec.ts`
  Expected: All 6 tests PASS.

- [ ] **Step 3: Commit and push**
  Run:
  ```bash
  git add tests/intro-preloader.spec.ts
  git commit -m "test(preloader): add e2e test suite covering keyboard, storage, and reduced motion"
  git push origin main
  ```
