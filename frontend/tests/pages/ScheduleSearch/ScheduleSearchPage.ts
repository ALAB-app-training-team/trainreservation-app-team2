import { type Locator, type Page } from '@playwright/test';
import { Header } from '@tests/pages/shared/Header';

export class ScheduleSearchPage {
    readonly page: Page;
    readonly header: Header;
    readonly detailButton: Locator;
    readonly departureStation: Locator;
    readonly arrivalStation: Locator;
    readonly date: Locator;
    readonly time: Locator;
    readonly arrivalTimeButton: Locator;
    readonly departureTimeButton: Locator;
    readonly switchStationButton: Locator;
    readonly availableTrainCheckBox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.detailButton = page.getByRole('button', { name: '詳細を見る' });
        this.departureStation = page.getByLabel('乗車駅');
        this.arrivalStation = page.getByLabel('降車駅');
        this.date = page.getByRole('textbox', { name: '乗車日' });
        this.time = page.getByRole('textbox', { name: '時刻' });
        this.arrivalTimeButton = page.getByText('出発');
        this.departureTimeButton = page.getByText('到着');
        this.switchStationButton = page
            .getByRole('button')
            .filter({ hasText: /^$/ });
        this.availableTrainCheckBox = page.getByRole('checkbox', {
            name: '空席がある列車のみ表示する',
        });
    }

    async goto() {
        await this.page.goto('/');
    }

    async clickDetailButton() {
        await this.detailButton.first().click();
    }

    async clickSecondDetailButton() {
        await this.detailButton.nth(1).click();
    }
    async openDepartureStationDropdown() {
        await this.departureStation.first().click();
    }

    async openArrivalStationDropdown() {
        await this.arrivalStation.first().click();
    }

    async clickSwitchStationButton() {
        await this.switchStationButton.click();
    }

    async clickArrivalTimeButton() {
        await this.arrivalTimeButton.click();
    }

    async clickDepartureTimeButton() {
        await this.departureTimeButton.click();
    }

    async clickAvailableTrainCheckBox() {
        await this.availableTrainCheckBox.click();
    }
}
