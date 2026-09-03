export function ReservationGuestLoginBodySkeleton() {
    return (
        <>
            <div className="flex justify-center">
                <div className="flex w-full max-w-5xl flex-col gap-4">
                    <div className="border-primary-ink/20 flex flex-col justify-between gap-4 rounded-2xl border-2 p-4">
                        <div className="flex flex-col gap-4 py-2">
                            <label className="mb-8 flex items-start font-bold">
                                ゲスト予約の確認
                            </label>
                            <label className="flex items-start">
                                予約時に入力した氏名とメールアドレスを入力してください
                            </label>
                            <div className="flex flex-col items-start">
                                <label className="font-bold">予約ID</label>
                                <svg className="bg-surface-disabled h-12 w-full animate-pulse rounded-lg" />
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="font-bold">予約者氏名</label>
                                <svg className="bg-surface-disabled h-12 w-full animate-pulse rounded-lg" />
                            </div>
                            <div className="flex flex-col items-start">
                                <label className="font-bold">
                                    メールアドレス
                                </label>
                                <svg className="bg-surface-disabled h-12 w-full animate-pulse rounded-lg" />
                            </div>
                            <svg className="bg-surface-disabled h-12 w-full animate-pulse rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
