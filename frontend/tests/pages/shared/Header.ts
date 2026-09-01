import { type Locator, type Page } from '@playwright/test';

export class Header {
    readonly page: Page;
    readonly systemName: Locator;
    readonly scheduleSearchLink: Locator;
    readonly loginLink: Locator;
    readonly passwordUpdateForAdminButton: Locator;
    readonly reservationListButton: Locator;
    readonly accountUpdateButton: Locator;
    readonly passwordUpdateButton: Locator;
    readonly logoutButton: Locator;
    readonly userName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.systemName = page.getByRole('link', { name: '新幹線でGO！' });
        this.scheduleSearchLink = page.getByRole('link', {
            name: '新幹線を探す',
        });
        this.loginLink = page.getByRole('link', {
            name: 'ログイン',
        });
        this.passwordUpdateForAdminButton = page.getByRole('button', {
            name: 'ユーザー管理',
        });
        this.reservationListButton = page.getByRole('button', {
            name: '予約一覧',
        });
        this.accountUpdateButton = page.getByRole('button', {
            name: '氏名・メールアドレス変更',
        });
        this.passwordUpdateButton = page.getByRole('button', {
            name: 'パスワード変更',
        });
        this.logoutButton = page.getByRole('button', { name: 'ログアウト' });
        this.userName = page.getByTestId('user-name');
    }

    async goToSchduleSearchBySystemName() {
        await this.systemName.first().click();
    }

    async goToScheduleSearch() {
        await this.scheduleSearchLink.first().click();
    }

    async goToLogin() {
        await this.loginLink.first().click();
    }

    async goToPasswordUpdateForAdmin() {
        await this.passwordUpdateForAdminButton.first().click();
    }

    async goToReservationList() {
        await this.reservationListButton.first().click();
    }

    async goToAccountUpdate() {
        await this.accountUpdateButton.first().click();
    }

    async goToPasswordUpdate() {
        await this.passwordUpdateButton.first().click();
    }

    async goToLogout() {
        await this.logoutButton.first().click();
    }

    async clickUserName() {
        await this.userName.first().click();
    }
}
