import { test, expect } from '@playwright/test';

test('navigate-schedule', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/scheduleSearch');
    await page.getByRole('button', { name: '詳細を見る' }).first().click();
    await expect(page).toHaveURL('/selectSeat');
    await page.getByRole('button', { name: '検索画面に戻る' }).first().click();
    await expect(page).toHaveURL('/scheduleSearch');
    await page.getByRole('button', { name: '詳細を見る' }).first().click();
    await expect(page).toHaveURL('/selectSeat');
    await page.locator('button.w-12.h-12.cursor-pointer').first().click();
    await page.getByRole('textbox', { name: '購入者氏名' }).click();
    await page.getByRole('textbox', { name: '購入者氏名' }).fill('田中太郎');
    await page.getByRole('textbox', { name: 'メールアドレス' }).click();
    await page
        .getByRole('textbox', { name: 'メールアドレス' })
        .fill('tanaka@taro.jp');
    await page.getByRole('textbox', { name: 'カード番号' }).click();
    await page
        .getByRole('textbox', { name: 'カード番号' })
        .fill('1234567890123456');
    await page.getByRole('textbox', { name: 'カード名義人' }).click();
    await page
        .getByRole('textbox', { name: 'カード名義人' })
        .fill('taro tanaka');
    await page.getByRole('textbox', { name: '有効期限（月/年）' }).click();
    await page
        .getByRole('textbox', { name: '有効期限（月/年）' })
        .fill('12/27');
    await page.getByRole('textbox', { name: 'セキュリティコード' }).click();
    await page.getByRole('textbox', { name: 'セキュリティコード' }).fill('123');
    await page.getByRole('button', { name: '予約を確定' }).click();
    await expect(page).toHaveURL('/reservedTicket');
});

test('navigate-reservation', async ({ page }) => {
    await page.goto('/reservationList');
    await expect(page).toHaveURL('/reservationList');
    await page.getByRole('button', { name: 'チケットを表示' }).first().click();
    await expect(page).toHaveURL('/reservedTicket');
    await page.getByRole('button', { name: '予約一覧へ戻る' }).first().click();
    await expect(page).toHaveURL('/reservationList');
});

test('navigate-header', async ({ page }) => {
    await page.goto('/reservationList');
    await expect(page).toHaveURL('/reservationList');
    await page.getByRole('link', { name: '新幹線でGO！' }).first().click();
    await expect(page).toHaveURL('/scheduleSearch');
    await page.getByRole('link', { name: '予約確認' }).first().click();
    await expect(page).toHaveURL('/reservationList');
    await page.getByRole('link', { name: '新幹線を探す' }).first().click();
    await expect(page).toHaveURL('/scheduleSearch');
});
