import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';

test('予約データが存在しない場合', async ({ page }) => {
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    reservationGuestLogin.goto();
    await expect(page).toHaveURL(
        '/reservationGuestLogin/reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
    );
    await reservationGuestLogin.inputNoReservationGuestLoginInfo();
    await reservationGuestLogin.clickGuestLoginButton();
    await expect(page.getByText('予約情報が見つかりません')).toBeVisible();
});

test('予約者氏名の未入力', async ({ page }) => {
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    reservationGuestLogin.goto();
    await expect(page).toHaveURL(
        '/reservationGuestLogin/reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
    );
    await reservationGuestLogin.inputEmptyReserverName();
    await reservationGuestLogin.clickReserverMailInput();
    await expect(page.getByText('予約者氏名を入力してください')).toBeVisible();
});

test('メールアドレスの未入力', async ({ page }) => {
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    reservationGuestLogin.goto();
    await expect(page).toHaveURL(
        '/reservationGuestLogin/reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
    );
    await reservationGuestLogin.inputEmptyReserverMail();
    await reservationGuestLogin.clickReserverNameInput();
    await expect(
        page.getByText('メールアドレスを入力してください', { exact: true }),
    ).toBeVisible();
});

test('メールアドレスのバリデーションエラー', async ({ page }) => {
    const reservationGuestLogin = new ReservationGuestLoginPage(page);
    reservationGuestLogin.goto();
    await expect(page).toHaveURL(
        '/reservationGuestLogin/reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
    );
    await reservationGuestLogin.inputInvalidReserverMail();
    await reservationGuestLogin.clickReserverNameInput();
    await expect(
        page.getByText('メールアドレスの形式（~~@~~.~~）で入力してください'),
    ).toBeVisible();
});
