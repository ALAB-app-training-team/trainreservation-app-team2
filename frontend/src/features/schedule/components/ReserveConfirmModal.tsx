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
                <h1 className="!m-0 text-left !text-xl">予約確認</h1>
                <div>本当に予約しますか？</div>
                <div className="flex gap-4">
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="border-primary text-primary rounded-lg border-2 p-2"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onClick}
                        disabled={isSubmitting}
                        className="bg-primary rounded-lg p-2 text-white"
                    >
                        予約を確定
                    </button>
                </div>
            </div>
        </>
    );
}
