import { test as base, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { AccountCreatePage } from '@tests/pages/AccountCreate/AccountCreatePage';
import { AccountUpdatePage } from '@tests/pages/AccountUpdate/AccountUpdatePage';
import { PasswordUpdatePage } from '@tests/pages/PasswordUpdate/PasswordUpdatePage';
import { PasswordUpdateForAdminPage } from '@tests/pages/PasswordUpdateForAdmin/PasswordUpdateForAdminPage';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';
import { ReservedTicketPage } from '@tests/pages/ReservedTicket/ReservedTicketPage';
import { Header } from '@tests/pages/shared/Header';

type CreateGuestReservation = () => Promise<void>;
type CreateReservation = () => Promise<void>;
type GuestLogin = () => Promise<void>;
type commonLogin = () => Promise<void>;
type adminLogin = () => Promise<void>;
type Logout = () => Promise<void>;
type VisualScheduleSearch = () => Promise<void>;
type VisualSelectSeatGuest = () => Promise<void>;
type VisualSelectSeatAccountCreate = () => Promise<void>;
type VisualSelectSeatAccount = () => Promise<void>;
type VisualReservationGuestLogin = () => Promise<void>;
type VisualLogin = () => Promise<void>;
type VisualAccountCreate = () => Promise<void>;
type VisualAccountUpdate = () => Promise<void>;
type VisualPasswordUpdate = () => Promise<void>;
type VisualPasswordUpdateForAdmin = () => Promise<void>;
type VisualReservationList = () => Promise<void>;
type VisualReservedTicket = () => Promise<void>;
type Fixture = {
    createGuestReservation: CreateGuestReservation;
    createReservation: CreateReservation;
    guestLogin: GuestLogin;
    commonLogin: commonLogin;
    adminLogin: adminLogin;
    logout: Logout;
    visualScheduleSearch: VisualScheduleSearch;
    visualSelectSeatGuest: VisualSelectSeatGuest;
    visualSelectSeatAccountCreate: VisualSelectSeatAccountCreate;
    visualSelectSeatAccount: VisualSelectSeatAccount;
    visualReservationGuestLogin: VisualReservationGuestLogin;
    visualLogin: VisualLogin;
    visualAccountCreate: VisualAccountCreate;
    visualAccountUpdate: VisualAccountUpdate;
    visualPasswordUpdate: VisualPasswordUpdate;
    visualPasswordUpdateForAdmin: VisualPasswordUpdateForAdmin;
    visualReservationList: VisualReservationList;
    visualReservedTicket: VisualReservedTicket;
};

export const test = base.extend<Fixture>({
    createGuestReservation: async (
        { page }: { page: Page },
        use: (fn: CreateGuestReservation) => Promise<void>,
    ) => {
        const create = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await selectSeatPage.selectSeat();
            await selectSeatPage.inputGuestReserverInfo();
            await selectSeatPage.inputCardInfo();
            await selectSeatPage.clickReseveButton();
            await selectSeatPage.clickReserveConfirmButton();
        };
        await use(create);
    },
    createReservation: async (
        { page }: { page: Page },
        use: (fn: CreateReservation) => Promise<void>,
    ) => {
        const create = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await selectSeatPage.selectSeat();
            await selectSeatPage.inputCardInfo();
            await selectSeatPage.clickReseveButton();
            await selectSeatPage.clickReserveConfirmButton();
        };
        await use(create);
    },
    guestLogin: async (
        { page }: { page: Page },
        use: (fn: GuestLogin) => Promise<void>,
    ) => {
        const login = async () => {
            const reservationGuestLogin = new ReservationGuestLoginPage(page);

            await reservationGuestLogin.goto();
            await reservationGuestLogin.inputGuestLoginInfo();
            await reservationGuestLogin.clickGuestLoginButton();
        };
        await use(login);
    },
    commonLogin: async (
        { page }: { page: Page },
        use: (fn: commonLogin) => Promise<void>,
    ) => {
        const login = async () => {
            const login = new LoginPage(page);

            await login.goto();
            await login.inputCommonLoginInfo();
            await login.clickLoginButton();
        };
        await use(login);
    },
    adminLogin: async (
        { page }: { page: Page },
        use: (fn: commonLogin) => Promise<void>,
    ) => {
        const login = async () => {
            const login = new LoginPage(page);

            await login.goto();
            await login.inputAdminLoginInfo();
            await login.clickLoginButton();
        };
        await use(login);
    },
    logout: async (
        { page }: { page: Page },
        use: (fn: Logout) => Promise<void>,
    ) => {
        const logout = async () => {
            const header = new Header(page);

            await header.clickUserName();
            await header.goToLogout();
            await expect(page).toHaveURL('login');
        };
        await use(logout);
    },
    visualScheduleSearch: async (
        { page }: { page: Page },
        use: (fn: VisualScheduleSearch) => Promise<void>,
    ) => {
        const visual = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);

            await scheduleSearchPage.goto();
            await expect(page).toHaveURL('/scheduleSearch');
            await scheduleSearchPage.detailButton
                .first()
                .waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            const scheduleItems = page.getByTestId('schedule');
            const itemCount = await scheduleItems.count();

            const maskTargets = [];
            for (let i = 1; i < itemCount; i++) {
                maskTargets.push(scheduleItems.nth(i));
            }
            maskTargets.push(
                page.getByTestId('schedule-departure-time').first(),
            );
            maskTargets.push(page.getByTestId('schedule-arrival-time').first());
            maskTargets.push(page.getByTestId('schedule-train').first());

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: false,
                animations: 'disabled',
                mask: maskTargets,
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualSelectSeatGuest: async (
        { page }: { page: Page },
        use: (fn: VisualSelectSeatGuest) => Promise<void>,
    ) => {
        const visual = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await expect(page).toHaveURL('/selectSeat');
            await selectSeatPage.emptySeat
                .first()
                .waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualSelectSeatAccountCreate: async (
        { page }: { page: Page },
        use: (fn: VisualSelectSeatAccountCreate) => Promise<void>,
    ) => {
        const visual = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await expect(page).toHaveURL('/selectSeat');
            await selectSeatPage.emptySeat
                .first()
                .waitFor({ state: 'visible' });
            await selectSeatPage.clickAccountCreateCheckBox();
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualSelectSeatAccount: async (
        { page }: { page: Page },
        use: (fn: VisualSelectSeatAccount) => Promise<void>,
    ) => {
        const visual = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await expect(page).toHaveURL('/scheduleSearch');
            await scheduleSearchPage.clickDetailButton();
            await expect(page).toHaveURL('/selectSeat');
            await selectSeatPage.emptySeat
                .first()
                .waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualReservationGuestLogin: async (
        { page }: { page: Page },
        use: (fn: VisualReservationGuestLogin) => Promise<void>,
    ) => {
        const visual = async () => {
            const reservationGuestLoginPage = new ReservationGuestLoginPage(
                page,
            );

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
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualLogin: async (
        { page }: { page: Page },
        use: (fn: VisualLogin) => Promise<void>,
    ) => {
        const visual = async () => {
            const loginPage = new LoginPage(page);

            await loginPage.goto();
            await expect(page).toHaveURL('/login');
            await loginPage.loginButton.waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualAccountCreate: async (
        { page }: { page: Page },
        use: (fn: VisualAccountCreate) => Promise<void>,
    ) => {
        const visual = async () => {
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
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualAccountUpdate: async (
        { page }: { page: Page },
        use: (fn: VisualAccountUpdate) => Promise<void>,
    ) => {
        const visual = async () => {
            const accountUpdatePage = new AccountUpdatePage(page);

            await expect(page).toHaveURL('/scheduleSearch');
            await accountUpdatePage.goto();
            await expect(page).toHaveURL('/accountUpdate');
            await accountUpdatePage.updateButton.waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualPasswordUpdate: async (
        { page }: { page: Page },
        use: (fn: VisualPasswordUpdate) => Promise<void>,
    ) => {
        const visual = async () => {
            const passwordUpdatePage = new PasswordUpdatePage(page);

            await expect(page).toHaveURL('/scheduleSearch');
            await passwordUpdatePage.goto();
            await expect(page).toHaveURL('/passwordUpdate');
            await passwordUpdatePage.updateButton.waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualPasswordUpdateForAdmin: async (
        { page }: { page: Page },
        use: (fn: VisualPasswordUpdateForAdmin) => Promise<void>,
    ) => {
        const visual = async () => {
            const passwordUpdateForAdmin = new PasswordUpdateForAdminPage(page);

            await expect(page).toHaveURL('/admin/password');
            await passwordUpdateForAdmin.updateButton.waitFor({
                state: 'visible',
            });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
    visualReservationList: async (
        { page }: { page: Page },
        use: (fn: VisualReservationList) => Promise<void>,
    ) => {
        const visual = async () => {
            const reservationListPage = new ReservationListPage(page);

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
        };
        await use(visual);
    },
    visualReservedTicket: async (
        { page }: { page: Page },
        use: (fn: VisualReservedTicket) => Promise<void>,
    ) => {
        const visual = async () => {
            const reservedTicketPage = new ReservedTicketPage(page);
            await expect(page).toHaveURL('/reservedTicket');
            await reservedTicketPage.changeButton.waitFor({ state: 'visible' });
            await page
                .getByText(
                    '「チケットを共有」ボタンからリンクの保存をお願いします',
                )
                .waitFor({ state: 'hidden' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                maxDiffPixelRatio: 0.05,
                fullPage: true,
                animations: 'disabled',
                mask: [
                    page.locator('path').nth(4),
                    page.locator('.mb-4.text-sm').nth(0),
                    page.locator('.text-2xl.font-bold').nth(0),
                    page.locator('.text-2xl.font-bold').nth(1),
                    page
                        .locator('.flex.items-center.gap-2.text-xl.font-bold')
                        .nth(0),
                    page
                        .locator(
                            '.flex.items-center.gap-1.rounded-lg.px-2.border-primary-light.text-primary.bg-green-100.border-2',
                        )
                        .nth(0),
                ],
                maskColor: '#ffffff',
            });
        };
        await use(visual);
    },
});
