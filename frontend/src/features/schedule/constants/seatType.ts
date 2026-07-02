export const SEAT_TYPE_LABELS = {
    SEAT01: '指定席',
    SEAT02: 'グリーン車',
    SEAT03: 'グランクラス',
} as const;

export const DEFAULT_SEAT_TYPE = 'SEAT01';

export type SeatTypeCd = keyof typeof SEAT_TYPE_LABELS;
