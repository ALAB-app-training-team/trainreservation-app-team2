import { test, expect } from '@playwright/test';
import { LoginPage } from '@tests/pages/Login/LoginPage';

test('メールアドレス・パスワード未入力の場合にバリデーションメッセージが表示され、入力すると消えること', async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL('/login');

    await loginPage.mailAddress.fill('');
    await loginPage.mailAddress.press('Tab');
    await expect(
        page.getByText('メールアドレスを入力してください'),
    ).toBeVisible();

    await loginPage.password.fill('');
    await loginPage.password.press('Tab');
    await expect(
        page.getByText('パスワードを入力してください'),
    ).toBeVisible();

    await loginPage.mailAddress.fill('test-common@test.com');
    await loginPage.mailAddress.press('Tab');
    await expect(
        page.getByText('メールアドレスを入力してください'),
    ).not.toBeVisible();

    await loginPage.password.fill('Password1');
    await loginPage.password.press('Tab');
    await expect(
        page.getByText('パスワードを入力してください'),
    ).not.toBeVisible();
});

test('メールアドレスとパスワードが入力されるまでログインボタンが非活性であること', async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await expect(loginPage.loginButton).toBeDisabled();

    await loginPage.fillMailAddress('test-common@test.com');
    await expect(loginPage.loginButton).toBeDisabled();

    await loginPage.fillPassword('Password1');
    await expect(loginPage.loginButton).toBeEnabled();
});
