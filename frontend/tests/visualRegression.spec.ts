// import { test, expect } from '@playwright/test';
// import { ReservationGuestLoginPage } from './pages/ReservationGuestLogin/ReservationGuestLoginPage';
// import { ReservedTicketPage } from './pages/ReservedTicket/ReservedTicketPage';
// import { ReservationListPage } from './pages/ReservationList/ReservationListPage';
// import { ScheduleSearchPage } from './pages/ScheduleSearch/ScheduleSearchPage';
// import { SelectSeatPage } from './pages/SelectSeat/SelectSeatPage';

// test('visual-scheduleSearch', async ({ page }) => {
//     const scheduleSearchPage = new ScheduleSearchPage(page);

//     await scheduleSearchPage.goto();
//     await expect(page).toHaveURL('/scheduleSearch');
//     await scheduleSearchPage.arrivalStation.waitFor({ state: 'visible' });

//     await expect(page).toHaveScreenshot({
//         maxDiffPixelRatio: 0.1,
//         fullPage: true,
//         animations: 'disabled',
//         mask: [
//             // テストに含めたくない要素をマスク(無視)する
//             // 例 page.locator('.hoge'),
//         ],
//         maskColor: '#00ff00',
//     });
// });

// test('visual-selectSeat', async ({ page }) => {
//     const scheduleSearchPage = new ScheduleSearchPage(page);
//     const selectSeatPage = new SelectSeatPage(page);

//     await scheduleSearchPage.goto();
//     await scheduleSearchPage.clickDetailButton();
//     await expect(page).toHaveURL('/selectSeat');
//     await selectSeatPage.cardHolderName.waitFor({ state: 'visible' });

//     await expect(page).toHaveScreenshot({
//         maxDiffPixelRatio: 0.1,
//         fullPage: true,
//         animations: 'disabled',
//         mask: [
//             // テストに含めたくない要素をマスク(無視)する
//             // 例 page.locator('.hoge'),
//         ],
//         maskColor: '#00ff00',
//     });
// });

// test('visual-reservationGuestLogin', async ({ page }) => {
//     const reservationGuestLoginPage = new ReservationGuestLoginPage(page);

//     await reservationGuestLoginPage.goto();
//     await expect(page).toHaveURL('/reservationGuestLogin');
//     await reservationGuestLoginPage.name.waitFor({ state: 'visible' });

//     await expect(page).toHaveScreenshot({
//         maxDiffPixelRatio: 0.1,
//         fullPage: true,
//         animations: 'disabled',
//         mask: [
//             // テストに含めたくない要素をマスク(無視)する
//             // 例 page.locator('.hoge'),
//         ],
//         maskColor: '#00ff00',
//     });
// });

// test('visual-reservationList', async ({ page }) => {
//     const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
//     const reservationListPage = new ReservationListPage(page);

//     await reservationGuestLoginPage.goto();
//     await reservationGuestLoginPage.inputGuestLoginInfo();
//     await reservationGuestLoginPage.clickGuestLoginButton();
//     await expect(page).toHaveURL('/reservationList');
//     await reservationListPage.header.systemName.waitFor({ state: 'visible' });
//     const listItems = page.locator(
//         '.border-primary-light.flex.flex-col.gap-2.rounded-2xl.border-2.p-8',
//     );
//     const itemCount = await listItems.count();

//     const maskTargets = [];
//     for (let i = 1; i < itemCount; i++) {
//         maskTargets.push(listItems.nth(i));
//     }
//     maskTargets.push(page.locator('.text-xl.font-bold').nth(1));
//     maskTargets.push(page.locator('.text-xl.font-bold').nth(2));
//     maskTargets.push(
//         page
//             .locator(
//                 '.flex.items-center.gap-1.rounded-lg.px-2.border-primary.border',
//             )
//             .nth(0),
//     );

//     await expect(page).toHaveScreenshot({
//         maxDiffPixelRatio: 0.1,
//         fullPage: true,
//         animations: 'disabled',
//         mask: maskTargets,
//         maskColor: '#00ff00',
//     });
// });

// test('visual-reservedTicket', async ({ page }) => {
//     const reservationGuestLoginPage = new ReservationGuestLoginPage(page);
//     const reservationListPage = new ReservationListPage(page);
//     const reservedTicketPage = new ReservedTicketPage(page);

//     await reservationGuestLoginPage.goto();
//     await reservationGuestLoginPage.inputGuestLoginInfo();
//     await reservationGuestLoginPage.clickGuestLoginButton();
//     await reservationListPage.clickTicketButton();
//     await expect(page).toHaveURL('/reservedTicket');
//     await reservedTicketPage.backButton.waitFor({ state: 'visible' });

//     await expect(page).toHaveScreenshot({
//         maxDiffPixelRatio: 0.1,
//         fullPage: true,
//         animations: 'disabled',
//         mask: [
//             // テストに含めたくない要素をマスク(無視)する
//             // 例 page.locator('.hoge'),
//             page.locator('path').nth(4),
//             page.locator('.mb-4.text-sm').nth(0),
//             page.locator('.text-2xl.font-bold').nth(0),
//             page.locator('.text-2xl.font-bold').nth(1),
//             page.locator('.flex.items-center.gap-2.text-xl.font-bold').nth(0),
//             page
//                 .locator(
//                     '.flex.items-center.gap-1.rounded-lg.px-2.border-primary-light.text-primary.bg-green-100.border-2',
//                 )
//                 .nth(0),
//         ],
//         maskColor: '#00ff00',
//     });
// });
