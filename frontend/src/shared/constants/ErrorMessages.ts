import { LIMIT } from '@/shared/constants/Limit';

export const ERROR_MESSAGE = {
    ERROR: 'エラーが発生しました。しばらくしてから再度お試しください。',
    NO_SCHEDULE: '指定日時の列車はありません',
    NO_SPECIFIED_DATETIME_SCHEDULE:
        'お選びいただいた日時以降の列車が見つかりませんでした。条件を変更するか翌日の列車を検索してください。',
    NO_TRAIN: '該当する列車がありません',
    NO_SELECTED_SEAT: '座席が選択されていません',
    LIMIT_SELECTED_SEAT: `一度に予約できる座席は${LIMIT.SEATS}席までです`,
    ANY_RESERVATION_ERROR: '予約取得時に何らかのエラーが発生しました',
    NO_RESERVATION: '予約情報が見つかりません',
    NO_RESERVED_SEAT: '予約済座席が存在しません',
} as const;
