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

test('有効タブは本日または未来の日付であること', async ({
    page,
    createReservation,
    guestLogin,
}) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await createReservation();
    await guestLogin();
    await expect(page).toHaveURL('/reservationList');

    const dateTexts = await page.getByTestId('ride-date').allTextContents();

    for (const text of dateTexts) {
        const match = text.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (!match) continue;

        const [_, year, month, day] = match;
        const date = new Date(Number(year), Number(month), Number(day));
        await expect(date.getTime()).toBeGreaterThanOrEqual(today.getTime());
    }
});

test('過去タブは過去の日付であること', async ({
    page,
    createReservation,
    guestLogin,
}) => {
    const reservationListPage = new ReservationListPage(page);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await createReservation();
    await guestLogin();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickPastButton();
    const dateTexts = await page.getByTestId('ride-date').allTextContents();

    for (const text of dateTexts) {
        const match = text.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (!match) continue;

        const [_, year, month, day] = match;
        const date = new Date(Number(year), Number(month), Number(day));
        await expect(date.getTime()).toBeLessThan(today.getTime());
    }
});
