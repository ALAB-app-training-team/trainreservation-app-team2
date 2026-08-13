import { LIMIT } from '@/shared/constants/Limit';

export const ERROR_MESSAGE = {
    COMPANION:
        '同行者割り当て処理中にエラーが発生しました。お手数ですが、再度お試しください。',
    ERROR: 'エラーが発生しました。しばらくしてから再度お試しください。',
    SESSION_ERROR: 'セッションが切れました。再ログインしてください。',
    GUESTLOGIN_ERROR: '無効なURLです',
    EXIST_ACCOUNT: 'すでにログインしています。予約確認からご確認ください。',
    NO_SCHEDULE: '指定日時の列車はありません',
    NO_SPECIFIED_DATETIME_SCHEDULE:
        'お選びいただいた日時以降の列車が見つかりませんでした。条件を変更するか翌日の列車を検索してください。',
    NO_TRAIN: '該当する列車がありません',
    NO_SELECTED_SEAT: '座席が選択されていません',
    LIMIT_SELECTED_SEAT: `一度に予約できる座席は${LIMIT.SEATS}席までです`,
    RELEASE_SEAT:
        '選択中の座席が予約されたため、以下の座席の選択を解除しました。',
    RESERVE_RETRY:
        '予約処理中にエラーが発生しました。お手数ですが再度お試しください。',
    ANY_RESERVATION_ERROR: '予約取得時に何らかのエラーが発生しました',
    NO_RESERVATION: '予約情報が見つかりません',
    NO_RESERVED_SEAT: '予約済座席が存在しません',
    REFUND_RETRY:
        '予約キャンセル処理中にエラーが発生しました。お手数ですが、再度お試しください。',
    UPDATE_RETRY:
        '予約変更処理中にエラーが発生しました。お手数ですが、再度お試しください。',
    LOGIN_RETRY: 'ログインに失敗しました',
    LOGIN_ERROR: 'ログインしてください',
    LOGIN_ALREADY: 'すでにログインしています',
    ACCOUNT_ALREADY: '登録済のメールアドレスです。ログインしてください。',
} as const;
