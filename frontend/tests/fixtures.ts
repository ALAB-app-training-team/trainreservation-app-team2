import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

type ClearSession = () => Promise<void>;
type Fixture = {
    clearSession: ClearSession;
};

export const test = base.extend<Fixture>({
    clearSession: async (
        { page }: { page: Page },
        use: (fn: ClearSession) => Promise<void>,
    ) => {
        const clear = async () => {
            await page.evaluate(() => {
                sessionStorage.clear();
            });
        };
        await use(clear);
    },
});
