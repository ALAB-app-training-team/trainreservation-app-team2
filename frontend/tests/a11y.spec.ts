import AxeBuilder from '@axe-core/playwright';
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

test('a11y-scheduleSearch', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.detailButton.first().waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});

test('a11y-selectSeat-guest', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.emptySeat.first().waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});

test('a11y-selectSeat-accountCreate', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await scheduleSearchPage.goto();
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.emptySeat.first().waitFor({ state: 'visible' });
    await selectSeatPage.clickAccountCreateCheckBox();

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});

test('a11y-selectSeat-account', async ({ page, commonLogin, logout }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    const selectSeatPage = new SelectSeatPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.clickDetailButton();
    await expect(page).toHaveURL('/selectSeat');
    await selectSeatPage.emptySeat.first().waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await logout();
    await expect(page).toHaveURL('/login');
});

test('a11y-reservationGuestLogin', async ({ page }) => {
    const reservationGuestLoginPage = new ReservationGuestLoginPage(page);

    await reservationGuestLoginPage.goto();
    await expect(page).toHaveURL(
        '/reservationGuestLogin?reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
    );
    await reservationGuestLoginPage.name.waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});

test('a11y-login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.loginButton.waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});

test('a11y-accountCreate', async ({ page }) => {
    const accountCreatePage = new AccountCreatePage(page);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await expect(page).toHaveURL('/login');
    await loginPage.clickCreateButton();
    await expect(page).toHaveURL('/accountCreate');
    await accountCreatePage.createButton.waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
});

test('a11y-accountUpdate', async ({ page, commonLogin, logout }) => {
    const accountUpdatePage = new AccountUpdatePage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await accountUpdatePage.goto();
    await expect(page).toHaveURL('/accountUpdate');
    await accountUpdatePage.updateButton.waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await logout();
    await expect(page).toHaveURL('/login');
});

test('a11y-passwordUpdate', async ({ page, commonLogin, logout }) => {
    const passwordUpdatePage = new PasswordUpdatePage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await passwordUpdatePage.goto();
    await expect(page).toHaveURL('/passwordUpdate');
    await passwordUpdatePage.updateButton.waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await logout();
    await expect(page).toHaveURL('/login');
});

test('a11y-passwordUpdateForAdmin', async ({ page, adminLogin, logout }) => {
    const passwordUpdateForAdmin = new PasswordUpdateForAdminPage(page);
    await adminLogin();
    await expect(page).toHaveURL('/admin/password');
    await passwordUpdateForAdmin.updateButton.waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await logout();
    await expect(page).toHaveURL('/login');
});

test('a11y-reservationList', async ({ page, commonLogin, logout }) => {
    const reservationListPage = new ReservationListPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await reservationListPage.goto();
    await expect(page).toHaveURL('/reservationList');
    await reservationListPage.ticketButton
        .first()
        .waitFor({ state: 'visible' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await logout();
    await expect(page).toHaveURL('/login');
});

test('a11y-reservedTicket', async ({
    page,
    commonLogin,
    logout,
    createReservation,
}) => {
    const reservedTicketPage = new ReservedTicketPage(page);

    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await expect(page).toHaveURL('/reservedTicket');
    await reservedTicketPage.changeButton.waitFor({ state: 'visible' });
    await page
        .getByText('「チケットを共有」ボタンからリンクの保存をお願いします')
        .waitFor({ state: 'hidden' });

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await logout();
    await expect(page).toHaveURL('/login');
});
