import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';

import { PasswordUpdatePage } from '@tests/pages/PasswordUpdate/PasswordUpdatePage';

test('各項目の未入力メッセージが表示されること', async ({
    page,
    commonLogin,
    logout,
}) => {
    const passwordUpdatePage = new PasswordUpdatePage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
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
        page.getByText('新しいパスワードを再入力してください'),
    ).toBeVisible();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('パスワードが一致しないときにバリデーションメッセージが表示されること', async ({
    page,
    commonLogin,
    logout,
}) => {
    const passwordUpdatePage = new PasswordUpdatePage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await passwordUpdatePage.goto();
    await expect(page).toHaveURL('/passwordUpdate');
    await passwordUpdatePage.fillCurrentPassword('Password1');
    await passwordUpdatePage.fillNewPassword('Password2');
    await passwordUpdatePage.fillNewPasswordCheck('Password3');
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
    await logout();
    await expect(page).toHaveURL('/login');
});
