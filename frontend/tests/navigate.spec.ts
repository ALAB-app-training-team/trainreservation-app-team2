import { expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
/*import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { App } from '@tests/pages/shared/App';*/
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { Header } from '@tests/pages/shared/Header';
import { test } from '@tests/fixtures';

/* test('navigate-検索～予約確認', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

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
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();

    await reservationGuestLogin.goto();
    await expect(page).toHaveURL('/reservationGuestLogin');
    await reservationGuestLogin.inputGuestLoginInfo();
    await reservationGuestLogin.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickBackButton();
    await expect(page).toHaveURL('/reservationList');
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();
});

test('navigate-header', async ({ page }) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const loginPage = new LoginPage(page);

    await reservationGuestLoginPage.goto();
    await expect(page).toHaveURL('/reservationGuestLogin');
    await reservationGuestLoginPage.header.goToSchduleSearchBySystemName();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.goToReservationGuestLogin();
    await expect(page).toHaveURL('/reservationGuestLogin');
    await reservationGuestLoginPage.header.goToScheduleSearch();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.goToLogin();
    await expect(page).toHaveURL('/login');
    await loginPage.inputLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.clickCommonUser();
    await scheduleSearchPage.header.goToLogout();
    await expect(page).toHaveURL('/login');
});

test('navigate-ゲスト認証がない場合に予約一覧・予約詳細にアクセスするとゲストログインに遷移する', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const apps = new App(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    apps.expectSessionAlert();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationGuestLogin');

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    apps.expectSessionAlert();
    await reservedTicketPage.goto();
    await expect(page).toHaveURL('/reservationGuestLogin');
});
*/
test('navigate-検索～シートマップからログイン～予約完了', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const loginPage = new LoginPage(page);
    const header = new Header(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await expect(header.commonUser).toBeHidden();
    await selectSeatPage.clickLoginButton();

    await expect(page).toHaveURL('/login');
    await loginPage.inputLoginInfo();
    await loginPage.clickLoginButton();

    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await expect(selectSeatPage.loginButton).not.toBeVisible();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickConfirmButton();
    // TODO: 予約詳細画面ができたら、予約完了画面を確認する
    // await expect(page).toHaveURL('/reservedTicket');
    // await expect(
    //     page.getByText(
    //         'エラーが発生しました。しばらくしてから再度お試しください。',
    //     ),
    // ).toBeHidden();
});

test('navigate-ログイン～検索～予約完了', async ({ page, login }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const header = new Header(page);

    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(header.commonUser).toBeVisible();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(selectSeatPage.loginButton).not.toBeVisible();
    await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickConfirmButton();
    // TODO: 予約詳細画面ができたら、予約完了画面を確認する
    // await expect(page).toHaveURL('/reservedTicket');
    // await expect(
    //     page.getByText(
    //         'エラーが発生しました。しばらくしてから再度お試しください。',
    //     ),
    // ).toBeHidden();
});
