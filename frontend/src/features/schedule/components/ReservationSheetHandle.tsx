import { useRef } from 'react';

const SWIPE_THRESHOLD_PX = 40;

type ReservationSheetHandleProps = {
    isOpen: boolean;
    seatCount: number;
    totalFare: number;
    onToggle: () => void;
};

export function ReservationSheetHandle({
    isOpen,
    seatCount,
    totalFare,
    onToggle,
}: ReservationSheetHandleProps) {
    const touchStartYRef = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (touchStartYRef.current === null) return;
        const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
        touchStartYRef.current = null;

        if (Math.abs(deltaY) <= SWIPE_THRESHOLD_PX) return;

        e.preventDefault();

        if (deltaY > 0 && !isOpen) {
            onToggle();
        } else if (deltaY < 0 && isOpen) {
            onToggle();
        }
    };

    return (
        <button
            data-testid="reservation-sheet"
            type="button"
            onClick={onToggle}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="border-primary-ink bg-primary-light sticky top-0 z-10 flex w-full touch-none flex-col items-center gap-2 rounded-t-2xl border-b-2 px-8 py-3 md:hidden"
        >
            <span className="bg-primary-mid-light h-1 w-9 rounded-full" />
            <div className="flex w-full items-center">
                <div className="flex flex-1 flex-col items-center">
                    <span className="text-xs">座席数</span>
                    <span>{seatCount}席</span>
                </div>
                <div className="flex flex-1 flex-col items-center">
                    <span className="text-xs">合計金額</span>
                    <span className="text-primary-ink text-lg font-bold">
                        ￥{totalFare.toLocaleString()}
                    </span>
                </div>
            </div>
        </button>
    );
}
