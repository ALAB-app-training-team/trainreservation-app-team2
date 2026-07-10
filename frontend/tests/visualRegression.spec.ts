import { test, expect } from '@playwright/test';
import { ReservationGuestLogin } from './pages/ReservationGuestLogin/ReservationGuestLoginPage';

test('visual-scheduleSearch', async ({ page }) => {
    await page.goto('/scheduleSearch');
    await expect(page).toHaveURL('/scheduleSearch');

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.01,
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
        maxDiffPixelRatio: 0.01,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#00ff00',
    });
});

test('visual-reservationGuestLogin', async ({ page }) => {
    await page.goto('/reservationGuestLogin');
    await expect(page).toHaveURL('/reservationGuestLogin');

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.01,
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
    const reservationGuestLogin = new ReservationGuestLogin(page);
    reservationGuestLogin.goto();
    reservationGuestLogin.inputGuestLoginInfo();
    reservationGuestLogin.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservationList');

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.01,
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
    const reservationGuestLogin = new ReservationGuestLogin(page);
    reservationGuestLogin.goto();
    reservationGuestLogin.inputGuestLoginInfo();
    reservationGuestLogin.clickGuestLoginButton();
    await page.getByRole('button', { name: 'チケットを表示' }).first().click();
    await expect(page).toHaveURL('/reservedTicket');

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.01,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#00ff00',
    });
});
