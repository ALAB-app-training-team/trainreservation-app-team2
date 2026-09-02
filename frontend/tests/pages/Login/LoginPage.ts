import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class LoginPage {
    readonly page: Page;
    readonly header: Header;
    readonly mailAddress: Locator;
    readonly password: Locator;
    readonly loginButton: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.mailAddress = page.getByRole('textbox', {
            name: 'メールアドレス',
        });
        this.password = page.getByRole('textbox', { name: 'パスワード' });
        this.loginButton = page.getByRole('button', {
            name: 'ログイン',
            exact: true,
        });
        this.createButton = page.getByRole('button', { name: '新規登録' });
    }

    async goto() {
        await this.page.goto('/login');
    }

    async fillMailAddress(address: string) {
        await this.mailAddress.fill(address);
    }

    async fillPassword(password: string) {
        await this.password.fill(password);
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async clickCreateButton() {
        await this.createButton.click();
    }

    async inputCommonLoginInfo() {
        await this.fillMailAddress('test-common@test.com');
        await this.fillPassword('Password1');
    }

    async inputAdminLoginInfo() {
        await this.fillMailAddress('test-admin@test.com');
        await this.fillPassword('Password1');
    }

    async inputCreatedAccountLoginInfo() {
        await this.fillMailAddress('guest@test.com');
        await this.fillPassword('Password1');
    }
}
