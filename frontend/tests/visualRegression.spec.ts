import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';

test('visual-scheduleSearch', async ({ visualScheduleSearch }) => {
    await visualScheduleSearch();
});

test('visual-selectSeat-guest', async ({ visualSelectSeatGuest }) => {
    await visualSelectSeatGuest();
});

test('visual-selectSeat-accountCreate', async ({
    visualSelectSeatAccountCreate,
}) => {
    await visualSelectSeatAccountCreate();
});

test('visual-selectSeat-account', async ({
    page,
    commonLogin,
    logout,
    visualSelectSeatAccount,
}) => {
    await commonLogin();
    await visualSelectSeatAccount();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-reservationGuestLogin', async ({
    visualReservationGuestLogin,
}) => {
    await visualReservationGuestLogin();
});

test('visual-login', async ({ visualLogin }) => {
    await visualLogin();
});

test('visual-accountCreate', async ({ visualAccountCreate }) => {
    await visualAccountCreate();
});

test('visual-accountUpdate', async ({
    page,
    commonLogin,
    logout,
    visualAccountUpdate,
}) => {
    await commonLogin();
    await visualAccountUpdate();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-passwordUpdate', async ({
    page,
    commonLogin,
    logout,
    visualPasswordUpdate,
}) => {
    await commonLogin();
    await visualPasswordUpdate();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-passwordUpdateForAdmin', async ({
    page,
    adminLogin,
    logout,
    visualPasswordUpdateForAdmin,
}) => {
    await adminLogin();
    await visualPasswordUpdateForAdmin();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-reservationList', async ({
    page,
    commonLogin,
    logout,
    visualReservationList,
}) => {
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await visualReservationList();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-reservedTicket', async ({
    page,
    commonLogin,
    logout,
    createReservation,
    visualReservedTicket,
}) => {
    await commonLogin();
    await expect(page).toHaveURL('/scheduleSearch');
    await createReservation();
    await visualReservedTicket();
    await logout();
    await expect(page).toHaveURL('/login');
});
