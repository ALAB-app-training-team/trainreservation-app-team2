import { Fragment } from 'react';

import { Seat } from '@/features/schedule/components/Seat';
import { useSeatsByTrainCar } from '@/features/schedule/hooks/useSeatsByTrainCar';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';

type SeatsByTrainCarProps = {
    seatsRequestDto: SeatsRequestDto;
    selectedSeats: SeatResponseDto[];
    handleSelectedSeats: (seat: SeatResponseDto) => void;
};

export function SeatsByTrainCar({
    seatsRequestDto,
    selectedSeats,
    handleSelectedSeats,
}: SeatsByTrainCarProps) {
    const { seats } = useSeatsByTrainCar(seatsRequestDto);

    const columns: string[] = Array.from(
        new Set(seats.map((seat) => seat.seat_column)),
    ).sort();
    const rows: number[] = Array.from(
        new Set(seats.map((seat) => seat.seat_number)),
    ).sort((a, b) => a - b);

    return (
        <>
            <div className="flex w-full flex-col items-start justify-center gap-4">
                <h1 className="!m-0 text-left !text-xl">
                    {seats[0].train_car_number}号車
                </h1>
                <div
                    className={`grid gap-2`}
                    style={{
                        gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))`,
                    }}
                >
                    {rows.map((row) => (
                        <Fragment key={row}>
                            <div className="flex items-center justify-center">
                                {row}
                            </div>
                            {columns.map((column) => {
                                const seat = seats.find(
                                    (seat) =>
                                        seat.seat_column === column &&
                                        seat.seat_number === row,
                                );
                                return seat ? (
                                    <Seat
                                        key={seat.seat_cd}
                                        seat={seat}
                                        onClick={handleSelectedSeats}
                                        disabled={seat.is_reserved}
                                        type={
                                            seat.is_reserved
                                                ? 'isReserved'
                                                : selectedSeats.some(
                                                        (selectedSeat) =>
                                                            selectedSeat.seat_cd ===
                                                                seat.seat_cd &&
                                                            selectedSeat.train_car_cd ===
                                                                seatsRequestDto.train_car_cd,
                                                    )
                                                  ? 'isSelected'
                                                  : 'reservable'
                                        }
                                    />
                                ) : (
                                    <div key={column + row} />
                                );
                            })}
                        </Fragment>
                    ))}
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                        <Seat type="reservable" />
                        <div className="text-sm">空席</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Seat type="isSelected" />
                        <div className="text-sm">選択中</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Seat type="isReserved" />
                        <div className="text-sm">予約済み</div>
                    </div>
                </div>
            </div>
        </>
    );
}
