import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservationListPage {
    readonly page: Page;
    readonly header: Header;
    readonly ticketButton: Locator;
    readonly cancelConfirmButton: Locator;
    readonly cancelBackButton: Locator;
    readonly totalFareElement: Locator;
    readonly activeButton: Locator;
    readonly refundButton: Locator;
    readonly pastButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.ticketButton = page.getByRole('button', {
            name: 'チケットを表示',
        });
        this.cancelConfirmButton = page.getByRole('button', {
            name: '予約を取り消す',
        });
        this.cancelBackButton = page.getByRole('button', {
            name: '予約を取り消さない',
        });
        this.totalFareElement = page.getByTestId('total-fare');
        this.activeButton = page.getByTestId('active-button');
        this.refundButton = page.getByTestId('refund-button');
        this.pastButton = page.getByTestId('past-button');
    }

    async goto() {
        await this.page.goto('/reservationList');
    }

    async clickTicketButton() {
        await this.ticketButton.first().click();
    }

    async clickCancelConfirmButton() {
        await this.cancelConfirmButton.first().click();
    }

    async clickCancelBackButton() {
        await this.cancelBackButton.first().click();
    }

    async clickActiveButton() {
        await this.activeButton.first().click();
    }
    async clickPastButton() {
        await this.pastButton.first().click();
    }

    async clickRefundButton() {
        await this.refundButton.first().click();
    }
}
