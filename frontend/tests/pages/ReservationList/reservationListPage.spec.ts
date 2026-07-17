import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';

test('お支払い合計が正しく表示されていること', async ({
    page,
    createReservation,
    guestLogin,
}) => {
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    const reservationListPage = new ReservationListPage(page);

    await createReservation();
    await guestLogin();
    await expect(page).toHaveURL('/reservationList');
    await expect(reservationListPage.totalFareElement.first()).toBeVisible();
    await expect(reservationListPage.totalFareElement.first()).toContainText(
        '2,600',
    );
});
