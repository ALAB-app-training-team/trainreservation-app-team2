import { test, expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';

test('ゴミ箱ボタンを押すと、選択した座席が解除される', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
    const firstSeat =
        (await selectSeatPage.emptySeat.first().textContent()) ?? '';
    const secondSeat =
        (await selectSeatPage.emptySeat.nth(1).textContent()) ?? '';
    await selectSeatPage.emptySeat.first().click();
    await selectSeatPage.emptySeat.nth(1).click();
    await expect(
        page
            .getByTestId('selected-seats')
            .getByText('1号車' + firstSeat, { exact: true }),
    ).toBeVisible();
    await expect(
        page
            .getByTestId('selected-seats')
            .getByText('1号車' + secondSeat, { exact: true }),
    ).toBeVisible();
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
    const firstSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const firstSeatText = await firstSeat.textContent();
    await firstSeat.click();
    const secondSeat = (await selectSeatPage.emptySeat.nth(1)) ?? '';
    const secondSeatText = await secondSeat.textContent();
    await secondSeat.click();

    await page
        .getByTestId('train-cars')
        .getByRole('button', { name: '2' })
        .first()
        .click();
    const thirdSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const thirdSeatText = await thirdSeat.textContent();
    await thirdSeat.click();
    const fourthSeat = (await selectSeatPage.emptySeat.nth(1)) ?? '';
    const fourthSeatText = await fourthSeat.textContent();
    await fourthSeat.click();

    await page.getByRole('button', { name: 'グリーン車' }).click();
    const trainCarInGreen =
        (await selectSeatPage.trainCars.first().textContent()) ?? '';
    const fifthSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const fifthSeatText = await fifthSeat.textContent();
    await fifthSeat.click();

    await page.getByRole('button', { name: 'グランクラス' }).click();
    const trainCarInGranClass =
        (await selectSeatPage.trainCars.first().textContent()) ?? '';
    const sixthSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const sixthSeatText = await sixthSeat.textContent();
    await sixthSeat.click();

    await expect(page.getByTestId('selected-seats')).toContainText(
        '1号車' + firstSeatText,
    );

    await expect(page.getByTestId('selected-seats')).toContainText(
        '1号車' + secondSeatText,
    );

    await expect(page.getByTestId('selected-seats')).toContainText(
        '2号車' + thirdSeatText,
    );
    await expect(page.getByTestId('selected-seats')).toContainText(
        '2号車' + fourthSeatText,
    );
    await expect(page.getByTestId('selected-seats')).toContainText(
        trainCarInGreen + '号車' + fifthSeatText,
    );
    await expect(page.getByTestId('selected-seats')).toContainText(
        trainCarInGranClass + '号車' + sixthSeatText,
    );

    await expect(
        page.getByText('一度に予約できる座席は6席までです'),
    ).toBeVisible();
    await expect(page.locator('button.bg-gray-200').first()).toBeDisabled();
});

// TODO: バリデーションの画面テストを実装する
// test('バリデーション？', async ({ page }) => {
//     const scheduleSearchPage = new ScheduleSearchPage(page);
//     const selectSeatPage = new SelectSeatPage(page);
//     await scheduleSearchPage.goto();
//     await expect(page).toHaveURL('/scheduleSearch');
//     await scheduleSearchPage.clickDetailButton();
//     await selectSeatPage.selectSeat();
//     await page.getByRole('textbox', { name: '購入者氏名' }).fill('山田 太郎');
//     await page
//         .getByRole('textbox', { name: 'メールアドレス' })
//         .fill('demo@example.com');
//     await page
//         .getByRole('textbox', { name: 'カード番号' })
//         .fill('4111222233334444');
//     await page
//         .getByRole('textbox', { name: 'カード名義人' })
//         .fill('TARO YAMADa');
//     await page
//         .getByRole('textbox', { name: '有効期限（月/年）' })
//         .fill('12/28');
//     await page.getByRole('textbox', { name: 'セキュリティコード' }).fill('123');
// });

test('予約確定', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    await scheduleSearchPage.goto();
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
});
