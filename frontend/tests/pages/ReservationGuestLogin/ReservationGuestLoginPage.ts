import { expect, type Locator, type Page } from '@playwright/test';
import { Header } from '../shared/Header';

export class ReservationGuestLogin {
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
        await this.page.goto('/reservationGuestLogin');
    }

    async fillName(name: string) {
        await this.name.fill(name);
    }

    async fillMailAddress(mailAddress: string) {
        await this.mailAddress.fill(mailAddress);
    }
    async clickGuestLoginButton() {
        await this.guestLoginButton.click();
    }

    async inputGuestLoginInfo() {
        await this.fillName('田中太郎');
        await this.fillMailAddress('tanaka@taro.jp');
    }
}
