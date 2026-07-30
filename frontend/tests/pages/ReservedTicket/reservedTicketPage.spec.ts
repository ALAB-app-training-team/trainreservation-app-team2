/* import { expect } from '@playwright/test';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { test } from '@tests/fixtures';

test('座席ごとの金額が正しく表示されていること', async ({
    page,
    createReservation,
    guestLogin,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

    await createReservation();
    await guestLogin();
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toBeHidden();
    await expect(reservedTicketPage.departureArrivalElement).toContainText(
        '東京',
    );
    await expect(reservedTicketPage.departureArrivalElement).toContainText(
        '上野',
    );
    await expect(reservedTicketPage.seatFareElement.first()).toContainText(
        '2,600',
    );
});
 */
