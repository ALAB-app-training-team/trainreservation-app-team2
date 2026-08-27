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

    // パスワード -8文字以下
    await accountCreatePage.fillPassword('Pass1');
    await expect(
        await accountCreatePage.lengthPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -64文字以上
    await accountCreatePage.fillPassword(
        'Password1Password2Password3Password4Password5Password6Password7Password8',
    );
    await expect(
        await accountCreatePage.lengthPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -半角英数字を含まない
    await accountCreatePage.fillPassword('Password');
    await expect(
        await accountCreatePage.numberPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -半角英大文字を含まない
    await accountCreatePage.fillPassword('password1');
    await expect(
        await accountCreatePage.uppercasePolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -半角英小文字を含まない
    await accountCreatePage.fillPassword('PASSWORD1');
    await expect(
        await accountCreatePage.lowercasePolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -使用できない文字が含まれている
    await accountCreatePage.fillPassword('Password1|');
    await expect(
        await accountCreatePage.validPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    await accountCreatePage.fillName('');
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
});
