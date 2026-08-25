import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservationListPage {
    readonly page: Page;
    readonly header: Header;
    readonly totalFareElement: Locator;
    // ボタン系
    readonly ticketButton: Locator;
    readonly searchReturnTripButton;
    readonly threeDotsButton: Locator;
    readonly refundButton: Locator;
    readonly refundConfirmButton: Locator;
    readonly changeButton: Locator;
    readonly changeSeatConfirmButton: Locator;
    readonly changeTrainConfirmButton: Locator;
    readonly modalCloseButton: Locator;
    // ヘッダー
    readonly activeButton: Locator;
    readonly pastButton: Locator;
    readonly canceledButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.totalFareElement = page.getByTestId('total-fare');
        // ボタン
        this.ticketButton = page.getByRole('button', {
            name: 'チケットを表示',
        });
        this.searchReturnTripButton = page.getByRole('button', {
            name: '復路で検索',
        });
        this.threeDotsButton = page.getByTestId('three-dots-button');
        this.refundButton = page.getByTestId('refund-button');
        this.refundConfirmButton = page.getByRole('button', {
            name: '予約を取り消す',
        });
        this.changeButton = page.getByTestId('change-button');
        this.changeSeatConfirmButton = page.getByTestId('change-seat-button');
        this.changeTrainConfirmButton = page.getByTestId('change-train-button');
        this.modalCloseButton = page.getByTestId('modal-close-button');
        // ヘッダー
        this.activeButton = page.getByTestId('active-button');
        this.pastButton = page.getByTestId('past-button');
        this.canceledButton = page.getByTestId('canceled-button');
    }

    async goto() {
        await this.page.goto('/reservationList');
    }

    async clickTicketButton() {
        await this.ticketButton.first().click();
    }

    async clickSearchReturnTripButton() {
        await this.searchReturnTripButton.first().click();
    }

    async clickRefundConfirmButton() {
        await this.refundConfirmButton.first().click();
    }

    async clickModalCloseButton() {
        await this.modalCloseButton.first().click();
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

    async clickActiveButton() {
        await this.activeButton.first().click();
    }

    async clickPastButton() {
        await this.pastButton.first().click();
    }

    async clickCanceledButton() {
        await this.canceledButton.first().click();
    }
}
