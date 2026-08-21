import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ReservedTicketPage {
    readonly page: Page;
    readonly header: Header;
    readonly backButton: Locator;
    readonly title: Locator;
    readonly departureArrivalElement: Locator;
    readonly seatFareElement: Locator;
    readonly modalCloseButton: Locator;
    // 予約変更
    readonly changeButton: Locator;
    readonly changeSeatConfirmButton: Locator;
    readonly changeTrainConfirmButton: Locator;
    // チケット共有
    readonly ticketShareButton: Locator;
    readonly ticketShareElement: Locator;
    readonly linkCopyButton: Locator;
    readonly linkCopyElement: Locator;
    // 予約キャンセル
    readonly refundButton: Locator;
    readonly confirmRefundButton: Locator;
    // 同行者割り当て
    readonly companionChangeButton: Locator;
    readonly companionCheckBox: Locator;
    readonly companionName: Locator;
    readonly companionMailAddress: Locator;
    readonly companionChangeConfirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.backButton = page.getByRole('button', { name: '予約一覧へ戻る' });
        this.title = page.getByTestId('reserve-title');
        this.departureArrivalElement = page.getByTestId('departure-arrival');
        this.seatFareElement = page.getByTestId('reserved-seats');
        this.modalCloseButton = page.getByTestId('modal-close-button');
        // 予約変更
        this.changeButton = page.getByRole('button', { name: '予約を変更' });
        this.changeSeatConfirmButton = page.getByTestId('change-seat-button');
        this.changeTrainConfirmButton = page.getByTestId('change-train-button');
        // チケット共有
        this.ticketShareButton = page.getByRole('button', {
            name: 'チケットを共有',
        });
        this.ticketShareElement = page.getByTestId('ticket-share');
        this.linkCopyButton = page.getByRole('button', { name: 'コピー' });
        this.linkCopyElement = page.getByTestId('link-copy');
        // 予約キャンセル
        this.refundButton = page.getByRole('button', { name: 'キャンセル' });
        this.confirmRefundButton = page.getByTestId('refund-confirm-button');
        // 同行者割り当て
        this.companionChangeButton = page.getByRole('button', {
            name: '同行者に割り当て',
        });
        this.companionCheckBox = page.locator('#isCompanionUpdated0');
        this.companionName = page.getByRole('textbox', { name: 'お名前' });
        this.companionMailAddress = page.getByRole('textbox', {
            name: 'メールアドレス',
        });
        this.companionChangeConfirmButton = page.getByRole('button', {
            name: '確定',
        });
    }

    async goto() {
        await this.page.goto('/reservedTicket');
    }

    async clickBackButton() {
        await this.backButton.first().click();
    }

    async clickModalCloseButton() {
        await this.modalCloseButton.first().click();
    }

    // 予約変更
    async clickChangeButton() {
        await this.changeButton.first().click();
    }

    async clickChangeSeatConfirmButton() {
        await this.changeSeatConfirmButton.first().click();
    }

    async clickChangeTrainConfirmButton() {
        await this.changeTrainConfirmButton.first().click();
    }

    // 同行者割り当て
    async clickCompanionChangeButton() {
        await this.companionChangeButton.first().click();
    }

    async checkCompanionCheckBox() {
        await this.companionCheckBox.first().click();
    }

    async fillCompanionName(name: string) {
        await this.companionName.fill(name);
    }

    async fillCompanionMailAddress(address: string) {
        await this.companionMailAddress.fill(address);
    }

    async inputCompanionInfo() {
        await this.fillCompanionName('同行者太郎');
        await this.fillCompanionMailAddress('companion@test.com');
    }

    async clickCompanionChangeConfirmButton() {
        await this.companionChangeConfirmButton.first().click();
    }

    // チケット共有
    async clickTicketShareButton() {
        await this.ticketShareButton.click();
    }

    async clickLinkCopyButton() {
        await this.linkCopyButton.click();
    }

    //キャンセル
    async clickRefundButton() {
        await this.refundButton.first().click();
    }

    async clickConfirmRefundButton() {
        await this.confirmRefundButton.first().click();
    }
}
