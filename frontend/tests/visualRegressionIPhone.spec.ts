import { test } from '@tests/visualFixtures';

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
    visualSelectSeatAccount,
}) => {
    await visualSelectSeatAccount();
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

test('visual-iPhone-accountUpdate', async ({ visualAccountUpdate }) => {
    await visualAccountUpdate();
});

test('visual-iPhone-passwordUpdate', async ({ visualPasswordUpdate }) => {
    await visualPasswordUpdate();
});

test('visual-iPhone-passwordUpdateForAdmin', async ({
    visualPasswordUpdateForAdmin,
}) => {
    await visualPasswordUpdateForAdmin();
});

test('visual-iPhone-reservationList', async ({ visualReservationList }) => {
    await visualReservationList();
});

test('visual-iPhone-reservedTicket', async ({ visualReservedTicket }) => {
    await visualReservedTicket();
});
