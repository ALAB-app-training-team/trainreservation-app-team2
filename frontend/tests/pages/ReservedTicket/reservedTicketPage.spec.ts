import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';

test('座席ごとの金額が正しく表示されていること', async ({
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

test('タイトル表示：予約完了時は予約完了、予約確認のゲストログイン時は予約詳細・アカウントログイン時は表記なし、予約変更時に「予約変更完了」が表示されること', async ({
    page,
    createReservation,
    createGuestReservation,
    commonLogin,
    logout,
    context,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    // 予約完了時は予約完了と表示されること
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約完了');

    // 予約確認のアカウントログイン時は表記なしであること
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toBeHidden();

    // 予約変更時に「予約変更完了」と表示されること
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await page.getByText('1号車').waitFor({ state: 'visible' });
    await selectSeatPage.selectSeat();
    await selectSeatPage.clickUpdateButton();
    await selectSeatPage.clickUpdateConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約変更完了');

    // 予約確認のゲストログイン時は予約詳細と表示されること
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

test('戻るボタン表示有無：予約確認のアカウントログイン時はあり・ゲストログイン時はなし、予約変更時はなし、予約完了時はなしであること', async ({
    page,
    createReservation,
    createGuestReservation,
    commonLogin,
    logout,
    context,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    // 予約完了時は戻るボタンがないこと
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.backButton).toBeHidden();

    // 予約確認のアカウントログイン時は戻るボタンがあること
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.backButton).toBeVisible();

    // 予約変更時は戻るボタンがないこと
    await reservedTicketPage.header.clickUserName();
    await reservedTicketPage.header.goToReservationList();
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await page.getByText('1号車').waitFor({ state: 'visible' });
    await selectSeatPage.selectSeat();
    await selectSeatPage.clickUpdateButton();
    await selectSeatPage.clickUpdateConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.backButton).toBeHidden();

    // 予約確認のゲストログイン時は戻るボタンがないこと
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
    await expect(reservedTicketPage.backButton).toBeHidden();
});

test('予約変更ボタン表示有無：アカウントログイン時はあり・ゲストログイン時はなし・同行者はなしであること', async ({
    page,
    createReservation,
    createGuestReservation,
    commonLogin,
    logout,
    context,
}) => {
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);

    // アカウントログイン時は予約変更ボタンがあること
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.changeButton).toBeVisible();

    // ゲストログイン時は予約変更ボタンがないこと
    await logout();
    await expect(page).toHaveURL('/login');
    await createGuestReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約完了');
    await reservedTicketPage.clickCompanionChangeButton();
    await reservedTicketPage.checkCompanionCheckBox();
    await reservedTicketPage.inputCompanionInfo();
    await reservedTicketPage.clickCompanionChangeConfirmButton();
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
    await expect(reservedTicketPage.changeButton).toBeHidden();

    // 同行者は予約変更ボタンがないこと
    await page.goto(clipboardText);
    await expect(page).toHaveURL(/\/reservationGuestLogin\?.+/);
    await reservationGuestLoginPage.inputCompanionLoginInfo();
    await reservationGuestLoginPage.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.changeButton).toBeHidden();
});

test('予約キャンセルボタン表示有無：アカウントログイン時はあり・ゲストログイン時はあり・同行者はなしであること', async ({
    page,
    createReservation,
    createGuestReservation,
    commonLogin,
    logout,
    context,
}) => {
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);

    // アカウントログイン時は予約キャンセルボタンがあること
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.refundButton).toBeVisible();

    // ゲストログイン時は予約キャンセルボタンがないこと
    await logout();
    await expect(page).toHaveURL('/login');
    await createGuestReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約完了');
    await reservedTicketPage.clickCompanionChangeButton();
    await reservedTicketPage.checkCompanionCheckBox();
    await reservedTicketPage.inputCompanionInfo();
    await reservedTicketPage.clickCompanionChangeConfirmButton();
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
    await expect(reservedTicketPage.refundButton).toBeVisible();

    // 同行者は予約キャンセルボタンがないこと
    await page.goto(clipboardText);
    await expect(page).toHaveURL(/\/reservationGuestLogin\?.+/);
    await reservationGuestLoginPage.inputCompanionLoginInfo();
    await reservationGuestLoginPage.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.refundButton).toBeHidden();
});

test('同行者割り当てボタン表示有無：アカウントログイン時はあり・ゲストログイン時はあり・同行者はなしであること', async ({
    page,
    createReservation,
    createGuestReservation,
    commonLogin,
    logout,
    context,
}) => {
    const reservedTicketPage = new ReservedTicketPage(page);
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);

    // アカウントログイン時は同行者割り当てボタンがあること
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.companionChangeButton).toBeVisible();

    // ゲストログイン時は同行者割り当てボタンがないこと
    await logout();
    await expect(page).toHaveURL('/login');
    await createGuestReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.title).toHaveText('予約完了');
    await reservedTicketPage.clickCompanionChangeButton();
    await reservedTicketPage.checkCompanionCheckBox();
    await reservedTicketPage.inputCompanionInfo();
    await reservedTicketPage.clickCompanionChangeConfirmButton();
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
    await expect(reservedTicketPage.companionChangeButton).toBeVisible();

    // 同行者は同行者割り当てボタンがないこと
    await page.goto(clipboardText);
    await expect(page).toHaveURL(/\/reservationGuestLogin\?.+/);
    await reservationGuestLoginPage.inputCompanionLoginInfo();
    await reservationGuestLoginPage.clickGuestLoginButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(reservedTicketPage.companionChangeButton).toBeHidden();
});
