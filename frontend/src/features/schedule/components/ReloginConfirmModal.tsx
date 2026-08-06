type ReloginConfirmModalProps = {
    onReloginClick: () => void;
    onLogoutClick: () => void;
    isSubmitting: boolean;
};

export function ReloginConfirmModal({
    onReloginClick,
    onLogoutClick,
    isSubmitting,
}: ReloginConfirmModalProps) {
    return (
        <>
            <div className="flex flex-col items-start justify-center gap-4">
                <h2 className="text-left">再ログイン確認</h2>
                <p>セッションが切れました。再ログインしますか？</p>
                <div className="flex w-full items-center justify-end gap-4">
                    <button
                        onClick={onLogoutClick}
                        disabled={isSubmitting}
                        className="border-primary text-primary rounded-lg border-2 p-2 disabled:border-gray-300 disabled:bg-gray-300 disabled:text-white"
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
