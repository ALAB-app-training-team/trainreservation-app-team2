import { type Locator, type Page } from '@playwright/test';

import { Header } from '@tests/pages/shared/Header';

export class AccountUpdatePage {
    readonly page: Page;

    readonly header: Header;

    readonly name: Locator;

    readonly mailAddress: Locator;

    readonly password: Locator;

    readonly updateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.name = page.getByRole('textbox', { name: '氏名' });
        this.mailAddress = page.getByRole('textbox', {
            name: 'メールアドレス',
        });
        this.password = page.getByRole('textbox', {
            name: 'パスワード',
            exact: true,
        });
        this.updateButton = page.getByRole('button', {
            name: '変更',
        });
    }

    async goto() {
        await this.page.goto('/accountUpdate');
    }

    async fillName(name: string) {
        await this.name.fill(name);
    }

    async fillMailAddress(address: string) {
        await this.mailAddress.fill(address);
    }

    async fillPassword(password: string) {
        await this.password.fill(password);
    }

    async clickUpdateButton() {
        await this.updateButton.click();
    }
}
