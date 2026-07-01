import { test, expect } from '@playwright/test';

test.describe('Intro Preloader Full Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Mark tests as slow to triple timeout (from 30s to 90s)
    test.slow();

    // Clear sessionStorage once per test, but not on reload
    await page.addInitScript(() => {
      if (!window.sessionStorage.getItem('bypass-clear')) {
        window.sessionStorage.clear();
        window.sessionStorage.setItem('bypass-clear', '1');
      }
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

  test('normal flow - should complete animation in 9 seconds', async ({ page }, testInfo) => {
    await page.goto('http://localhost:3000');
    const overlay = page.locator('#intro-overlay');
    await expect(overlay).toBeVisible();

    // Check text existence
    const archeText = page.locator('text=Arche');
    await expect(archeText).toBeVisible();

    // Wait for complete 9-second window
    await page.waitForTimeout(9000);

    // Give Webkit's throttled animation frame clock extra time in headless mode
    const isWebkit = testInfo.project.name === 'webkit';
    await expect(overlay).toBeHidden({ timeout: isWebkit ? 15000 : 5000 });
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
    await page.focus('body');
    await page.keyboard.press('Escape');

    await expect(overlay).toBeHidden();
  });

  test('session storage - should bypass preloader on reload', async ({ page }) => {
    await page.goto('http://localhost:3000');
    const overlay = page.locator('#intro-overlay');
    await expect(overlay).toBeVisible();

    // Skip it
    await page.focus('body');
    await page.keyboard.press('Escape');
    await expect(overlay).toBeHidden();

    // Reload page
    await page.reload();
    await expect(overlay).toBeHidden();
  });

  test('prefers-reduced-motion - should bypass immediately', async ({ browser }) => {
    // Create a context that emulates reduced motion at creation time
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('http://localhost:3000');
    
    const overlay = page.locator('#intro-overlay');
    await expect(overlay).toBeHidden();
    await context.close();
  });
});
