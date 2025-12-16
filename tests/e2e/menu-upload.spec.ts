/**
 * E2E 測試範例：菜單上傳流程
 *
 * 測試完整的使用者旅程
 */

import { test, expect } from "@playwright/test";

test.describe("菜單上傳功能", () => {
  test("使用者應該能成功上傳菜單並查看解析結果", async ({ page }) => {
    // 1. 訪問首頁
    await page.goto("/");

    // 2. 檢查頁面標題
    await expect(page.getByRole("heading", { name: "KoreKore" })).toBeVisible();

    // 3. 點擊上傳按鈕
    await page.getByRole("button", { name: /上傳菜單照片/i }).click();

    // 4. 上傳測試圖片（需要準備測試圖片）
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("tests/fixtures/sample-menu.jpg");

    // 5. 等待上傳完成
    await expect(page.getByText(/上傳中/i)).toBeVisible();
    await expect(page.getByText(/上傳中/i)).not.toBeVisible({
      timeout: 30000,
    });

    // 6. 檢查是否顯示解析結果
    await expect(page.getByRole("heading", { name: /菜單內容/i })).toBeVisible();

    // 7. 選擇菜單項目
    const firstMenuItem = page.locator('[data-testid="menu-item"]').first();
    await firstMenuItem.click();

    // 8. 生成點餐卡
    await page.getByRole("button", { name: /生成點餐卡/i }).click();

    // 9. 檢查點餐卡是否正確顯示
    await expect(page.getByRole("heading", { name: /點餐卡/i })).toBeVisible();
    await expect(page.getByText(/すみません/i)).toBeVisible();
  });

  test("使用者應該能查看歷史記錄", async ({ page }) => {
    await page.goto("/history");

    // 檢查歷史記錄頁面
    await expect(
      page.getByRole("heading", { name: /歷史記錄/i })
    ).toBeVisible();

    // 如果有記錄，點擊查看
    const menuCards = page.locator('[data-testid="history-menu-card"]');
    const count = await menuCards.count();

    if (count > 0) {
      await menuCards.first().click();
      await expect(
        page.getByRole("heading", { name: /菜單內容/i })
      ).toBeVisible();
    }
  });

  test("使用者應該能刪除歷史記錄", async ({ page }) => {
    await page.goto("/history");

    const menuCards = page.locator('[data-testid="history-menu-card"]');
    const initialCount = await menuCards.count();

    if (initialCount > 0) {
      // 點擊刪除按鈕
      await page.locator('[data-testid="delete-menu-btn"]').first().click();

      // 確認刪除
      await page.getByRole("button", { name: /確認/i }).click();

      // 檢查記錄是否減少
      await expect(menuCards).toHaveCount(initialCount - 1);
    }
  });
});
