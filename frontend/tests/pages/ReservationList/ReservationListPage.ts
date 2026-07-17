import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservationListPage {
    readonly page: Page;
    readonly header: Header;
    readonly ticketButton: Locator;
    readonly totalFareElement: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.ticketButton = page.getByRole('button', {
            name: 'チケットを表示',
        });
        this.totalFareElement = page.getByText('お支払い合計：1,500');
    }

    async clickTicketButton() {
        await this.ticketButton.first().click();
    }
}
