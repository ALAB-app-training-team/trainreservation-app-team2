import { expect } from '@playwright/test';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { test } from '@tests/fixtures';

test('座席ごとの金額が正しく表示されていること', async ({
    page,
    createReservation,
    login,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.header.goToReservationList();
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
    await logout();
    await expect(page).toHaveURL('/login');
});

test('タイトル表示：予約完了時は予約完了、予約確認のゲストログイン時は予約詳細・アカウントログイン時は表記なしであること', async ({
    page,
    createReservation,
    createGuestReservation,
    login,
    logout,
    context,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);

    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約完了');

    await reservedTicketPage.header.goToReservationList();
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toBeHidden();

    await logout();
    await expect(page).toHaveURL('/login');
    await createGuestReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約完了');

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
    await expect(reservedTicketPage.title).toHaveText('予約詳細');
});
