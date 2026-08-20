import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class PasswordUpdateForAdminPage {
    readonly page: Page;
    readonly header: Header;
    readonly name: Locator;
    readonly mailAddress: Locator;
    readonly password: Locator;
    readonly passwordCheck: Locator;
    readonly updateButton: Locator;
    // readonly ramdomMail: string;

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
        this.updateButton = page.getByRole('button', {
            name: '変更を確定',
        });
        // this.ramdomMail = 'random' + Math.random() + '@test.co.jp';
    }

    async goto() {
        await this.page.goto('/admin/password');
    }
}
