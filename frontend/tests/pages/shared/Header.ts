import { type Locator, type Page } from '@playwright/test';

export class Header {
    readonly page: Page;
    readonly systemName: Locator;
    readonly scheduleSearchLink: Locator;
    readonly reservationListLink: Locator;
    readonly loginLink: Locator;
    readonly logoutButton: Locator;
    readonly commonUser: Locator;

    constructor(page: Page) {
        this.page = page;
        this.systemName = page.getByRole('link', { name: '新幹線でGO！' });
        this.scheduleSearchLink = page.getByRole('link', {
            name: '新幹線を探す',
        });
        this.reservationListLink = page.getByRole('link', {
            name: '予約確認',
        });
        this.loginLink = page.getByRole('link', {
            name: 'ログイン',
        });
        this.logoutButton = page.getByRole('button', { name: 'ログアウト' });
        this.commonUser = page.getByTestId('user-name');
    }

    async goToSchduleSearchBySystemName() {
        await this.systemName.first().click();
    }

    async goToScheduleSearch() {
        await this.scheduleSearchLink.first().click();
    }

    async goToReservationList() {
        await this.reservationListLink.first().click();
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
