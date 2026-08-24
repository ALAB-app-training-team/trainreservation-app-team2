import { test, expect } from '@playwright/test';

import { AccountUpdatePage } from '@tests/pages/AccountUpdate/AccountUpdatePage';

test('各項目の未入力メッセージが表示されること', async ({ page }) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.fillName('');
    await accountUpdatePage.fillMailAddress('');
    await expect(page.getByText('氏名を入力してください')).toBeVisible();
    await accountUpdatePage.fillPassword('');
    await expect(
        page.getByText('メールアドレスを入力してください'),
    ).toBeVisible();
    await accountUpdatePage.fillName('');
    await expect(page.getByText('パスワードを入力してください')).toBeVisible();
});

test('各項目のバリデーションメッセージが表示されること', async ({ page }) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    const name256str =
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのは';
    const mail256str =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@co.mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm';
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.fillName(name256str);
    await expect(
        page.getByText('氏名は255文字以内で入力してください'),
    ).toBeVisible();
    await accountUpdatePage.fillMailAddress(mail256str);
    await expect(
        page.getByText('メールアドレスは255文字以内で入力してください'),
    ).toBeVisible();
    await accountUpdatePage.fillMailAddress('test@test');
    await accountUpdatePage.fillName('テスト太郎');
    await expect(
        page.getByText('メールアドレスの形式（~~@~~.~~）で入力してください'),
    ).toBeVisible();
});
