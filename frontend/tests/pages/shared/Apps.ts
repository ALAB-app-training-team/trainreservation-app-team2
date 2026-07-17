import { expect, type Page } from '@playwright/test';

export class Apps {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    expectSessionAlert() {
        this.page.once('dialog', (dialog) => {
            expect(dialog.message()).toContain(
                'セッションが切れました。再ログインしてください。',
            );
            dialog.accept();
        });
    }
}
