import { test as base, expect } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';
import { ReservationGuestLoginPage } from '@tests/pages/ReservationGuestLogin/ReservationGuestLoginPage';
import { LoginPage } from '@tests/pages/Login/LoginPage';
import { Header } from '@tests/pages/shared/Header';
import { execute, selectRows } from '@tests/db';

type CreateGuestReservation = () => Promise<void>;
type CreateReservation = () => Promise<void>;
type CreatePastReservation = () => Promise<void>;
type GuestLogin = () => Promise<void>;
type commonLogin = () => Promise<void>;
type adminLogin = () => Promise<void>;
type Logout = () => Promise<void>;
export type Fixture = {
    createGuestReservation: CreateGuestReservation;
    createReservation: CreateReservation;
    createPastReservation: CreatePastReservation;
    guestLogin: GuestLogin;
    commonLogin: commonLogin;
    adminLogin: adminLogin;
    logout: Logout;
};
type PastReservationInfo = {
    reservationId: string;
    departureStationName: string;
    arrivalStationName: string;
    departureTime: string;
    arrivalTime: string;
    rideDate: string;
};

export const iPhoneSEProjectName = 'Mobile Safari (iPhone SE)';

const apiBaseUrl = process.env.TEST_API_BASE_URL ?? 'http://localhost:8080';
const reserveTimeout = 30 * 1000;

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
        testInfo: TestInfo,
    ) => {
        const create = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await selectSeatPage.selectSeat();
            if (testInfo.project.name === iPhoneSEProjectName) {
                await selectSeatPage.clickReservationSheetButton();
            }
            await selectSeatPage.inputCardInfo();
            await selectSeatPage.clickReseveButton();
            await selectSeatPage.clickReserveConfirmButton();
        };
        await use(create);
    },
    createPastReservation: async (
        { page }: { page: Page },
        use: (fn: CreatePastReservation) => Promise<void>,
        testInfo: TestInfo,
    ) => {
        const createdIds: string[] = [];
        const create = async () => {
            const scheduleSearchPage = new ScheduleSearchPage(page);
            const selectSeatPage = new SelectSeatPage(page);
            const beforeIds = await fetchReservationIds(page);

            await scheduleSearchPage.goto();
            await scheduleSearchPage.clickDetailButton();
            await selectSeatPage.selectSeat();
            if (testInfo.project.name === iPhoneSEProjectName) {
                await selectSeatPage.clickReservationSheetButton();
            }
            await selectSeatPage.inputCardInfo();
            await selectSeatPage.clickReseveButton();
            await selectSeatPage.clickReserveConfirmButton();
            await expect(page).toHaveURL('/reservedTicket', {
                timeout: reserveTimeout,
            });

            const created = (await fetchReservations(page)).find(
                (reservation) => !beforeIds.has(reservation.reservationId),
            );
            if (!created) {
                throw new Error('作成した予約を特定できませんでした');
            }

            // DBを直接操作して作成した予約の乗車日を過去日付に更新する
            await updateRideDateToPast(created.reservationId);
            createdIds.push(created.reservationId);
        };
        await use(create);

        // 他のテストへ影響しないようにするため、作成した過去予約を削除
        for (const reservationId of createdIds) {
            await deleteReservation(reservationId);
        }
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
});

/** ログイン中のアカウントの予約一覧をAPIから取得する */
async function fetchReservations(page: Page): Promise<PastReservationInfo[]> {
    const response = await page.request.get(`${apiBaseUrl}/api/reservations`);
    expect(response.ok()).toBeTruthy();
    return (await response.json()) as PastReservationInfo[];
}

/** ログイン中のアカウントの予約IDの集合をAPIから取得する */
async function fetchReservationIds(page: Page): Promise<Set<string>> {
    const reservations = await fetchReservations(page);
    return new Set(reservations.map((r) => r.reservationId));
}

/** 指定した予約の乗車日を昨日に更新し、更新後の乗車日を返す */
async function updateRideDateToPast(reservationId: string): Promise<string> {
    const rows = await selectRows<{ ride_date: string }>(
        `UPDATE T_Reservation
            SET ride_date = CURRENT_DATE - INTERVAL '1 day'
          WHERE id = $1
      RETURNING to_char(ride_date, 'YYYY-MM-DD') AS ride_date`,
        [reservationId],
    );
    if (rows.length !== 1) {
        throw new Error(`予約の乗車日を更新できませんでした: ${reservationId}`);
    }
    return rows[0].ride_date;
}

/** 指定した予約を削除する */
async function deleteReservation(reservationId: string): Promise<void> {
    await execute('DELETE FROM T_Reservation WHERE id = $1', [reservationId]);
}
