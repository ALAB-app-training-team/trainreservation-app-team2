export const RESERVATION_TAB = [
    { key: 'ACTIVE', label: '有効', testId: 'active-button' },
    { key: 'PAST', label: '過去', testId: 'past-button' },
    { key: 'CANCELED', label: 'キャンセル', testId: 'canceled-button' },
] as const;

export type ReservationTabKey = (typeof RESERVATION_TAB)[number]['key'];

export const DEFAULT_RESERVATION_TAB = RESERVATION_TAB[0].key;
