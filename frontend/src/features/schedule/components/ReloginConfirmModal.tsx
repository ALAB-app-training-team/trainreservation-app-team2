type ReloginConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
};

export function ReloginConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
}: ReloginConfirmModalProps) {
    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                <h1 className="m-0! text-left text-xl!">再ログイン確認</h1>
                <div>セッションが切れました。再ログインしますか？</div>
                <div>再ログインすることで予約内容を保持することができます</div>
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
                        再ログインする
                    </button>
                </div>
            </div>
        </>
    );
}
