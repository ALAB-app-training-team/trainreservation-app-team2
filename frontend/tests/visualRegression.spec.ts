import { test } from '@tests/visualFixtures';

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

test('visual-selectSeat-account', async ({ visualSelectSeatAccount }) => {
    await visualSelectSeatAccount();
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

test('visual-accountUpdate', async ({ visualAccountUpdate }) => {
    await visualAccountUpdate();
});

test('visual-passwordUpdate', async ({ visualPasswordUpdate }) => {
    await visualPasswordUpdate();
});

test('visual-passwordUpdateForAdmin', async ({
    visualPasswordUpdateForAdmin,
}) => {
    await visualPasswordUpdateForAdmin();
});

test('visual-reservationList', async ({ visualReservationList }) => {
    await visualReservationList();
});

test('visual-reservedTicket', async ({ visualReservedTicket }) => {
    await visualReservedTicket();
});
