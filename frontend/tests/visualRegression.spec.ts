import { test, expect } from '@playwright/test';

test('get started link', async ({ page }) => {
    await page.goto('/scheduleSearch');

    await expect(page).toHaveScreenshot({
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#00ff00',
    });
});
