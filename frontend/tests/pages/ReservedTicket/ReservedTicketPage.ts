import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservedTicketPage {
    readonly page: Page;
    readonly header: Header;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.backButton = page.getByRole('button', { name: '予約一覧へ戻る' });
    }

    async clickBackButton() {
        await this.backButton.first().click();
    }
}
