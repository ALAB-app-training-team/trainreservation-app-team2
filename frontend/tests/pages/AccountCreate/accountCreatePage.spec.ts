import { test, expect } from '@playwright/test';
import { AccountCreatePage } from '@tests/pages/AccountCreate/AccountCreatePage';

test('各項目の未入力メッセージが表示されること', async ({ page }) => {
    const accountCreatePage = new AccountCreatePage(page);
    await accountCreatePage.goto();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.fillName('');
    await accountCreatePage.fillMailAddress('');
    await expect(page.getByText('氏名を入力してください')).toBeVisible();
    await accountCreatePage.fillPassword('');
    await expect(
        page.getByText('メールアドレスを入力してください'),
    ).toBeVisible();
    await accountCreatePage.fillPasswordCheck('');
    await accountCreatePage.fillName('');
    await expect(
        page.getByText('パスワードを再入力してください'),
    ).toBeVisible();
});

test('各項目のバリデーションメッセージが表示されること', async ({ page }) => {
    const accountCreatePage = new AccountCreatePage(page);
    const name256str =
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのは';
    const mail256str =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@co.mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm';
    await accountCreatePage.goto();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.fillName(name256str);
    await accountCreatePage.fillMailAddress(mail256str);
    await expect(
        page.getByText('氏名は255文字以内で入力してください'),
    ).toBeVisible();
    await accountCreatePage.fillPassword('Password1');
    await expect(
        page.getByText('メールアドレスは255文字以内で入力してください'),
    ).toBeVisible();
    await accountCreatePage.fillMailAddress('test@test');
    await accountCreatePage.fillPasswordCheck('Password');
    await expect(
        page.getByText('メールアドレスの形式（~~@~~.~~）で入力してください'),
    ).toBeVisible();
    await accountCreatePage.fillName('');
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
});
