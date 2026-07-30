import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { LoginPage } from './pages/Login/LoginPage';

type CreateReservation = () => Promise<void>;
type GuestLogin = () => Promise<void>;
type Login = () => Promise<void>;
type Fixture = {
    createReservation: CreateReservation;
    guestLogin: GuestLogin;
    login: Login;
};

export const test = base.extend<Fixture>({
    createReservation: async (
        { page }: { page: Page },
        use: (fn: CreateReservation) => Promise<void>,
    ) => {
        const create = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await selectSeatPage.clickBackButton();
            await scheduleSearchPage.clickDetailButton();
            await selectSeatPage.selectSeat();
            await selectSeatPage.inputResererInfo();
            await selectSeatPage.inputCardInfo();
            await selectSeatPage.clickReseveButton();
            await selectSeatPage.clickCancelButton();
            await selectSeatPage.clickReseveButton();
            await selectSeatPage.clickConfirmButton();
        };
        await use(create);
    },
    guestLogin: async (
        { page }: { page: Page },
        use: (fn: CreateReservation) => Promise<void>,
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
        use: (fn: CreateReservation) => Promise<void>,
    ) => {
        const login = async () => {
            const login = new LoginPage(page);

            await login.goto();
            await login.inputLoginInfo();
            await login.clickLoginButton();
        };
        await use(login);
    },
});
