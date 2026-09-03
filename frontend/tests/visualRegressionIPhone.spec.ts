import { expect } from '@playwright/test';
import { test } from '@tests/fixtures';

test('visual-iPhone-scheduleSearch', async ({ visualScheduleSearch }) => {
    await visualScheduleSearch();
});

test('visual-iPhone-selectSeat-guest', async ({ visualSelectSeatGuest }) => {
    await visualSelectSeatGuest();
});

test('visual-iPhone-selectSeat-accountCreate', async ({
    visualSelectSeatAccountCreate,
}) => {
    await visualSelectSeatAccountCreate();
});

test('visual-iPhone-selectSeat-account', async ({
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

test('visual-iPhone-reservationGuestLogin', async ({
    visualReservationGuestLogin,
}) => {
    await visualReservationGuestLogin();
});

test('visual-iPhone-login', async ({ visualLogin }) => {
    await visualLogin();
});

test('visual-iPhone-accountCreate', async ({ visualAccountCreate }) => {
    await visualAccountCreate();
});

test('visual-iPhone-accountUpdate', async ({
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

test('visual-iPhone-passwordUpdate', async ({
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

test('visual-iPhone-passwordUpdateForAdmin', async ({
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

test('visual-iPhone-reservationList', async ({
    page,
    commonLogin,
    createReservation,
    logout,
    visualReservationList,
}) => {
    await commonLogin();
    await createReservation();
    await visualReservationList();
    await logout();
    await expect(page).toHaveURL('/login');
});

test('visual-iPhone-reservedTicket', async ({
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
