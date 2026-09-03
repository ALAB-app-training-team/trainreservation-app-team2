import { expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { App } from '@tests/pages/shared/App';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { test } from '@tests/fixtures';
import { AccountCreatePage } from '@tests/pages/AccountCreate/AccountCreatePage';
import { PasswordUpdateForAdminPage } from './pages/PasswordUpdateForAdmin/PasswordUpdateForAdminPage';
import { AccountUpdatePage } from './pages/AccountUpdate/AccountUpdatePage';
import { PasswordUpdatePage } from './pages/PasswordUpdate/PasswordUpdatePage';

test('navigate-ゲストログイン全機能', async ({ page, context, logout }) => {
    test.setTimeout(60_000);
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const loginPage = new LoginPage(page);

    // 検索～予約
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await selectSeatPage.inputReserverInfo();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickCancelButton();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickReserveConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    // 同行者割り当て
    await reservedTicketPage.clickCompanionChangeButton();
    await reservedTicketPage.checkCompanionCheckBox();
    await reservedTicketPage.inputCompanionInfo();
    await reservedTicketPage.clickCompanionChangeConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    // 共有用URLを用いて同行者で予約確認
    await reservedTicketPage.clickTicketShareButton();
    await reservedTicketPage.linkCopyElement.waitFor({ state: 'visible' });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await reservedTicketPage.clickLinkCopyButton();
    await expect(reservedTicketPage.linkCopyElement).toHaveText('コピー完了');
    const clipboardText = await page.evaluate(async () => {
        return await navigator.clipboard.readText();
    });
    await page.goto(clipboardText);
    await expect(page).toHaveURL(/\/reservationGuestLogin\?.+/);
    await reservationGuestLoginPage.inputCompanionLoginInfo();
    await reservationGuestLoginPage.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();

    // 検索～アカウント作成して予約
    const createdAccountMail = `guest-${Date.now()}@test.com`;
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await selectSeatPage.inputReserverInfo(createdAccountMail);
    await selectSeatPage.clickAccountCreateCheckBox();
    await selectSeatPage.inputPasswordInfo();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickCancelButton();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickReserveConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');

    // 作成したアカウントでログイン
    await logout();
    await loginPage.goto();
    await loginPage.inputCreatedAccountLoginInfo(createdAccountMail);
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');

    // TODO:アカウント退会させる（ローカルでテストを通すため）
});

test('navigate-アカウントログイン全機能', async ({
    page,
    commonLogin,
    logout,
    createReservation,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationListPage = new ReservationListPage(page);
    const accountCreatePage = new AccountCreatePage(page);
    const loginPage = new LoginPage(page);

    // アカウント新規登録
    await loginPage.goto();
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.inputCreateRamdomAccountInfo();
    await accountCreatePage.clickCreateButton();
    await expect(page).toHaveURL('/login');

    // 作成したアカウントでログイン
    await loginPage.fillMailAddress(await accountCreatePage.ramdomMail);
    await loginPage.fillPassword('Password1');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await logout();

    // ログイン、検索～予約
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.header.userName).toBeVisible();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickReserveConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');

    // 予約一覧～予約確認～予約変更
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickBackButton();
    await expect(page).toHaveURL('/reservationList');
    // 予約変更（座席変更）
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    await page.getByText('1号車').waitFor({ state: 'visible' });
    await selectSeatPage.selectSeat();
    await selectSeatPage.clickUpdateButton();
    await expect(page.getByText('予約変更確認')).toBeVisible();
    await selectSeatPage.clickUpdateConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    //  予約変更（日時列車変更）
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeTrainConfirmButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickBackButton();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeTrainConfirmButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickSecondDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
    await selectSeatPage.selectSeat();
    await selectSeatPage.clickUpdateButton();
    await selectSeatPage.clickUpdateConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');

    // 予約詳細～予約変更
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    // 予約変更（座席変更）
    await reservedTicketPage.clickChangeButton();
    await reservedTicketPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickChangeButton();
    await reservedTicketPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await selectSeatPage.clickUpdateButton();
    await expect(page.getByText('予約変更確認')).toBeVisible();
    await selectSeatPage.clickUpdateConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    //  予約変更（日時列車変更）
    await reservedTicketPage.clickChangeButton();
    await reservedTicketPage.clickChangeTrainConfirmButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickBackButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickChangeButton();
    await reservedTicketPage.clickChangeTrainConfirmButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickSecondDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
    await selectSeatPage.selectSeat();
    await selectSeatPage.clickUpdateButton();
    await selectSeatPage.clickUpdateConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');

    // キャンセル(予約一覧)
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickModalCloseButton();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickRefundConfirmButton();
    await expect(page).toHaveURL('/reservationList');

    // キャンセル(予約詳細)
    await createReservation();
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickRefundButton();
    await reservedTicketPage.clickModalCloseButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickRefundButton();
    await reservedTicketPage.clickConfirmRefundButton();
    await expect(page).toHaveURL('/reservationList');

    // ログアウト
    await logout();
    await expect(page).toHaveURL('/login');
});

test('navigate-管理者ログイン-管理機能', async ({
    page,
    adminLogin,
    logout,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const loginPage = new LoginPage(page);
    const passwordUpdateForAdminPage = new PasswordUpdateForAdminPage(page);
    const accountCreatePage = new AccountCreatePage(page);
    const yamadaAccountMail = `yamada-${Date.now()}@test.co.jp`;

    // 山田太郎アカウント新規登録 Password1
    await loginPage.goto();
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.fillName('山田 太郎');
    await accountCreatePage.fillMailAddress(yamadaAccountMail);
    await accountCreatePage.fillPassword('Password1');
    await accountCreatePage.fillPasswordCheck('Password1');
    await accountCreatePage.clickCreateButton();
    await expect(page).toHaveURL('/login');

    // 山田太郎がPassword1でログインできること
    await loginPage.fillMailAddress(yamadaAccountMail);
    await loginPage.fillPassword('Password1');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.header.userName).toBeVisible();
    await logout();

    // 管理者で山田太郎のパスワード変更 Password2
    await adminLogin();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdminPage.fillName('山田 太郎');
    await passwordUpdateForAdminPage.fillMailAddress(yamadaAccountMail);
    await passwordUpdateForAdminPage.fillPassword('Password2');
    await passwordUpdateForAdminPage.fillPasswordCheck('Password2');
    await passwordUpdateForAdminPage.clickUpdateButton();
    await expect(page).toHaveURL('/admin/password');
    await logout();

    // 山田太郎がPassword2でログインできること
    await loginPage.fillMailAddress(yamadaAccountMail);
    await loginPage.fillPassword('Password2');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.header.userName).toBeVisible();
    await logout();

    await loginPage.fillMailAddress(yamadaAccountMail);
    await loginPage.fillPassword('Password1');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    // TODO:アカウント退会させる（ローカルでテストを通すため）
});

test('navigate-座席選択画面からログインして予約', async ({ page, logout }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const loginPage = new LoginPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.clickLoginButton();
    await expect(page).toHaveURL('/login');
    await loginPage.loginButton.waitFor({ state: 'visible' });
    await loginPage.inputCommonLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickReserveConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('navigate-header', async ({ page }) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const passwordUpdateForAdminPage = new PasswordUpdateForAdminPage(page);
    const reservationListPage = new ReservationListPage(page);
    const accountUpdatePage = new AccountUpdatePage(page);
    const passwordUpdatePage = new PasswordUpdatePage(page);
    const loginPage = new LoginPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationGuestLoginPage.header.goToSchduleSearchBySystemName();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.goToLogin();
    await expect(page).toHaveURL('/login');
    await loginPage.inputCommonLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.clickUserName();
    await scheduleSearchPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.header.clickUserName();
    await reservationListPage.header.goToAccountUpdate();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.header.clickUserName();
    await accountUpdatePage.header.goToPasswordUpdate();
    await expect(page).toHaveURL('/passwordUpdate');
    await passwordUpdatePage.header.clickUserName();
    await passwordUpdatePage.header.goToLogout();
    await expect(page).toHaveURL('/login');
    await loginPage.inputAdminLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdminPage.header.goToScheduleSearch();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.clickUserName();
    await scheduleSearchPage.header.goToPasswordUpdateForAdmin();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdminPage.header.clickUserName();
    await passwordUpdateForAdminPage.header.goToLogout();
    await expect(page).toHaveURL('/login');
});

// 以下、Loader（特定の条件下でのredirectの処理）のテスト
test('navigate-ログイン状態で、ゲストログイン画面にアクセスすると予約一覧画面に遷移する', async ({
    page,
    commonLogin,
    logout,
}) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const apps = new App(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    apps.expectSessionAlert();
    await reservationGuestLoginPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await logout();
});

test('navigate-未ログイン状態で予約一覧にアクセスするとログイン画面に遷移する', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const reservationListPage = new ReservationListPage(page);
    const apps = new App(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    apps.expectSessionAlert();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/login');
});

test('navigate-reservedTicketのURLに予約IDがない場合、列車検索画面に遷移する', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const apps = new App(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    apps.expectSessionAlert();
    await reservedTicketPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
});

test('navigate-reservationGuestLoginのURLに予約IDがない場合、列車検索画面に遷移する', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const apps = new App(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    apps.expectSessionAlert();
    await reservationGuestLoginPage.gotoEmpty();
    await expect(page).toHaveURL('/scheduleSearch');
});

test('navigate-ログイン状態でloginのパスを入力すると検索画面に遷移', async ({
    page,
    commonLogin,
    logout,
}) => {
    const loginPage = new LoginPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await loginPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await logout();
    await expect(page).toHaveURL('/login');
});

test('navigate-ログイン状態でaccountCreateのパスを入力すると検索画面に遷移', async ({
    page,
    commonLogin,
    logout,
}) => {
    const loginPage = new LoginPage(page);
    const accountCreatePage = new AccountCreatePage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await accountCreatePage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await logout();
    await expect(page).toHaveURL('/login');
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
});

test('navigate-一般ログイン状態でadmin/passwordのパスを入力すると検索画面に遷移', async ({
    page,
    commonLogin,
}) => {
    const passwordUpdateForAdminPage = new PasswordUpdateForAdminPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await passwordUpdateForAdminPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
});

test('navigate-未ログイン状態でaccountUpdate/のパスを入力するとログイン画面に遷移', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const accountUpdatePage = new AccountUpdatePage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/login');
});

test('navigate-未ログイン状態でpasswordUpdate/のパスを入力するとログイン画面に遷移', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const passwordUpdatePage = new PasswordUpdatePage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await passwordUpdatePage.goto();
    await expect(page).toHaveURL('/login');
});
