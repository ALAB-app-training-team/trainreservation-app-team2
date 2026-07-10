import { expect, type Locator, type Page } from '@playwright/test';
import { Header } from './shared/Header';

export class ScheduleSearchPage {
    readonly page: Page;
    readonly header: Header;
    readonly detailButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new Header(page);
        this.detailButton = page.getByRole('button', { name: '詳細を見る' });
    }

    async goto() {
        await this.page.goto('/');
    }

    async clickDetailButton() {
        await this.detailButton.first().click();
    }
}
