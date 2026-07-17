import { test, expect } from '@playwright/test';
import { ReservationListPage } from '@tests/pages/ReservationList/ReservationListPage';

test('お支払い合計が正しく表示されていること', async ({ page }) => {
    const reservationListPage = new ReservationListPage(page);

    await page.route('**/api/reservations*', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
                {
                    purchaseId: '93a167a3-e837-4a87-84c7-e01e33aeda0d',
                    trainTypeName: 'なすの279号',
                    departureTime: '08:37:00',
                    departureStationName: '東京',
                    arrivalStationName: '上野',
                    rideDate: '2026-07-17',
                    reservedSeats: [
                        {
                            trainCarTypeName: '指定席',
                            trainCarNumber: 1,
                            seatNumber: 1,
                            seatColumn: 'C',
                            codeToken: 'df57b3de-68f3-4632-8111-4e0d5e4d80be',
                            seatFare: 1500,
                        },
                    ],
                },
            ]),
        });
    });

    await page.goto('/reservationList');
    await expect(reservationListPage.totalFareElement).toBeVisible();
    await expect(reservationListPage.totalFareElement).toContainText('1,500');
});
