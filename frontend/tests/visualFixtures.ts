import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { test as baseTest } from '@tests/fixtures';
import type { Fixture as BaseFixture } from '@tests/fixtures';
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
export type VisualFixture = {
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

const screenshotOptions = {
    maxDiffPixelRatio: 0.05,
    animations: 'disabled',
    maskColor: '#ffffff',
} as const;

export const test = baseTest.extend<VisualFixture>({
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
                ...screenshotOptions,
                fullPage: false,
                mask: maskTargets,
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
                ...screenshotOptions,
                fullPage: true,
                mask: [],
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
                ...screenshotOptions,
                fullPage: true,
                mask: [],
            });
        };
        await use(visual);
    },
    visualSelectSeatAccount: async (
        {
            page,
            commonLogin,
            logout,
        }: { page: Page } & Pick<BaseFixture, 'commonLogin' | 'logout'>,
        use: (fn: VisualSelectSeatAccount) => Promise<void>,
    ) => {
        const visual = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await commonLogin();
            await expect(page).toHaveURL('/scheduleSearch');
            await scheduleSearchPage.clickDetailButton();
            await expect(page).toHaveURL('/selectSeat');
            await selectSeatPage.emptySeat
                .first()
                .waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                ...screenshotOptions,
                fullPage: true,
                mask: [],
            });

            await logout();
            await expect(page).toHaveURL('/login');
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
                ...screenshotOptions,
                fullPage: true,
                mask: [],
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
                ...screenshotOptions,
                fullPage: true,
                mask: [],
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
                ...screenshotOptions,
                fullPage: true,
                mask: [],
            });
        };
        await use(visual);
    },
    visualAccountUpdate: async (
        {
            page,
            commonLogin,
            logout,
        }: { page: Page } & Pick<BaseFixture, 'commonLogin' | 'logout'>,
        use: (fn: VisualAccountUpdate) => Promise<void>,
    ) => {
        const visual = async () => {
            const accountUpdatePage = new AccountUpdatePage(page);

            await commonLogin();
            await expect(page).toHaveURL('/scheduleSearch');
            await accountUpdatePage.goto();
            await expect(page).toHaveURL('/accountUpdate');
            await accountUpdatePage.updateButton.waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                ...screenshotOptions,
                fullPage: true,
                mask: [],
            });

            await logout();
            await expect(page).toHaveURL('/login');
        };
        await use(visual);
    },
    visualPasswordUpdate: async (
        {
            page,
            commonLogin,
            logout,
        }: { page: Page } & Pick<BaseFixture, 'commonLogin' | 'logout'>,
        use: (fn: VisualPasswordUpdate) => Promise<void>,
    ) => {
        const visual = async () => {
            const passwordUpdatePage = new PasswordUpdatePage(page);

            await commonLogin();
            await expect(page).toHaveURL('/scheduleSearch');
            await passwordUpdatePage.goto();
            await expect(page).toHaveURL('/passwordUpdate');
            await passwordUpdatePage.updateButton.waitFor({ state: 'visible' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                ...screenshotOptions,
                fullPage: true,
                mask: [],
            });

            await logout();
            await expect(page).toHaveURL('/login');
        };
        await use(visual);
    },
    visualPasswordUpdateForAdmin: async (
        {
            page,
            adminLogin,
            logout,
        }: { page: Page } & Pick<BaseFixture, 'adminLogin' | 'logout'>,
        use: (fn: VisualPasswordUpdateForAdmin) => Promise<void>,
    ) => {
        const visual = async () => {
            const passwordUpdateForAdmin = new PasswordUpdateForAdminPage(page);

            await adminLogin();
            await expect(page).toHaveURL('/admin/password');
            await passwordUpdateForAdmin.updateButton.waitFor({
                state: 'visible',
            });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                ...screenshotOptions,
                fullPage: true,
                mask: [],
            });

            await logout();
            await expect(page).toHaveURL('/login');
        };
        await use(visual);
    },
    visualReservationList: async (
        {
            page,
            commonLogin,
            createReservation,
            logout,
        }: { page: Page } & Pick<
            BaseFixture,
            'commonLogin' | 'createReservation' | 'logout'
        >,
        use: (fn: VisualReservationList) => Promise<void>,
    ) => {
        const visual = async () => {
            const reservationListPage = new ReservationListPage(page);

            await commonLogin();
            await expect(page).toHaveURL('/scheduleSearch');
            await createReservation();
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
                ...screenshotOptions,
                fullPage: false,
                mask: maskTargets,
            });

            await logout();
            await expect(page).toHaveURL('/login');
        };
        await use(visual);
    },
    visualReservedTicket: async (
        {
            page,
            commonLogin,
            createReservation,
            logout,
        }: { page: Page } & Pick<
            BaseFixture,
            'commonLogin' | 'createReservation' | 'logout'
        >,
        use: (fn: VisualReservedTicket) => Promise<void>,
    ) => {
        const visual = async () => {
            const reservedTicketPage = new ReservedTicketPage(page);

            await commonLogin();
            await expect(page).toHaveURL('/scheduleSearch');
            await createReservation();
            await expect(page).toHaveURL('/reservedTicket');
            await reservedTicketPage.changeButton.waitFor({ state: 'visible' });
            await page
                .getByText(
                    '「チケットを共有」ボタンからリンクの保存をお願いします',
                )
                .waitFor({ state: 'hidden' });
            await page.evaluate(() => document.fonts.ready);

            await expect(page).toHaveScreenshot({
                ...screenshotOptions,
                fullPage: true,
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
            });

            await logout();
            await expect(page).toHaveURL('/login');
        };
        await use(visual);
    },
});
