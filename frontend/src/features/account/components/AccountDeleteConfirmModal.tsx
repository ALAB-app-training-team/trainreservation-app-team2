import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type AccountDeleteConfirmModalProps = {
    onClick: () => void;
    onRequestClose: () => void;
    isSubmitting: boolean;
};

export function AccountDeleteConfirmModal({
    onClick,
    onRequestClose,
    isSubmitting,
}: AccountDeleteConfirmModalProps) {
    return (
        <div className="flex flex-col items-center gap-6">
            <div className="flex w-full flex-col items-center gap-2">
                <CustomModalTitle
                    title="本当に退会しますか？"
                    onRequestClose={onRequestClose}
                    isSubmitting={isSubmitting}
                />
                <p className="text-fg-muted text-sm">
                    退会するとアカウント情報は削除され、元に戻せません。
                </p>
            </div>

            <div className="flex w-full gap-3">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onRequestClose}
                    className="text-fg-secondary w-full rounded-lg border border-gray-300 p-2"
                >
                    キャンセル
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onClick}
                    className="w-full rounded-lg bg-red-500 p-2 text-white"
                >
                    はい
                </button>
            </div>
        </div>
    );
}
