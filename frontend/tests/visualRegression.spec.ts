import { test, expect } from '@playwright/test';

test('visual-scheduleSearch', async ({ page }) => {
    await page.goto('/scheduleSearch');
    await expect(page).toHaveURL('/scheduleSearch');

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

test('visual-selectSeat', async ({ page }) => {
    await page.goto('/scheduleSearch');
    await page.getByRole('button', { name: '詳細を見る' }).first().click();
    await expect(page).toHaveURL('/selectSeat');

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

test('visual-reservationList', async ({ page }) => {
    await page.goto('/reservationList');
    await expect(page).toHaveURL('/reservationList');

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

test('visual-reservedTicket', async ({ page }) => {
    await page.goto('/reservationList');
    await page.getByRole('button', { name: 'チケットを表示' }).first().click();
    await expect(page).toHaveURL('/reservedTicket');

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
