import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/scheduleSearch');
    await page.getByRole('button', { name: '詳細を見る' }).nth(1).click();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: '1B', exact: true }).click();
    await page.getByRole('button').filter({ hasText: /^$/ }).click();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: '1B', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: '1B', exact: true }).click();
    await page.getByRole('button', { name: 'グリーン車' }).click();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: 'グランクラス' }).click();
    await page.getByRole('button', { name: '1A' }).click();
    await page.getByRole('textbox', { name: '購入者氏名' }).click();
    await page.getByRole('textbox', { name: '購入者氏名' }).fill('山田 太郎');
    await page.getByRole('textbox', { name: '購入者氏名' }).press('Tab');
    await page
        .getByRole('textbox', { name: 'メールアドレス' })
        .fill('demo@example.com');
    await page.getByRole('textbox', { name: 'メールアドレス' }).press('Tab');
    await page
        .getByRole('textbox', { name: 'カード番号' })
        .fill('4111222233334444');
    await page.getByRole('textbox', { name: 'カード番号' }).press('Tab');
    await page
        .getByRole('textbox', { name: 'カード名義人' })
        .fill('TARO YAMADa');
    await page.getByRole('textbox', { name: 'カード名義人' }).press('Tab');
    await page
        .getByRole('textbox', { name: '有効期限（月/年）' })
        .fill('12/28');
    await page.getByRole('textbox', { name: '有効期限（月/年）' }).press('Tab');
    await page.getByRole('textbox', { name: 'セキュリティコード' }).fill('123');
    await page.getByRole('button', { name: '予約を確定' }).click();
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await page.getByRole('button', { name: '予約を確定' }).click();
    await page.getByRole('button', { name: '予約を確定' }).click();
});
