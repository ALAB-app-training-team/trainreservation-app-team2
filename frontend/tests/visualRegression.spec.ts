import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { AccountCreatePage } from '@tests/pages/AccountCreate/AccountCreatePage';
import { AccountUpdatePage } from '@tests/pages/AccountUpdate/AccountUpdatePage';
import { PasswordUpdatePage } from '@tests/pages/PasswordUpdate/PasswordUpdatePage';
import { PasswordUpdateForAdminPage } from '@tests/pages/PasswordUpdateForAdmin/PasswordUpdateForAdminPage';

test('visual-scheduleSearch', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.detailButton.first().waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    const scheduleItems = page.getByTestId('schedule');
    const itemCount = await scheduleItems.count();

    const maskTargets = [];
    for (let i = 1; i < itemCount; i++) {
        maskTargets.push(scheduleItems.nth(i));
    }
    maskTargets.push(page.getByTestId('schedule-departure-time').first());
    maskTargets.push(page.getByTestId('schedule-arrival-time').first());
    maskTargets.push(page.getByTestId('schedule-train').first());

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: false,
        animations: 'disabled',
        mask: maskTargets,
        maskColor: '#ffffff',
    });
});

test('visual-selectSeat-guest', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.emptySeat.first().waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#ffffff',
    });
});

test('visual-selectSeat-accountCreate', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.emptySeat.first().waitFor({ state: 'visible' });
    await selectSeatPage.clickAccountCreateCheckBox();
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#ffffff',
    });
});

test('visual-selectSeat-account', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);
    const loginPage = new LoginPage(page);

    await scheduleSearchPage.goto();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.clickLoginButton();
    await expect(page).toHaveURL('/login');
    await loginPage.fillMailAddress('test-common@test.com');
    await loginPage.fillPassword('Password1');
    await loginPage.clickLoginButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.emptySeat.first().waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#ffffff',
    });
});

test('visual-reservationGuestLogin', async ({ page }) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
    await reservationGuestLoginPage.goto();
    await expect(page).toHaveURL(
        '/reservationGuestLogin?reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
    );
    await reservationGuestLoginPage.name.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#ffffff',
    });
});

test('visual-login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.loginButton.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
        ],
        maskColor: '#ffffff',
    });
});

test('visual-accountCreate', async ({ page }) => {
    const accountCreatePage = new AccountCreatePage(page);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.createButton.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
        ],
        maskColor: '#ffffff',
    });
});

test('visual-accountUpdate', async ({ page, commonLogin }) => {
    const accountUpdatePage = new AccountUpdatePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillMailAddress('test-common@test.com');
    await loginPage.fillPassword('Password1');
    await loginPage.clickLoginButton();
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.updateButton.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
        ],
        maskColor: '#ffffff',
    });
});

test('visual-passwordUpdate', async ({ page, commonLogin }) => {
    const passwordUpdatePage = new PasswordUpdatePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.fillMailAddress('test-common@test.com');
    await loginPage.fillPassword('Password1');
    await loginPage.clickLoginButton();
    await passwordUpdatePage.goto();
    await expect(page).toHaveURL('/passwordUpdate');
    await passwordUpdatePage.updateButton.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
        ],
        maskColor: '#ffffff',
    });
});

test('visual-passwordUpdateForAdmin', async ({ page, adminLogin }) => {
    const passwordUpdateForAdmin = new PasswordUpdateForAdminPage(page);
    await adminLogin();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdmin.updateButton.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
        ],
        maskColor: '#ffffff',
    });
});

test('visual-reservationList', async ({ page, commonLogin, logout }) => {
    const reservationListPage = new ReservationListPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.ticketButton
        .first()
        .waitFor({ state: 'visible' });
    const listItems = page.locator(
        '.border-primary-light.flex.flex-col.gap-2.rounded-2xl.border-2.p-8',
    );
    const itemCount = await listItems.count();

    const maskTargets = [];
    for (let i = 1; i < itemCount; i++) {
        maskTargets.push(listItems.nth(i));
    }
    maskTargets.push(page.locator('.text-xl.font-bold').nth(1));
    maskTargets.push(page.locator('.text-xl.font-bold').nth(2));
    maskTargets.push(
        page
            .locator(
                '.flex.items-center.gap-1.rounded-lg.px-2.border-primary.border',
            )
            .nth(0),
    );
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: false,
        animations: 'disabled',
        mask: maskTargets,
        maskColor: '#ffffff',
    });
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-reservedTicket', async ({ page, commonLogin, logout }) => {
    const reservationListPage = new ReservationListPage(page);
    const reservedTicketPage = new ReservedTicketPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.clickTicketButton();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.backButton.waitFor({ state: 'visible' });
    await page.evaluate(() => document.fonts.ready);

    await expect(page).toHaveScreenshot({
        maxDiffPixelRatio: 0.05,
        fullPage: true,
        animations: 'disabled',
        mask: [
            // テストに含めたくない要素をマスク(無視)する
            // 例 page.locator('.hoge'),
            page.locator('path').nth(4),
            page.locator('.mb-4.text-sm').nth(0),
            page.locator('.text-2xl.font-bold').nth(0),
            page.locator('.text-2xl.font-bold').nth(1),
            page.locator('.flex.items-center.gap-2.text-xl.font-bold').nth(0),
            page
                .locator(
                    '.flex.items-center.gap-1.rounded-lg.px-2.border-primary-light.text-primary.bg-green-100.border-2',
                )
                .nth(0),
        ],
        maskColor: '#ffffff',
    });
    await logout();
    await expect(page).toHaveURL('/login');
});
