import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation Overlay', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    // ตั้งค่า viewport เป็นหน้าจอมือถือ (iPhone 12 / Pixel 5 size < 1024px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
  });

  test('should open full-screen overlay and lock body scroll when hamburger is clicked', async ({ page }) => {
    // ตรวจสอบว่าปุ่ม hamburger มีอยู่บนหน้าจอมือถือ
    const menuBtn = page.getByRole('button', { name: 'เปิดเมนู', exact: true });
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
    await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    // กดปุ่มปิดเมนู
    const closeBtn = overlay.getByRole('button', { name: 'ปิดเมนู' });
    await closeBtn.click();

    // ตรวจสอบว่าเมนูปิดลงและคืนค่า body scroll
    await expect(overlay).toBeHidden();
    await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('should display feature cards and grid items, and close menu on navigation', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: 'เปิดเมนู', exact: true });
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
    await expect(page).toHaveURL(/\/articles/, { timeout: 60000 });
  });

  test('should close mobile menu and restore body scroll when viewport is resized to desktop (>= 1024px)', async ({ page }) => {
    const menuBtn = page.getByRole('button', { name: 'เปิดเมนู', exact: true });
    await expect(menuBtn).toBeVisible();

    await menuBtn.click();

    const overlay = page.getByRole('dialog', { name: 'เมนูนำทางและบัญชีผู้ใช้' });
    await expect(overlay).toBeVisible();
    await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    // ปรับขนาดหน้าจอเป็น Desktop (>= 1024px)
    await page.setViewportSize({ width: 1050, height: 800 });

    // ตรวจสอบว่าเมนูปิดลงและคืนค่า body scroll
    await expect(overlay).toBeHidden();
    await expect.poll(async () => page.evaluate(() => document.body.style.overflow)).toBe('');
  });
});

