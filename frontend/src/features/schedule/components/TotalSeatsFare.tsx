import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

type TotalSeatsFareProps = {
    selectedSeats: SeatResponseDto[];
};

export function TotalSeatsFare({ selectedSeats }: TotalSeatsFareProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
                <div>座席数合計：</div>
                <div className="ml-auto">{`${selectedSeats.length}席`}</div>
            </div>
            <div className="flex items-center gap-2">
                <h1 className="!mt-0 !mb-0 !text-lg">お支払い合計：</h1>
                <div className="text-primary ml-auto text-xl font-bold">{`￥${selectedSeats
                    .reduce((accumulator, currentValue) => {
                        return accumulator + currentValue.seatFare;
                    }, 0)
                    .toLocaleString()}`}</div>
            </div>
        </div>
    );
}
