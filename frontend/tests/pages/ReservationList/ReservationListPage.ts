import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservationListPage {
    readonly page: Page;
    readonly header: Header;
    readonly ticketButton: Locator;
    readonly cancelConfirmButton: Locator;
    readonly modalCloseButton: Locator;
    readonly totalFareElement: Locator;
    readonly activeButton: Locator;
    readonly threeDotsButton: Locator;
    readonly refundButton: Locator;
    readonly changeButton: Locator;
    readonly pastButton: Locator;
    readonly changeSeatConfirmButton: Locator;
    readonly changeTrainConfirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.ticketButton = page.getByRole('button', {
            name: 'チケットを表示',
        });
        this.cancelConfirmButton = page.getByRole('button', {
            name: '予約を取り消す',
        });
        this.totalFareElement = page.getByTestId('total-fare');
        this.activeButton = page.getByTestId('active-button');
        this.refundButton = page.getByTestId('refund-button');
        this.changeButton = page.getByTestId('change-button');
        this.pastButton = page.getByTestId('past-button');
        this.changeSeatConfirmButton = page.getByTestId('change-seat-button');
        this.changeTrainConfirmButton = page.getByTestId('change-train-button');
        this.modalCloseButton = page.getByTestId('modal-close-button');
        this.threeDotsButton = page.getByTestId('three-dots-button');
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

    async clickModalCloseButton() {
        await this.modalCloseButton.first().click();
    }

    async clickActiveButton() {
        await this.activeButton.first().click();
    }
    async clickPastButton() {
        await this.pastButton.first().click();
    }

    async clickThreeDotsButton() {
        await this.threeDotsButton.first().click();
    }

    async clickRefundButton() {
        await this.refundButton.first().click();
    }

    async clickChangeButton() {
        await this.changeButton.first().click();
    }

    async clickChangeSeatConfirmButton() {
        await this.changeSeatConfirmButton.first().click();
    }

    async clickChangeTrainConfirmButton() {
        await this.changeTrainConfirmButton.first().click();
    }
}
