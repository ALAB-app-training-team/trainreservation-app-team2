import { expect, test } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';

test('お支払い合計が正しく表示されていること', async ({ page }) => {
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    const reservationListPage = new ReservationListPage(page);
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
    await page.goto('/reservationList');
    await page.waitForLoadState('networkidle');
    await expect(reservationListPage.totalFareElement.first()).toBeVisible();
    await expect(reservationListPage.totalFareElement.first()).toContainText(
        '2,600',
    );
});
