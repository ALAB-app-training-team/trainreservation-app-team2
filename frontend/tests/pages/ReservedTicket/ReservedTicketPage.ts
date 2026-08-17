import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservedTicketPage {
    readonly page: Page;
    readonly header: Header;
    readonly backButton: Locator;
    readonly title: Locator;
    readonly departureArrivalElement: Locator;
    readonly seatFareElement: Locator;
    readonly changeButton: Locator;
    readonly ticketShareButton: Locator;
    readonly ticketShareElement: Locator;
    readonly linkCopyButton: Locator;
    readonly linkCopyElement: Locator;
    readonly changeSeatConfirmButton: Locator;
    readonly changeTrainConfirmButton: Locator;
    readonly modalCloseButton: Locator;
    readonly refundButton: Locator;
    readonly confirmRefundButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.backButton = page.getByRole('button', { name: '予約一覧へ戻る' });
        this.title = page.getByTestId('reserve-title');
        this.departureArrivalElement = page.getByTestId('departure-arrival');
        this.seatFareElement = page.getByTestId('reserved-seats');
        this.changeButton = page.getByRole('button', { name: '予約を変更' });
        this.ticketShareButton = page.getByRole('button', {
            name: 'チケットを共有',
        });
        this.ticketShareElement = page.getByTestId('ticket-share');
        this.linkCopyButton = page.getByRole('button', { name: 'コピー' });
        this.linkCopyElement = page.getByTestId('link-copy');
        this.changeSeatConfirmButton = page.getByTestId('change-seat-button');
        this.changeTrainConfirmButton = page.getByTestId('change-train-button');
        this.modalCloseButton = page.getByTestId('modal-close-button');
        this.refundButton = page.getByRole('button', { name: 'キャンセル' });
        this.confirmRefundButton = page.getByTestId('refund-confirm-button');
    }

    async goto() {
        await this.page.goto('/reservedTicket');
    }

    async clickBackButton() {
        await this.backButton.first().click();
    }

    async clickChangeButton() {
        await this.changeButton.click();
    }

    async clickTicketShareButton() {
        await this.ticketShareButton.click();
    }

    async clickLinkCopyButton() {
        await this.linkCopyButton.click();
    }

    async clickChangeSeatConfirmButton() {
        await this.changeSeatConfirmButton.first().click();
    }

    async clickChangeTrainConfirmButton() {
        await this.changeTrainConfirmButton.first().click();
    }

    async clickModalCloseButton() {
        await this.modalCloseButton.first().click();
    }

    async clickRefundButton() {
        await this.refundButton.first().click();
    }

    async clickConfirmRefundButton() {
        await this.confirmRefundButton.first().click();
    }
}
