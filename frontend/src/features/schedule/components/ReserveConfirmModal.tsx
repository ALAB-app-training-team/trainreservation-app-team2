import { FARE_CONSTANTS } from '@/features/reservation/constants/FareConstant';

type ReserveConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
};

export function ReserveConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
}: ReserveConfirmModalProps) {
    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                <h2 className="text-left">予約確認</h2>
                <p>予約を確定しますか？</p>
                <div>
                    <p>※予約の取り消しには手数料が発生します</p>
                    <p>(1座席につき {FARE_CONSTANTS.REFUND}円)</p>
                </div>
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="border-primary text-primary rounded-lg border-2 p-2 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onClick}
                        disabled={isSubmitting}
                        className="bg-primary rounded-lg p-2 text-white"
                    >
                        予約を確定する
                    </button>
                </div>
            </div>
        </>
    );
}
