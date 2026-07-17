import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import { SelectSeatPage } from '@tests/pages/SelectSeat/SelectSeatPage';

type CreateReservation = () => Promise<void>;
type Fixture = {
    createReservation: CreateReservation;
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
});
