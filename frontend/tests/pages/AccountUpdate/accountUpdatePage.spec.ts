import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { AccountUpdatePage } from '@tests/pages/AccountUpdate/AccountUpdatePage';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { AccountCreatePage } from '@tests/pages/AccountCreate/AccountCreatePage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '../ReservedTicket/ReservedTicketPage';
import { ScheduleSearchPage } from '../ScheduleSearch/ScheduleSearchPage';

test('各項目の未入力メッセージが表示されること', async ({
    page,
    commonLogin,
    logout,
}) => {
    const accountUpdatePage = new AccountUpdatePage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
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
    await logout();
    await expect(page).toHaveURL('/login');
});

test('各項目のバリデーションメッセージが表示されること', async ({
    page,
    commonLogin,
    logout,
}) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    const name256str =
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのは';
    const mail256str =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@co.mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm';

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
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
    await logout();
    await expect(page).toHaveURL('/login');
});

test('退会したらログインできないこと', async ({ page }) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    const loginPage = new LoginPage(page);
    const accountCreatePage = new AccountCreatePage(page);
    // 他のテストとアカウントを共有しないよう、退会用のアカウントを毎回作成する
    const deleteMail = `delete${Date.now()}@test.com`;
    const deletePassword = 'Password1';

    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.fillName('削除太郎');
    await accountCreatePage.fillMailAddress(deleteMail);
    await accountCreatePage.fillPassword(deletePassword);
    await accountCreatePage.fillPasswordCheck(deletePassword);
    await accountCreatePage.clickCreateButton();
    await expect(page).toHaveURL('/login');

    // 作成したアカウントでログインできること
    await loginPage.fillMailAddress(deleteMail);
    await loginPage.fillPassword(deletePassword);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');

    // 退会できること
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.clickDeleteButton();
    await expect(accountUpdatePage.deleteConfirmTitle).toBeVisible();
    // キャンセルではモーダルが閉じるだけで退会されないこと
    await accountUpdatePage.clickDeleteCancelButton();
    await expect(accountUpdatePage.deleteConfirmTitle).toBeHidden();
    await expect(page).toHaveURL('/accountUpdate');
    // 「はい」を押したときだけ退会されること
    await accountUpdatePage.clickDeleteButton();
    await accountUpdatePage.clickDeleteConfirmButton();
    await expect(page).toHaveURL('/login');
    const deleteSuccessToast = page.getByText('退会が完了しました。');
    await expect(deleteSuccessToast).toBeVisible();
    // ログイン前のヘッダーに戻っていること
    await expect(accountUpdatePage.header.loginLink.first()).toBeVisible();

    // 退会したアカウントではログインできないこと
    await expect(deleteSuccessToast).toBeHidden({ timeout: 10000 });
    await loginPage.fillMailAddress(deleteMail);
    await loginPage.fillPassword(deletePassword);
    await loginPage.clickLoginButton();
    await expect(page.getByText('ログインに失敗しました')).toBeVisible();
    await expect(page).toHaveURL('/login');
});

test('予約中のきっぷがあると退会できないこと', async ({
    page,
    createReservation,
    logout,
}) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    const loginPage = new LoginPage(page);
    const accountCreatePage = new AccountCreatePage(page);
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    // 退会に失敗させるので、共有アカウントではなく専用のアカウントを作成する
    const reservedMail = `reserved-${Date.now()}@test.com`;
    const reservedPassword = 'Password1';

    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.fillName('予約太郎');
    await accountCreatePage.fillMailAddress(reservedMail);
    await accountCreatePage.fillPassword(reservedPassword);
    await accountCreatePage.fillPasswordCheck(reservedPassword);
    await accountCreatePage.clickCreateButton();
    await expect(page).toHaveURL('/login');

    await loginPage.fillMailAddress(reservedMail);
    await loginPage.fillPassword(reservedPassword);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');

    // きっぷを1件予約する
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');

    // 予約中のきっぷがあるため退会できないこと
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToAccountUpdate();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.clickDeleteButton();
    await expect(accountUpdatePage.deleteConfirmTitle).toBeVisible();
    await accountUpdatePage.clickDeleteConfirmButton();
    await expect(
        page.getByText('予約中のきっぷがあるため、退会できません。'),
    ).toBeVisible();
    await expect(page).toHaveURL('/accountUpdate');

    // 退会されておらず、再度ログインできること
    await accountUpdatePage.clickDeleteCancelButton();
    await page.getByRole('button', { name: 'OK' }).click();
    await logout();
    await loginPage.fillMailAddress(reservedMail);
    await loginPage.fillPassword(reservedPassword);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');

    // きっぷをキャンセルすれば退会できること（テストデータを残さない後片付けも兼ねる）
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.ticketButton
        .first()
        .waitFor({ state: 'visible' });
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickRefundConfirmButton();
    await page
        .getByRole('button', { name: 'キャンセル(0)' })
        .waitFor({ state: 'hidden' });

    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.clickDeleteButton();
    await accountUpdatePage.clickDeleteConfirmButton();
    await expect(page).toHaveURL('/login');
    await expect(page.getByText('退会が完了しました。')).toBeVisible();
});

test('メールアドレス変更後のモーダルのリンクから予約一覧画面に遷移できること', async ({
    page,
    logout,
}) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    const loginPage = new LoginPage(page);
    const accountCreatePage = new AccountCreatePage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);
    // 共有アカウントのメールアドレスを書き換えると他のテストに影響するため、変更用のアカウントを毎回作成する
    const timestamp = Date.now();
    const beforeMail = `before-${timestamp}@test.com`;
    const afterMail = `after-${timestamp}@test.com`;
    const password = 'Password1';

    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.fillName('変更太郎');
    await accountCreatePage.fillMailAddress(beforeMail);
    await accountCreatePage.fillPassword(password);
    await accountCreatePage.fillPasswordCheck(password);
    await accountCreatePage.clickCreateButton();
    await expect(page).toHaveURL('/login');

    // 作成したアカウントでログインできること
    await loginPage.fillMailAddress(beforeMail);
    await loginPage.fillPassword(password);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');

    // メールアドレスを変更できること
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.fillMailAddress(afterMail);
    await accountUpdatePage.fillPassword(password);
    await accountUpdatePage.clickUpdateButton();

    // 変更後は検索画面に遷移し、完了モーダルが開くこと
    await expect(page).toHaveURL('/scheduleSearch');
    const updateSuccessToast =
        page.getByText('アカウント情報の変更が完了しました。');
    await expect(updateSuccessToast).toBeVisible();
    await expect(
        page.getByText('チケットに紐づく予約者の情報は'),
    ).toBeVisible();

    // モーダルのリンクから予約一覧画面に遷移し、モーダルが閉じること
    await scheduleSearchPage.clickTicketUpdateToastButton();
    await expect(page).toHaveURL('/reservationList');
    await expect(updateSuccessToast).toBeHidden();

    await logout();
    await expect(page).toHaveURL('/login');
});
