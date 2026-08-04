import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservedTicketPage {
    readonly page: Page;
    readonly header: Header;
    readonly backButton: Locator;
    readonly title: Locator;
    readonly departureArrivalElement: Locator;
    readonly seatFareElement: Locator;
    readonly ticketShareButton: Locator;
    readonly ticketShareElement: Locator;
    readonly linkCopyButton: Locator;
    readonly linkCopyElement: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.backButton = page.getByRole('button', { name: '予約一覧へ戻る' });
        this.title = page.getByTestId('reserve-title');
        this.departureArrivalElement = page.getByTestId('departure-arrival');
        this.seatFareElement = page.getByTestId('reserved-seats');
        this.ticketShareButton = page.getByRole('button', {
            name: 'チケットを共有',
        });
        this.ticketShareElement = page.getByTestId('ticket-share');
        this.linkCopyButton = page.getByRole('button', { name: 'コピー' });
        this.linkCopyElement = page.getByTestId('link-copy');
    }

    async goto() {
        await this.page.goto('/reservedTicket');
    }

    async clickBackButton() {
        await this.backButton.first().click();
    }

    async clickTicketShareButton() {
        await this.ticketShareButton.click();
    }
}
