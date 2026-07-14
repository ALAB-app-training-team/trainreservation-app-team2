import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class SelectSeatPage {
    readonly page: Page;
    readonly header: Header;
    readonly backButton: Locator;
    readonly emptySeat: Locator;
    readonly name: Locator;
    readonly mailAddress: Locator;
    readonly cardNumber: Locator;
    readonly cardHolderName: Locator;
    readonly cardExpiry: Locator;
    readonly secureCode: Locator;
    readonly reserveButton: Locator;
    readonly confirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.backButton = page.getByRole('button', { name: '検索画面に戻る' });
        this.emptySeat = page.locator('button.w-12.h-12.cursor-pointer');
        this.name = page.getByRole('textbox', { name: '購入者氏名' });
        this.mailAddress = page.getByRole('textbox', {
            name: 'メールアドレス',
        });
        this.cardNumber = page.getByRole('textbox', { name: 'カード番号' });
        this.cardHolderName = page.getByRole('textbox', {
            name: 'カード名義人',
        });
        this.cardExpiry = page.getByRole('textbox', {
            name: '有効期限（月/年）',
        });
        this.secureCode = page.getByRole('textbox', {
            name: 'セキュリティコード',
        });
        this.reserveButton = page.getByRole('button', { name: '予約を確定' });
        this.confirmButton = page.getByRole('button', { name: '予約を確定' });
    }

    async clickBackButton() {
        await this.backButton.click();
    }

    async selectSeat() {
        await this.emptySeat.first().click();
    }

    async fillName(name: string) {
        await this.name.fill(name);
    }

    async fillMailAddress(mailAddress: string) {
        await this.mailAddress.fill(mailAddress);
    }

    async fillCardNumber(cardNumber: string) {
        await this.cardNumber.fill(cardNumber);
    }

    async fillCardHolderName(cardHolderName: string) {
        await this.cardHolderName.fill(cardHolderName);
    }
    async fillCardExpiry(cardExpiry: string) {
        await this.cardExpiry.fill(cardExpiry);
    }

    async fillSecureCode(secureCode: string) {
        await this.secureCode.fill(secureCode);
    }

    async clickReseveButton() {
        await this.reserveButton.click();
    }

    async clickConfirmButton() {
        await this.confirmButton.click();
    }

    async inputResererInfo() {
        await this.fillName('田中太郎');
        await this.fillMailAddress('tanaka@taro.jp');
    }

    async inputCardInfo() {
        await this.fillCardNumber('1234567890123456');
        await this.fillCardHolderName('TARO TANAKA');
        await this.fillCardExpiry('12/27');
        await this.fillSecureCode('123');
    }
}
