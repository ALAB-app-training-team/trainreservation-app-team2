export const RESERVATION_TAB = {
    ACTIVE: '有効',
    CANCELED: 'キャンセル',
    PAST: '過去',
} as const;

export type ReservationTabKey = keyof typeof RESERVATION_TAB;

export const TABS = [
    { key: 'ACTIVE', label: RESERVATION_TAB.ACTIVE, testId: 'active-button' },
    {
        key: 'CANCELED',
        label: RESERVATION_TAB.CANCELED,
        testId: 'canceled-button',
    },
    { key: 'PAST', label: RESERVATION_TAB.PAST, testId: 'past-button' },
] as const;

export const DEFAULT_RESERVATION_TAB = 'ACTIVE';
