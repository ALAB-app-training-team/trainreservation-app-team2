import { expect, test } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { App } from '@tests/pages/shared/App';
import { LoginPage } from './pages/Login/LoginPage';

test('navigate-検索～予約確認', async ({ page }) => {
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

test('navigate-ログイン～検索', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.inputLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/scheduleSearch');
});

test('navigate-header', async ({ page }) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await reservationGuestLoginPage.goto();
    await expect(page).toHaveURL('/reservationGuestLogin');
    await reservationGuestLoginPage.header.goToSchduleSearchBySystemName();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.gotoReservationGuestLogin();
    await expect(page).toHaveURL('/reservationGuestLogin');
    await reservationGuestLoginPage.header.gotoScheduleSearch();
    await expect(page).toHaveURL('/scheduleSearch');
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
