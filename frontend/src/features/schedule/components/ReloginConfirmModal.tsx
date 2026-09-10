type ReloginConfirmModalProps = {
    onReloginClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
};

export function ReloginConfirmModal({
    onReloginClick,
    onRequestClose,
    isSubmitting,
}: ReloginConfirmModalProps) {
    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                <h2 className="text-left">再ログイン確認</h2>
                <p>セッションが切れました。再ログインしますか？</p>
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        onClick={onRequestClose}
                        disabled={isSubmitting}
                        className="border-primary-ink text-primary-ink disabled:border-line-strong disabled:bg-surface-disabled rounded-lg border-2 p-2 disabled:text-white"
                    >
                        キャンセル
                    </button>
                    <button
                        onClick={onReloginClick}
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
