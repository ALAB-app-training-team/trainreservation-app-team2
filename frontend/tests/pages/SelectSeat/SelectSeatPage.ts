import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class SelectSeatPage {
    readonly page: Page;
    readonly header: Header;
    readonly backButton: Locator;
    readonly trainCars: Locator;
    readonly emptySeat: Locator;
    readonly name: Locator;
    readonly mailAddress: Locator;
    readonly accountCreateCheckBox: Locator;
    readonly password: Locator;
    readonly passwordCheck: Locator;
    readonly cardNumber: Locator;
    readonly cardHolderName: Locator;
    readonly cardExpiry: Locator;
    readonly secureCode: Locator;
    readonly reserveButton: Locator;
    readonly updateButton: Locator;
    readonly cancelButton: Locator;
    readonly reserveConfirmButton: Locator;
    readonly updateConfirmButton: Locator;
    readonly loginButton: Locator;
    readonly reservationInfoError: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.backButton = page.getByTestId('back-button-in-selectseat');
        this.trainCars = page.getByTestId('train-cars').getByRole('button');
        this.emptySeat = page.locator('button.w-12.h-12.cursor-pointer');
        this.name = page.getByRole('textbox', { name: '予約者氏名' });
        this.mailAddress = page.getByRole('textbox', {
            name: 'メールアドレス',
        });
        this.accountCreateCheckBox = page.getByRole('checkbox', {
            name: 'このメールアドレスでアカウントを作成する',
        });
        this.password = page.getByRole('textbox', {
            name: 'パスワード',
            exact: true,
        });
        this.passwordCheck = page.getByRole('textbox', {
            name: 'パスワード再入力',
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
        this.reservationInfoError = page.getByTestId('error').first();
        this.reserveButton = page.getByRole('button', { name: '予約する' });
        this.updateButton = page.getByRole('button', { name: '変更する' });
        this.cancelButton = page.getByRole('button', { name: 'キャンセル' });
        this.reserveConfirmButton = page.getByRole('button', {
            name: '予約を確定する',
        });
        this.updateConfirmButton = page.getByRole('button', {
            name: '変更を確定する',
        });
        this.loginButton = page.getByRole('button', {
            name: 'ログインして氏名・メールアドレスを省略',
        });
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

    async clickAccountCreateCheckBox() {
        await this.accountCreateCheckBox.click();
    }

    async fillMailAddress(mailAddress: string) {
        await this.mailAddress.fill(mailAddress);
    }

    async fillPassword(password: string) {
        await this.password.fill(password);
    }

    async fillpasswordCheck(passwordCheck: string) {
        await this.passwordCheck.fill(passwordCheck);
    }

    async inputPasswordInfo() {
        await this.fillPassword('Password1');
        await this.fillpasswordCheck('Password1');
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

    async clickUpdateButton() {
        await this.updateButton.click();
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }

    async clickReserveConfirmButton() {
        await this.reserveConfirmButton.click();
    }

    async clickUpdateConfirmButton() {
        await this.updateConfirmButton.click();
    }

    async inputReserverInfo() {
        await this.fillName('ゲスト太郎');
        await this.fillMailAddress('guest@test.com');
    }

    async inputCardInfo() {
        await this.fillCardNumber('1234567890123456');
        await this.fillCardHolderName('TARO TANAKA');
        await this.fillCardExpiry('12/27');
        await this.fillSecureCode('123');
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }
}
