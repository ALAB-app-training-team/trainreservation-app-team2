import { type Locator, type Page } from '@playwright/test';

export class Header {
    readonly page: Page;
    readonly systemName: Locator;
    readonly scheduleSearchLink: Locator;
    readonly reservationGuestLoginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.systemName = page.getByRole('link', { name: '新幹線でGO！' });
        this.scheduleSearchLink = page.getByRole('link', {
            name: '新幹線を探す',
        });
        this.reservationGuestLoginLink = page.getByRole('link', {
            name: '予約確認',
        });
    }

    async goToSchduleSearchBySystemName() {
        await this.systemName.first().click();
    }

    async gotoScheduleSearch() {
        await this.scheduleSearchLink.first().click();
    }
    async gotoReservationGuestLogin() {
        await this.reservationGuestLoginLink.first().click();
    }
}
