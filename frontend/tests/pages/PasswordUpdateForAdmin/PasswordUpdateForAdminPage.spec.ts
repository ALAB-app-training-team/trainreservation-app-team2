import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { PasswordUpdateForAdminPage } from './PasswordUpdateForAdminPage';

test('各項目の未入力メッセージが表示されること', async ({
    page,
    adminLogin,
    logout,
}) => {
    const passwordUpdateForAdminPage = new PasswordUpdateForAdminPage(page);

    await adminLogin();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdminPage.fillName('');
    await passwordUpdateForAdminPage.fillMailAddress('');
    await expect(page.getByText('氏名を入力してください')).toBeVisible();
    await passwordUpdateForAdminPage.fillPassword('');
    await expect(
        page.getByText('メールアドレスを入力してください'),
    ).toBeVisible();
    await passwordUpdateForAdminPage.fillPasswordCheck('');
    await passwordUpdateForAdminPage.fillName('');
    await expect(
        page.getByText('パスワードを再入力してください'),
    ).toBeVisible();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('各項目のバリデーションメッセージが表示されること', async ({
    page,
    adminLogin,
    logout,
}) => {
    const passwordUpdateForAdminPage = new PasswordUpdateForAdminPage(page);
    const name256str =
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのは';
    const mail256str =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@co.mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm';
    await adminLogin();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdminPage.fillName(name256str);
    await expect(
        page.getByText('氏名は255文字以内で入力してください'),
    ).toBeVisible();
    await passwordUpdateForAdminPage.fillMailAddress(mail256str);
    await expect(
        page.getByText('メールアドレスは255文字以内で入力してください'),
    ).toBeVisible();
    await passwordUpdateForAdminPage.fillPassword('Password1');
    await passwordUpdateForAdminPage.fillPasswordCheck('Password');
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
    await logout();
    await expect(page).toHaveURL('/login');
});
