import { test, expect } from '@playwright/test';
import { ScheduleSearchPage } from './pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from './pages/SelectSeat/SelectSeatPage';
import { ReservationListPage } from './pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from './pages/ReservedTicket/ReservedTicketPage';
import { ReservationGuestLoginPage } from './pages/ReservationGuestLogin/ReservationGuestLoginPage';

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
    // await expect(
    //     page.getByText(
    //         'エラーが発生しました。しばらくしてから再度お試しください。',
    //     ),
    // ).toBeHidden();
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
