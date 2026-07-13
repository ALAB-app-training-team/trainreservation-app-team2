import { Fragment } from 'react';

import { Seat } from '@/features/schedule/components/Seat';
import { useSeatsByTrainCar } from '@/features/schedule/hooks/useSeatsByTrainCar';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';

type SeatsByTrainCarProps = {
    selectTrainCarCd: string;
    seatsRequestDto: SeatsRequestDto;
    selectedSeats: SeatResponseDto[];
    limitSeats: number;
    handleSelectedSeats: (seat: SeatResponseDto) => void;
};

export function SeatsByTrainCar({
    seatsRequestDto,
    selectedSeats,
    limitSeats,
    handleSelectedSeats,
}: SeatsByTrainCarProps) {
    const { seats } = useSeatsByTrainCar(seatsRequestDto);

    const columns: string[] = Array.from(
        new Set(seats.map((seat) => seat.seatColumn)),
    ).sort();
    const rows: number[] = Array.from(
        new Set(seats.map((seat) => seat.seatNumber)),
    ).sort((a, b) => a - b);

    return (
        <>
            <div className="flex w-full flex-col items-start justify-center gap-4">
                <h1 className="!m-0 text-left !text-xl">
                    {seats[0].trainCarNumber}号車
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
                                        seat.seatColumn === column &&
                                        seat.seatNumber === row,
                                );
                                if (!seat) {
                                    return <div key={column + row} />;
                                }

                                const isSelected = selectedSeats.some(
                                    (selectedSeat) =>
                                        selectedSeat.seatCd === seat.seatCd &&
                                        selectedSeat.trainCarCd ===
                                            seatsRequestDto.trainCarCd,
                                );
                                const isMaxSelected =
                                    selectedSeats.length >= limitSeats;
                                return (
                                    <Seat
                                        key={seat.seatCd}
                                        seat={seat}
                                        onClick={handleSelectedSeats}
                                        disabled={
                                            seat.isReserved ||
                                            (isMaxSelected && !isSelected)
                                        }
                                        type={
                                            seat.isReserved
                                                ? 'unreservable'
                                                : isSelected
                                                  ? 'isSelected'
                                                  : isMaxSelected
                                                    ? 'unreservable'
                                                    : 'reservable'
                                        }
                                    />
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
                        <Seat type="unreservable" />
                        <div className="text-sm">予約済み</div>
                    </div>
                </div>
            </div>
        </>
    );
}
