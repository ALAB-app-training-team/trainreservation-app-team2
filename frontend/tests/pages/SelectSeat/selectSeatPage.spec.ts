import { test, expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';

test('test', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();

    await page.getByRole('textbox', { name: '購入者氏名' }).fill('山田 太郎');
    await page
        .getByRole('textbox', { name: 'メールアドレス' })
        .fill('demo@example.com');
    await page
        .getByRole('textbox', { name: 'カード番号' })
        .fill('4111222233334444');
    await page
        .getByRole('textbox', { name: 'カード名義人' })
        .fill('TARO YAMADa');
    await page
        .getByRole('textbox', { name: '有効期限（月/年）' })
        .fill('12/28');
    await page.getByRole('textbox', { name: 'セキュリティコード' }).fill('123');
    await page.getByRole('button', { name: '予約を確定' }).click();
    await page.getByRole('button', { name: 'キャンセル' }).click();
    await page.getByRole('button', { name: '予約を確定' }).click();
    await page.getByRole('button', { name: '予約を確定' }).click();

    await selectSeatPage.selectSeat();
    await selectSeatPage.inputResererInfo();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();
});

test('ゴミ箱ボタンを押すと、選択した座席が解除される', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page.getByText('座席が選択されていません')).toBeVisible();

    await selectSeatPage.emptySeat.first().click();
    // await page.getByRole('button', { name: '1A', exact: true }).click();

    await selectSeatPage.emptySeat.nth(1).click();
    // await page.getByRole('button', { name: '1B', exact: true }).click();

    await expect(page.getByTestId('selected-seats')).toContainText(
        await selectSeatPage.emptySeat.first().textContent(),
    );
    await expect(page.getByText('1号車1B')).toBeVisible();
    await page.getByTestId('trash-button').click();
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
});

test('座席を6席選択すると、それ以上選択できない', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: '1B', exact: true }).click();
    await page.getByRole('button', { name: '2', exact: true }).click();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: '1B', exact: true }).click();
    await page.getByRole('button', { name: 'グリーン車' }).click();
    await page.getByRole('button', { name: '1A', exact: true }).click();
    await page.getByRole('button', { name: 'グランクラス' }).click();
    await page.getByRole('button', { name: '1A' }).click();
    await expect(page.getByText('1号車1A')).toBeVisible();
    await expect(page.getByText('1号車1B')).toBeVisible();
    await expect(page.getByText('2号車1A')).toBeVisible();
    await expect(page.getByText('2号車1B')).toBeVisible();
    await expect(page.getByText('9号車1A')).toBeVisible();
    await expect(page.getByText('10号車1A')).toBeVisible();
    await expect(
        page.getByText('一度に予約できる座席は6席までです'),
    ).toBeVisible();
    await expect(selectSeatPage.emptySeat).toBeHidden();
});

test('バリデーション？', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
});

test('予約確定', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
});
