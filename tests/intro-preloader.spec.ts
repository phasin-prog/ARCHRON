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
