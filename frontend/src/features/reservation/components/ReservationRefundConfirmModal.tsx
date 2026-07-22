type ReservationRefundConfirmModalProps = {
    onClick: (reeservationId: string) => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
    reservationId: string;
};

export function ReservationRefundConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
    reservationId,
}: ReservationRefundConfirmModalProps) {
    return (
        <>
            <div className="justify-er flex flex-col items-start gap-4">
                <h1 className="!m-0 text-left !text-xl">予約キャンセル確認</h1>
                <div>予約をキャンセルしますか？</div>
                
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="border-primary text-primary rounded-lg border-2 p-2 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white"
                    >
                        閉じる
                    </button>
                    <button
                        onClick={() => onClick(reservationId)}
                        disabled={isSubmitting}
                        className="bg-primary rounded-lg p-2 text-white"
                    >
                        予約をキャンセル
                    </button>
                </div>
            </>
        </>
    );
}
