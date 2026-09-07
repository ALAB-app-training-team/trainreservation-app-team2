import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type TotalSeatsFareProps = {
    selectedSeats: SeatResponseDto[];
    prevFare?: number;
};

export function TotalSeatsFare({
    selectedSeats,
    prevFare,
}: TotalSeatsFareProps) {
    const totalFare = selectedSeats.reduce((accumulator, currentValue) => {
        return currentValue.seatFare === null ||
            currentValue.seatFare === undefined
            ? accumulator
            : accumulator + currentValue.seatFare;
    }, 0);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
                <span>座席数合計：</span>
                <span>{`${selectedSeats.length}席`}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="my-0!">お支払い合計：</h2>
                <span className="text-primary-ink ml-auto text-xl font-bold">
                    {!prevFare && `￥${totalFare.toLocaleString()}`}
                </span>
            </div>
            {prevFare && (
                <div>
                    <div className="flex justify-between text-sm">
                        <span>変更前</span>
                        <span>￥{prevFare.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>変更後</span>
                        <span>￥{totalFare.toLocaleString()}</span>
                    </div>
                    <div className="text-primary-ink flex justify-between text-xl font-bold">
                        <span>差額</span>
                        <span>￥{(totalFare - prevFare).toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
