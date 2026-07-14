export function ReservationListBodySkeleton() {
    return (
        <>
            <div className="mx-auto flex max-w-4xl flex-col gap-8 p-4">
                <h1 className="!m-0 text-left !text-3xl">予約確認</h1>
                <div className="bg-primary/8 flex gap-6 rounded-3xl p-2">
                    <svg className="h-full w-full animate-pulse rounded-2xl bg-gray-300" />
                </div>
                <svg className="h-full w-full animate-pulse rounded-2xl bg-gray-300" />
            </div>
        </>
    );
}
