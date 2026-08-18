import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class AccountCreatePage {
    readonly page: Page;
    readonly header: Header;
    readonly name: Locator;
    readonly mailAddress: Locator;
    readonly password: Locator;
    readonly passwordCheck: Locator;
    readonly createButton: Locator;

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
        this.passwordCheck = page.getByRole('textbox', {
            name: 'パスワード再入力',
        });
        this.createButton = page.getByRole('button', {
            name: '登録',
        });
    }

    async goto() {
        await this.page.goto('/accountCreate');
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

    async fillPasswordCheck(passwordCheck: string) {
        await this.passwordCheck.fill(passwordCheck);
    }

    async clickCreateButton() {
        await this.createButton.click();
    }

    async inputCreateAccountInfo() {
        await this.fillName('山田 太郎');
        await this.fillMailAddress('test@test.com');
        await this.fillPassword('Password1');
        await this.fillPasswordCheck('Password1');
    }
}
