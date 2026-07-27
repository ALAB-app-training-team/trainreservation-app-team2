import { test, expect } from '@playwright/test';
import { LoginPage } from '@tests/pages/Login/LoginPage';

test('未入力の時にバリデーションメッセージが表示されること', async ({
    page,
}) => {
    const loginPage = new LoginPage(page);
    loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.clickLoginButton();
    const message = await loginPage.mailAddress.evaluate(
        (el: HTMLInputElement) => el.validationMessage,
    );
    expect(message).toBe('Please fill out this field.');
    await expect(page).toHaveURL('/login');
});
