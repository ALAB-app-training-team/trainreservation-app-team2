type ReservationSheetHandleProps = {
    seatCount: number;
    totalFare: number;
    onToggle: () => void;
};

export function ReservationSheetHandle({
    seatCount,
    totalFare,
    onToggle,
}: ReservationSheetHandleProps) {
    return (
        <button
            data-testid="reservation-sheet"
            type="button"
            onClick={onToggle}
            className="border-primary bg-primary-light sticky top-0 z-10 flex w-full flex-col items-center gap-2 rounded-t-2xl border-b-2 px-8 py-3 md:hidden"
        >
            <span className="bg-primary-mid-light h-1 w-9 rounded-full" />
            <div className="flex w-full items-center gap-4">
                <div className="flex flex-1 flex-col items-center">
                    <span className="text-xs">座席数</span>
                    <span>{seatCount}席</span>
                </div>
                <div className="flex flex-1 flex-col items-center">
                    <span className="text-xs">合計金額</span>
                    <span className="text-primary text-lg font-bold">
                        ￥{totalFare.toLocaleString()}
                    </span>
                </div>
            </div>
        </button>
    );
}
