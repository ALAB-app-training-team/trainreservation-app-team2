import { expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { test } from '@tests/fixtures';
import { LoginPage } from '../Login/LoginPage';
import { ReservationListPage } from '../ReservationList/ReservationListPage';

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
            .getByText('1号車' + firstSeat + '￥2,600', { exact: true }),
    ).toBeVisible();
    await expect(
        page
            .getByTestId('selected-seats')
            .getByText('1号車' + secondSeat + '￥2,600', { exact: true }),
    ).toBeVisible();
    await page.getByTestId('trash-button').click();
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
});

test('座席を6席選択すると、それ以上選択できない', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    //  ダイヤ検索画面からシートマップ画面に遷移する
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
    // 1号車から座席を選択する
    const firstSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const firstSeatText = await firstSeat.textContent();
    await firstSeat.click();
    const secondSeat = (await selectSeatPage.emptySeat.nth(1)) ?? '';
    const secondSeatText = await secondSeat.textContent();
    await secondSeat.click();
    // 2号車から座席を選択する
    await page
        .getByTestId('train-cars')
        .getByRole('button', { name: '2' })
        .first()
        .click();
    await expect(
        page.getByTestId('train-cars').getByRole('button', { name: '2' }),
    ).toHaveClass(/bg-primary-light/);
    await page.getByText('2号車').waitFor({ state: 'visible' });
    const thirdSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const thirdSeatText = await thirdSeat.textContent();
    await thirdSeat.click();
    const fourthSeat = (await selectSeatPage.emptySeat.nth(1)) ?? '';
    const fourthSeatText = await fourthSeat.textContent();
    await fourthSeat.click();
    // グリーン車から座席を選択する
    await page.getByRole('button', { name: 'グリーン車' }).click();
    const trainCarInGreen =
        (await selectSeatPage.trainCars.first().textContent()) ?? '';
    const fifthSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const fifthSeatText = await fifthSeat.textContent();
    await fifthSeat.click();
    // グランクラスから座席を選択する
    await page.getByRole('button', { name: 'グランクラス' }).click();
    const trainCarInGranClass =
        (await selectSeatPage.trainCars.first().textContent()) ?? '';
    const sixthSeat = (await selectSeatPage.emptySeat.first()) ?? '';
    const sixthSeatText = await sixthSeat.textContent();
    await sixthSeat.click();
    // 選択した座席が正しいか確認する
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
    // ６席以上選択できないことを確認する
    await expect(
        page.getByText('一度に予約できる座席は6席までです'),
    ).toBeVisible();
    await expect(page.locator('button.bg-gray-200').first()).toBeDisabled();
});

test('購入者情報バリデーションチェック', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await selectSeatPage.selectSeat();
    await expect(selectSeatPage.reserveButton).toBeDisabled();

    // 名前-必須
    await selectSeatPage.name.click();
    await selectSeatPage.trainCars.first().click();
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '予約者氏名を入力してください',
    );
    // 名前-文字数
    const name256str =
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをんあいうえおかきくけこさしすせそたちつてとなにぬねのは';
    await selectSeatPage.fillName(name256str);
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '予約者氏名は255文字以内で入力してください',
    );
    // 名前-正常系
    await selectSeatPage.fillName('田中太郎');
    await expect(selectSeatPage.reservationInfoError).toBeHidden();

    // メールアドレス-必須
    await selectSeatPage.mailAddress.click();
    await selectSeatPage.name.click();
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'メールアドレスを入力してください',
    );
    // メールアドレス-形式
    await selectSeatPage.fillMailAddress('a@c');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'メールアドレスの形式（~~@~~.~~）で入力してください',
    );
    await selectSeatPage.fillMailAddress('a@c.c');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'メールアドレスの形式（~~@~~.~~）で入力してください',
    );
    await selectSeatPage.fillMailAddress('a@c.[');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'メールアドレスの形式（~~@~~.~~）で入力してください',
    );
    // メールアドレス-文字数
    const mail256str =
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@co.mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm';
    await selectSeatPage.fillMailAddress(mail256str);
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'メールアドレスは255文字以内で入力してください',
    );
    // メールアドレス-正常系
    await selectSeatPage.fillMailAddress('a@c.co');
    await expect(selectSeatPage.reservationInfoError).toBeHidden();

    // カード番号-必須
    await selectSeatPage.cardNumber.click();
    await selectSeatPage.mailAddress.click();
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '14-16桁の有効なカード番号を入力してください',
    );
    // カード番号-文字数
    const cardNum13 = '1234567890123';
    await selectSeatPage.fillCardNumber(cardNum13);
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '14-16桁の有効なカード番号を入力してください',
    );
    const cardNum14 = '12345678901234';
    await selectSeatPage.fillCardNumber(cardNum14);
    await expect(selectSeatPage.reservationInfoError).toBeHidden();

    const cardNum16 = '1234567890123456';
    await selectSeatPage.fillCardNumber(cardNum16);
    await expect(selectSeatPage.reservationInfoError).toBeHidden();
    const cardNum17 = '12345678901234567';
    await selectSeatPage.fillCardNumber(cardNum17);
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '14-16桁の有効なカード番号を入力してください',
    );
    // カード番号-形式
    await selectSeatPage.fillCardNumber('aaaaa');
    await expect(selectSeatPage.cardNumber).not.toHaveText('aaaaa');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '14-16桁の有効なカード番号を入力してください',
    );
    // カード番号-正常系
    await selectSeatPage.fillCardNumber('4111222233334444');
    await expect(selectSeatPage.reservationInfoError).toBeHidden();

    // カード名義人-必須
    await selectSeatPage.cardHolderName.click();
    await selectSeatPage.cardNumber.click();
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'カード名義人を入力してください',
    );
    // カード名義人-形式
    await selectSeatPage.fillCardHolderName('あああああ');
    await expect(selectSeatPage.cardHolderName).not.toHaveText('あああああ');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'カード名義人を入力してください',
    );
    // カード名義人-正常系
    await selectSeatPage.fillCardHolderName('TARO YAMADA');
    await expect(selectSeatPage.reservationInfoError).toBeHidden();

    // 有効期限-必須
    await selectSeatPage.cardExpiry.click();
    await selectSeatPage.cardNumber.click();
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'MM/YY（月/年）の形式で入力してください',
    );
    // 有効期限-形式
    await selectSeatPage.fillCardExpiry('ああああ');
    await expect(selectSeatPage.cardExpiry).not.toHaveText('ああああ');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        'MM/YY（月/年）の形式で入力してください',
    );
    // 有効期限-正常系
    await selectSeatPage.fillCardExpiry('12/28');
    await expect(selectSeatPage.reservationInfoError).toBeHidden();

    // セキュリティコード-必須
    await selectSeatPage.secureCode.click();
    await selectSeatPage.cardNumber.click();
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '半角数字3-4桁で入力してください',
    );
    // セキュリティコード-形式
    await selectSeatPage.fillSecureCode('ああああ');
    await expect(selectSeatPage.secureCode).not.toHaveText('ああああ');
    await expect(selectSeatPage.reservationInfoError).toContainText(
        '半角数字3-4桁で入力してください',
    );
    // セキュリティコード-正常系
    await selectSeatPage.fillSecureCode('123');
});

test('アカウント作成時のパスワードバリデーションチェック', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await selectSeatPage.selectSeat();
    await expect(selectSeatPage.reserveButton).toBeDisabled();
    await selectSeatPage.clickAccountCreateCheckBox();
    await selectSeatPage.fillPassword('Password1');

    // パスワード -8文字以下
    await selectSeatPage.fillPassword('Pass1');
    await expect(
        await selectSeatPage.lengthPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -64文字以上
    await selectSeatPage.fillPassword(
        'Password1Password2Password3Password4Password5Password6Password7Password8',
    );
    await expect(
        await selectSeatPage.lengthPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -半角英数字を含まない
    await selectSeatPage.fillPassword('Password');
    await expect(
        await selectSeatPage.numberPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -半角英大文字を含まない
    await selectSeatPage.fillPassword('password1');
    await expect(
        await selectSeatPage.uppercasePolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -半角英小文字を含まない
    await selectSeatPage.fillPassword('PASSWORD1');
    await expect(
        await selectSeatPage.lowercasePolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード -使用できない文字が含まれている
    await selectSeatPage.fillPassword('Password1|');
    await expect(
        await selectSeatPage.validPolicy.evaluate((el) =>
            window.getComputedStyle(el).getPropertyValue('color'),
        ),
    ).toBe('oklch(0.704 0.191 22.216)');

    // パスワード再入力 -未入力
    await selectSeatPage.passwordCheck.click();
    await selectSeatPage.password.click();
    await expect(
        page.getByText('パスワードを再入力してください'),
    ).toBeVisible();

    // パスワード再入力 -不一致
    await selectSeatPage.fillPassword('Password1');
    await selectSeatPage.fillpasswordCheck('not-match');
    await selectSeatPage.password.click();
    await expect(page.getByText('パスワードが一致しません')).toBeVisible();
});

test('予約確定', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await selectSeatPage.inputReserverInfo();
    await selectSeatPage.inputCardInfo();
    await expect(page.getByText('座席数合計：1席')).toBeVisible();
    await expect(page.getByText('お支払い合計：￥2,600')).toBeVisible();
    await selectSeatPage.clickReseveButton();
    await selectSeatPage.clickReserveConfirmButton();
    await expect(page).toHaveURL('/reservedTicket');
    await expect(
        page.getByText(
            'エラーが発生しました。しばらくしてから再度お試しください。',
        ),
    ).toBeHidden();
});

test('パスワードがエラーの場合、予約するボタンが非活性', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.selectSeat();
    await selectSeatPage.inputReserverInfo();
    await selectSeatPage.inputCardInfo();
    await selectSeatPage.clickAccountCreateCheckBox();

    // パスワードポリシー -不一致
    await selectSeatPage.fillPassword('not-policy');
    await selectSeatPage.fillpasswordCheck('not-policy');
    await expect(selectSeatPage.reserveButton).toBeDisabled();

    // パスワード再入力 -未入力
    await selectSeatPage.fillpasswordCheck('');
    await expect(selectSeatPage.reserveButton).toBeDisabled();

    // パスワード再入力 -不一致
    await selectSeatPage.fillPassword('Password1');
    await selectSeatPage.fillpasswordCheck('not-match');
    await expect(selectSeatPage.reserveButton).toBeDisabled();

    // 正しいパスワード入力
    await selectSeatPage.inputPasswordInfo();
    await expect(selectSeatPage.reserveButton).toBeEnabled();
});

test('ログイン中は氏名・メールアドレス入力欄・アカウント作成ボタン・ログインボタンが表示されない', async ({
    page,
    commonLogin,
    logout,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPagePage = new SelectSeatPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();

    await selectSeatPagePage.name.isHidden();
    await selectSeatPagePage.mailAddress.isHidden();
    await selectSeatPagePage.accountCreateCheckBox.isHidden();
    await selectSeatPagePage.loginButton.isHidden();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('未ログイン時は氏名・メールアドレス入力欄・アカウント作成ボタン・ログインボタンが表示される', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPagePage = new SelectSeatPage(page);

    scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();

    await selectSeatPagePage.name.isEditable();
    await selectSeatPagePage.mailAddress.isEditable();
    await selectSeatPagePage.accountCreateCheckBox.isVisible();
    await selectSeatPagePage.loginButton.isEnabled();
});

test('シートマップでログインすると選択した座席が保持されていること', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const loginPage = new LoginPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).toBeVisible();
    await selectSeatPage.selectSeat();
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
    await selectSeatPage.clickLoginButton();
    await expect(page).toHaveURL('/login');
    await loginPage.loginButton.waitFor({ state: 'visible' });
    await loginPage.inputcommonLoginInfo();
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/selectSeat');
    await expect(page.getByText('座席が選択されていません')).toBeHidden();
});

test('座席変更の際はクレカ入力欄が表示されないこと', async ({
    page,
    commonLogin,
    createReservation,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);

    // ログイン～予約～座席変更シートマップ
    commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    //  確認事項
    await expect(
        page.getByText('※初回予約時と同じ\nクレジットカードを使用します'),
    ).toBeVisible();
    logout();
});

test('座席変更の際は座席選択済みの状態であること', async ({
    page,
    commonLogin,
    createReservation,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);

    // ログイン～予約～座席変更シートマップ
    commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeSeatConfirmButton();
    await expect(page).toHaveURL('/selectSeat');
    //  確認事項
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    logout();
});

test('日時電車変更の際はクレカ入力欄が表示されないこと', async ({
    page,
    commonLogin,
    createReservation,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);

    // ログイン～予約～座席変更シートマップ
    commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeTrainConfirmButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('selectSeat');
    //  確認事項
    await expect(
        page.getByText('※初回予約時と同じ\nクレジットカードを使用します'),
    ).toBeVisible();
    logout();
});

test('日時電車変更で新しい電車を選ぶと座席未選択,同じ電車を選ぶと選択済みの状態であること', async ({
    page,
    commonLogin,
    createReservation,
    logout,
}) => {
    const reservationListPage = new ReservationListPage(page);
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    // ログイン～予約～座席変更シートマップ
    commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickThreeDotsButton();
    await reservationListPage.clickChangeButton();
    await reservationListPage.clickChangeTrainConfirmButton();
    await expect(page).toHaveURL('/scheduleSearch');
    //  確認事項
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('selectSeat');
    await expect(page.getByText('座席が選択されていません')).not.toBeVisible();
    await selectSeatPage.clickBackButton();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickSecondDetailButton();
    await expect(page).toHaveURL('selectSeat');
    await expect(page.getByText('座席が選択されていません')).toBeVisible();

    logout();
});
