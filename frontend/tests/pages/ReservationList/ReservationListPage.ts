import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservationListPage {
    readonly page: Page;
    readonly header: Header;
    readonly ticketButton: Locator;
    readonly totalFareElement: Locator;
    readonly activeButton: Locator;
    readonly pastButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.ticketButton = page.getByRole('button', {
            name: 'チケットを表示',
        });
        this.totalFareElement = page.getByTestId('total-fare');
        this.activeButton = page.getByTestId('active-button');
        this.pastButton = page.getByTestId('past-button');
    }

    async goto() {
        await this.page.goto('/reservationList');
    }

    async clickTicketButton() {
        await this.ticketButton.first().click();
    }

    async clickActiveButton() {
        await this.activeButton.first().click();
    }
    async clickPastButton() {
        await this.pastButton.first().click();
    }
}
