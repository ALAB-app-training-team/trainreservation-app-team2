import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservationGuestLoginPage {
    readonly page: Page;
    readonly header: Header;
    readonly name: Locator;
    readonly mailAddress: Locator;
    readonly guestLoginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.name = page.getByRole('textbox', { name: '予約者氏名' });
        this.mailAddress = page.getByRole('textbox', {
            name: 'メールアドレス',
        });
        this.guestLoginButton = page.getByRole('button', {
            name: '予約を検索',
        });
    }

    async goto() {
        await this.page.goto(
            '/reservationGuestLogin?reservationId=1c5289e8-72a7-4cb0-a0cb-fe6da57005eb',
        );
    }

    async fillName(name: string) {
        await this.name.fill(name);
    }

    async fillMailAddress(mailAddress: string) {
        await this.mailAddress.fill(mailAddress);
    }
    async clickReserverNameInput() {
        await this.name.click();
    }
    async clickReserverMailInput() {
        await this.mailAddress.click();
    }
    async clickGuestLoginButton() {
        await this.guestLoginButton.click();
    }

    async inputGuestLoginInfo() {
        await this.fillName('ゲスト太郎');
        await this.fillMailAddress('guest@test.com');
    }

    async inputCompanionLoginInfo() {
        await this.fillName('利用者太郎');
        await this.fillMailAddress('companion@test.com');
    }

    async inputNoReservationGuestLoginInfo() {
        await this.fillName('NoReservationGuest');
        await this.fillMailAddress('NoReservationGuest@test.jp');
    }

    async inputEmptyReserverName() {
        await this.fillName('');
    }

    async inputEmptyReserverMail() {
        await this.fillMailAddress('');
    }

    async inputInvalidReserverMail() {
        await this.fillMailAddress('aaa@あああ.co');
    }

    async gotoEmpty() {
        await this.page.goto('/reservationGuestLogin');
    }
}
