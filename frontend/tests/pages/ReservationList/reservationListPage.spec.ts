import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';

/* test('お支払い合計が正しく表示されていること', async ({
    page,
    createReservation,
    login,
}) => {
    const reservationListPage = new ReservationListPage(page);

    await createReservation();
    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await expect(reservationListPage.totalFareElement.first()).toBeVisible();
    await expect(reservationListPage.totalFareElement.first()).toContainText(
        '2,600',
    );
}); */

test('有効タブは本日または未来の日付であること', async ({
    page,
    createReservation,
    login,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await createReservation();
    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
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
    login,
}) => {
    const reservationListPage = new ReservationListPage(page);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await createReservation();
    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
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

/* test('削除すると予約が1件削除されること', async ({
    page,
    createReservation,
    login,
}) => {
    const reservationListPage = new ReservationListPage(page);

    await createReservation();
    await login();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.refundButton
        .first()
        .waitFor({ state: 'visible' });
    const beforeReservationCount: number =
        await reservationListPage.refundButton.count();

    await reservationListPage.clickRefundButton();
    await reservationListPage.clickrefundConfirmButton();

    await expect(reservationListPage.refundButton).toHaveCount(
        beforeReservationCount - 1,
    );
}); */
