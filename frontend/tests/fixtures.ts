import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { Header } from '@tests/pages/shared/Header';

type CreateGuestReservation = () => Promise<void>;
type CreateReservation = () => Promise<void>;
type GuestLogin = () => Promise<void>;
type Login = () => Promise<void>;
type Logout = () => Promise<void>;
type Fixture = {
    createGuestReservation: CreateGuestReservation;
    createReservation: CreateReservation;
    guestLogin: GuestLogin;
    login: Login;
    logout: Logout;
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
            await selectSeatPage.inputResererInfo();
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
    login: async (
        { page }: { page: Page },
        use: (fn: Login) => Promise<void>,
    ) => {
        const login = async () => {
            const login = new LoginPage(page);

            await login.goto();
            await login.inputLoginInfo();
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

            await header.clickCommonUser();
            await header.goToLogout();
        };
        await use(logout);
    },
});
