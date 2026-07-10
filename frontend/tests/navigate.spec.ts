import { test, expect } from '@playwright/test';
import { ScheduleSearchPage } from './pages/ScheduleSearchPage';
import { SelectSeatPage } from './pages/SelectSeatPage';
import { ReservationListPage } from './pages/ReservationListPage';
import { ReservedTicketPage } from './pages/ReservedTicketPage';

test('navigate-schedule', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

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
});

test('navigate-reservation', async ({ page }) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.clickBackButton();
    await expect(page).toHaveURL('/reservationList');
});

test('navigate-header', async ({ page }) => {
    const reservationListPage = new ReservationListPage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.header.goToSchduleSearchBySystemName();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.header.gotoReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.header.gotoScheduleSearch();
    await expect(page).toHaveURL('/scheduleSearch');
});
