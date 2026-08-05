import { expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { App } from '@tests/pages/shared/App';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { test } from '@tests/fixtures';

test('navigate-ゲストログイン全機能', async ({ page, context }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

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
    await selectSeatPage.inputResererInfo();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickCancelButton();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');

    // 予約完了画面の共有用URLを用いて予約確認
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
    await reservationGuestLoginPage.inputGuestLoginInfo();
    await reservationGuestLoginPage.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();
});

test('navigate-ログイン全機能', async ({ page, login, logout }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationListPage = new ReservationListPage(page);

    // ログイン、検索～予約
    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.header.commonUser).toBeVisible();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');

    // 予約一覧～予約確認・キャンセル、ログアウト
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickBackButton();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickCancelBackButton();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickCancelConfirmButton();
    await expect(page).toHaveURL('/reservationList');
    await logout();
    await expect(page).toHaveURL('/login');
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
    await loginPage.inputLoginInfo();
    await loginPage.clickLoginButton();
    await await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickConfirmButton();
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
    const loginPage = new LoginPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationGuestLoginPage.header.goToSchduleSearchBySystemName();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.goToReservationList();
    await expect(page).toHaveURL('/login');
    await reservationGuestLoginPage.header.goToScheduleSearch();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.goToLogin();
    await expect(page).toHaveURL('/login');
    await loginPage.inputLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await scheduleSearchPage.header.clickCommonUser();
    await scheduleSearchPage.header.goToLogout();
    await expect(page).toHaveURL('/login');
});

// 以下、Loader（特定の条件下でのredirectの処理）のテスト
test('navigate-ログイン状態で、ゲストログイン画面にアクセスすると予約一覧画面に遷移する', async ({
    page,
    login,
    logout,
}) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const apps = new App(page);

    await login();
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
