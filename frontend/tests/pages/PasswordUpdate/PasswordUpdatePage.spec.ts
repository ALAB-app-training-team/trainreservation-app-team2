import { test, expect } from '@playwright/test';

import { PasswordUpdatePage } from '@tests/pages/PasswordUpdate/PasswordUpdatePage';

test('各項目の未入力メッセージが表示されること', async ({ page }) => {
    const passwordUpdatePage = new PasswordUpdatePage(page);
    await passwordUpdatePage.goto();
    await expect(page).toHaveURL('/passwordUpdate');
    await passwordUpdatePage.fillCurrentPassword('');
    await passwordUpdatePage.fillNewPassword('');
    await expect(
        page.getByText('現在のパスワードを入力してください'),
    ).toBeVisible();
    await passwordUpdatePage.fillNewPasswordCheck('');
    await passwordUpdatePage.fillCurrentPassword('');
    await expect(
        page.getByText('新しいパスワードを入力してください'),
    ).toBeVisible();
    await expect(
        page.getByText('新しいパスワードを再入力してください'),
    ).toBeVisible();
});

test('各項目のバリデーションメッセージが表示されること', async ({ page }) => {
    const passwordUpdatePage = new PasswordUpdatePage(page);
    await passwordUpdatePage.goto();
    await expect(page).toHaveURL('/passwordUpdate');
    await passwordUpdatePage.fillCurrentPassword('Password1');
    await passwordUpdatePage.fillNewPassword('Password2');
    await passwordUpdatePage.fillNewPasswordCheck('Password3');
    await passwordUpdatePage.fillCurrentPassword('Password1');
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
});
await page.goto('http://localhost:5173/accountUpdate');