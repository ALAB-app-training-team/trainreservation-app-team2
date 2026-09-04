import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

type ReservationSheetHandleProps = {
    seatCount: number;
    totalFare: number;
    isOpen: boolean;
    onToggle: () => void;
};

export function ReservationSheetHandle({
    seatCount,
    totalFare,
    isOpen,
    onToggle,
}: ReservationSheetHandleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="border-primary bg-primary-light sticky top-0 z-10 flex w-full flex-col items-center gap-2 rounded-t-2xl border-b-2 px-8 py-3 md:hidden"
        >
            <span className="bg-primary-mid-light h-1 w-9 rounded-full" />
            <div className="flex w-full items-center gap-4">
                <div className="flex flex-col items-start">
                    <span className="text-xs">座席数</span>
                    <span className="text-sm font-bold">{seatCount}席</span>
                </div>
                <div className="flex flex-1 flex-col items-end">
                    <span className="text-xs">合計金額</span>
                    <span className="text-primary text-lg font-bold">
                        ￥{totalFare.toLocaleString()}
                    </span>
                </div>
                {isOpen ? <LuChevronDown /> : <LuChevronUp />}
            </div>
        </button>
    );
}
