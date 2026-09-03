import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '../ReservedTicket/ReservedTicketPage';

test('お支払い合計が正しく表示されていること', async ({
    page,
    createReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    const expectedFare = await reservationListPage.totalFareElement.filter({
        hasText: '2,600',
    });
    await expect(expectedFare.first()).toBeVisible();

    await logout();
    await expect(page).toHaveURL('/login');
});

test('有効タブは本日または未来の日付であること', async ({
    page,
    createReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');

    const dateTexts = await page.getByTestId('ride-date').allTextContents();

    for (const text of dateTexts) {
        const match = text.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (!match) continue;

        const [_, year, month, day] = match;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        await expect(date.getTime()).toBeGreaterThanOrEqual(today.getTime());
    }
    await logout();
    await expect(page).toHaveURL('/login');
});

test('過去タブは過去の日付であること', async ({
    page,
    createReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickPastButton();
    const dateTexts = await page.getByTestId('ride-date').allTextContents();

    for (const text of dateTexts) {
        const match = text.match(/(\d{4})年(\d{2})月(\d{2})日/);
        if (!match) continue;

        const [_, year, month, day] = match;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        await expect(date.getTime()).toBeLessThan(today.getTime());
    }
    await logout();
    await expect(page).toHaveURL('/login');
});

test('削除すると予約が1件削除されること', async ({
    page,
    createGuestReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);

    await createGuestReservation();
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.threeDotsButton
        .first()
        .waitFor({ state: 'visible' });
    const beforeReservationCount: number =
        await reservationListPage.threeDotsButton.count();

    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickRefundConfirmButton();

    await expect(reservationListPage.threeDotsButton).toHaveCount(
        beforeReservationCount - 1,
    );
    await logout();
    await expect(page).toHaveURL('/login');
});

test('予約キャンセル：キャンセルすることで予約一覧(有効)から予約の数が一個減っていること', async ({
    page,
    createReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.canceledButton.waitFor({ state: 'visible' });
    await reservationListPage.ticketButton
        .first()
        .waitFor({ state: 'visible', timeout: 10000 });

    const activeTicketCount = await reservationListPage.ticketButton.count();
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickModalCloseButton();
    const notCancelTicketCount = await reservationListPage.ticketButton.count();
    await expect(notCancelTicketCount).toEqual(activeTicketCount);
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickRefundButton();
    await reservationListPage.clickRefundConfirmButton();
    await page
        .getByRole('button', {
            name: 'キャンセル(0)',
        })
        .waitFor({ state: 'hidden' });
    const cancelTicketCount = await reservationListPage.ticketButton.count();
    await expect(cancelTicketCount).toEqual(activeTicketCount - 1);
    await logout();
    await expect(page).toHaveURL('/login');
});

test('チケットを表示ボタン、三点ボタンの表示有無：有効では表示あり、過去・キャンセルでは表示なし', async ({
    page,
    createReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.canceledButton.waitFor({ state: 'visible' });
    await reservationListPage.ticketButton
        .first()
        .waitFor({ state: 'visible', timeout: 15000 });

    // 有効：表示あり
    await expect(reservationListPage.ticketButton.first()).toBeVisible();
    await expect(reservationListPage.threeDotsButton.first()).toBeVisible();

    // 過去：表示なし
    await reservationListPage.clickPastButton();
    await expect(reservationListPage.ticketButton).toHaveCount(0);
    await expect(reservationListPage.threeDotsButton).toHaveCount(0);

    // キャンセル：表示なし
    await reservationListPage.clickCanceledButton();
    await expect(reservationListPage.ticketButton).toHaveCount(0);
    await expect(reservationListPage.threeDotsButton).toHaveCount(0);

    await logout();
    await expect(page).toHaveURL('/login');
});

test('復路で検索の表示有無：有効・過去では表示あり、キャンセルでは表示なし', async ({
    page,
    createReservation,
    commonLogin,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.canceledButton.waitFor({ state: 'visible' });
    await reservationListPage.ticketButton
        .first()
        .waitFor({ state: 'visible', timeout: 15000 });

    // 有効：表示あり
    await expect(
        reservationListPage.searchReturnTripButton.first(),
    ).toBeVisible();

    // 過去：1件以上あったら、表示あり
    if (
        await reservationListPage.totalFareElement
            .first()
            .isVisible()
            .catch(() => false)
    ) {
        await expect(
            reservationListPage.searchReturnTripButton.first(),
        ).toBeVisible();
    }

    // キャンセル：表示なし
    await reservationListPage.clickCanceledButton();
    await expect(reservationListPage.searchReturnTripButton).toHaveCount(0);

    await logout();
    await expect(page).toHaveURL('/login');
});
