import { test } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:5173/scheduleSearch');
    await page.getByRole('link', { name: 'ログイン/会員登録' }).click();
    await page.getByRole('textbox', { name: 'メールアドレス' }).click();
    await page
        .getByRole('textbox', { name: 'メールアドレス' })
        .fill('test-common@test.com');
    await page.getByRole('textbox', { name: 'パスワード' }).click();
    await page.getByRole('textbox', { name: 'パスワード' }).fill('Password2');
    await page.getByRole('button', { name: 'ログイン' }).click();
    await page.getByTestId('user-name').click();
    await page.getByRole('link', { name: '氏名・メールアドレス変更' }).click();
    await page.getByRole('textbox', { name: '氏名' }).click();
    await page.getByRole('textbox', { name: '氏名' }).press('ControlOrMeta+a');
    await page.getByRole('textbox', { name: '氏名' }).fill('');
    await page
        .locator('div')
        .filter({
            hasText:
                '氏名・メールアドレス変更変更するアカウント情報を入力してください氏名氏名を入力してくださいメールアドレスパスワード変更',
        })
        .nth(3)
        .click();
    await page
        .locator('div')
        .filter({
            hasText:
                '氏名・メールアドレス変更変更するアカウント情報を入力してください氏名氏名を入力してくださいメールアドレスパスワード変更',
        })
        .nth(2)
        .click();
    await page
        .locator('div')
        .filter({
            hasText:
                '氏名・メールアドレス変更変更するアカウント情報を入力してください氏名氏名を入力してくださいメールアドレスパスワード変更',
        })
        .nth(2)
        .click();
    await page.getByText('氏名を入力してください').click();
});
