import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

type ClearSession = () => Promise<void>;
type Fixtures = {
    clearSession: ClearSession;
};

// export const test = base.extend<{ Fixtures }>({
//     clearSession: ClearSession async (
//         { page }: { page: Page },
//         use: () => Promise<void>,
//     ) => {
//         const clear = async () => {
//             await page.evaluate(() => {
//                 sessionStorage.clear();
//             });
//         };
//         await use(clear);
//     },
// });
