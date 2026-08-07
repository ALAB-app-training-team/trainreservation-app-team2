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
            <div className="flex items-center gap-2 text-sm">
                <div>座席数合計：</div>
                <div className="ml-auto">{`${selectedSeats.length}席`}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <h1 className="!mt-0 !mb-0 !text-lg">お支払い合計：</h1>
                <div className="text-primary ml-auto text-xl font-bold">
                    {prevFare
                        ? `￥${totalFare.toLocaleString()} - ￥${prevFare?.toLocaleString()} = ￥${(totalFare - prevFare).toLocaleString()}`
                        : `￥${totalFare.toLocaleString()}`}
                </div>
            </div>
        </div>
    );
}
