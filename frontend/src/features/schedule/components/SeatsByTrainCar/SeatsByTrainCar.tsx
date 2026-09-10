import { Fragment, useEffect, useMemo } from 'react';
import { FiArrowUp } from 'react-icons/fi';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { Seat } from '@/features/schedule/components/Seat';
import { TRAIN_DIRECTION } from '@/features/schedule/constants/TrainDirection';
import { useSeatsByTrainCar } from '@/features/schedule/hooks/useSeatsByTrainCar';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';
import { LIMIT } from '@/shared/constants/Limit';

type SeatsByTrainCarProps = {
    scheduleInfoDto: ScheduleInfoDto;
    seatsRequestDto: SeatsRequestDto;
    selectedSeats: SeatResponseDto[];
    handleSelectedSeats: (seat: SeatResponseDto) => void;
    checkReservedSeats: (seats: SeatResponseDto[]) => void;
    reservedSeats?: ReservedSeatDto[];
};

export function SeatsByTrainCar({
    scheduleInfoDto,
    seatsRequestDto,
    selectedSeats,
    reservedSeats,
    handleSelectedSeats,
    checkReservedSeats,
}: SeatsByTrainCarProps) {
    const { seats } = useSeatsByTrainCar(seatsRequestDto);
    const trainCarNumber = seats[0]?.trainCarNumber;
    const isDown = scheduleInfoDto.direction === TRAIN_DIRECTION.DOWN;
    const columns: string[] = Array.from(
        new Set(seats.map((seat) => seat.seatColumn)),
    ).sort();
    const rows: number[] = Array.from(
        new Set(seats.map((seat) => seat.seatNumber)),
    ).sort((a, b) => (isDown ? b - a : a - b));

    const layoutColumns: string[] = useMemo(() => {
        if (columns.length === 5) {
            return [
                columns[0],
                columns[1],
                columns[2],
                '',
                columns[3],
                columns[4],
            ];
        }
        if (columns.length === 4) {
            return [columns[0], columns[1], '', columns[2], columns[3]];
        }
        if (columns.length === 3) {
            return [columns[0], '', columns[1], columns[2]];
        }
        return columns;
    }, [columns]);

    const displayColumns: string[] = isDown
        ? [...layoutColumns].reverse()
        : layoutColumns;
    const isOwnReservedSeat = (seat: SeatResponseDto) =>
        reservedSeats?.some(
            (reserved) =>
                reserved.trainCarNumber === seat.trainCarNumber &&
                reserved.seatNumber === seat.seatNumber &&
                reserved.seatColumn === seat.seatColumn,
        ) ?? false;

    const displaySeats = seats.map((seat) =>
        isOwnReservedSeat(seat) ? { ...seat, isReserved: false } : seat,
    );

    useEffect(() => {
        checkReservedSeats(displaySeats);
    }, [displaySeats]);

    return (
        <>
            <div className="mx-auto flex flex-col items-center gap-4">
                {trainCarNumber !== undefined && (
                    <h2 className="sr-only" aria-live="polite">
                        {trainCarNumber}号車の座席
                    </h2>
                )}
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary-light flex items-center gap-2 rounded-full px-4 py-1 text-sm">
                        <FiArrowUp />
                        {`${scheduleInfoDto.arrivalStationName}駅方面（進行方向）`}
                    </div>
                    <div
                        className={`grid gap-2`}
                        style={{
                            gridTemplateColumns: `repeat(${displayColumns.length}, minmax(0, 1fr))`,
                        }}
                    >
                        {rows.map((row) => (
                            <Fragment key={row}>
                                {displayColumns.map((column, colIndex) => {
                                    if (column === '') {
                                        return (
                                            <div
                                                key={`aisle-${colIndex}-${row}`}
                                            />
                                        );
                                    }
                                    const seat = displaySeats.find(
                                        (seat) =>
                                            seat.seatColumn === column &&
                                            seat.seatNumber === row,
                                    );
                                    if (!seat) {
                                        return <div key={column + row} />;
                                    }

                                    const isSelected = selectedSeats.some(
                                        (selectedSeat) =>
                                            selectedSeat.seatCd ===
                                                seat.seatCd &&
                                            selectedSeat.trainCarCd ===
                                                seatsRequestDto.trainCarCd,
                                    );
                                    const isMaxSelected =
                                        selectedSeats.length >= LIMIT.SEATS;
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
                    <div className="bg-primary-light flex items-center gap-2 rounded-full px-4 py-1 text-sm">
                        <span>
                            {scheduleInfoDto.departureStationName}駅方面
                        </span>
                    </div>
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
