import { type Locator, type Page } from '@playwright/test';

export class Header {
    readonly page: Page;
    readonly systemName: Locator;
    readonly scheduleSearchLink: Locator;
    readonly reservationLoginLink: Locator;
    readonly loginLink: Locator;
    readonly logoutButton: Locator;
    readonly commonUser: Locator;

    constructor(page: Page) {
        this.page = page;
        this.systemName = page.getByRole('link', { name: '新幹線でGO！' });
        this.scheduleSearchLink = page.getByRole('link', {
            name: '新幹線を探す',
        });
        this.reservationLoginLink = page.getByRole('link', {
            name: '予約確認',
        });
        this.loginLink = page.getByRole('link', {
            name: 'ログイン',
        });
        this.logoutButton = page.getByRole('button', { name: 'ログアウト' });
        this.commonUser = page.getByRole('button', { name: '一般太郎さん' });
    }

    async goToSchduleSearchBySystemName() {
        await this.systemName.first().click();
    }

    async goToScheduleSearch() {
        await this.scheduleSearchLink.first().click();
    }

    async goToReservationLogin() {
        await this.reservationLoginLink.first().click();
    }

    async goToLogin() {
        await this.loginLink.first().click();
    }

    async goToLogout() {
        await this.logoutButton.first().click();
    }

    async clickCommonUser() {
        await this.commonUser.first().click();
    }
}
