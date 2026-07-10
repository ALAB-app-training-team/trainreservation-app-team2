import { expect, type Locator, type Page } from '@playwright/test';
import { Header } from './shared/Header';

export class ReservationListPage {
    readonly page: Page;
    readonly header: Header;
    readonly ticketButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.ticketButton = page.getByRole('button', {
            name: 'チケットを表示',
        });
    }

    async goto() {
        await this.page.goto('/reservationList');
    }

    async clickTicketButton() {
        await this.ticketButton.first().click();
    }
}
