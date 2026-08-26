import { type Locator, type Page } from '@playwright/test';

import { Header } from '@tests/pages/shared/Header';

export class PasswordUpdatePage {
    readonly page: Page;
    readonly header: Header;
    readonly currentPassword: Locator;
    readonly newPassword: Locator;
    readonly newPasswordCheck: Locator;
    readonly updateButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.currentPassword = page.getByRole('textbox', {
            name: '現在のパスワード',
            exact: true,
        });
        this.newPassword = page.getByRole('textbox', {
            name: '新しいパスワード',
            exact: true,
        });
        this.newPasswordCheck = page.getByRole('textbox', {
            name: '新しいパスワード再入力',
            exact: true,
        });
        this.updateButton = page.getByRole('button', {
            name: '変更',
        });
    }

    async goto() {
        await this.page.goto('/passwordUpdate');
    }
    async fillCurrentPassword(password: string) {
        await this.currentPassword.fill(password);
    }
    async fillNewPassword(password: string) {
        await this.newPassword.fill(password);
    }
    async fillNewPasswordCheck(passwordCheck: string) {
        await this.newPasswordCheck.fill(passwordCheck);
    }
    async clickUpdateButton() {
        await this.updateButton.click();
    }
}
