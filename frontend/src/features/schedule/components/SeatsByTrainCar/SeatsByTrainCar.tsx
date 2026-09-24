import { useEffect, useMemo } from 'react';
import { FiArrowUp } from 'react-icons/fi';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { FacilityByTrainCar } from '@/features/schedule/components/FacilityByTrainCar';
import { Seat } from '@/features/schedule/components/Seat';
import { TRAIN_DIRECTION } from '@/features/schedule/constants/TrainDirection';
import { useSeatsByTrainCar } from '@/features/schedule/hooks/useSeatsByTrainCar';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatDto } from '@/features/schedule/types/SeatDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';
import { LIMIT } from '@/shared/constants/Limit';
import type { RovingPosition } from '@/shared/hooks/useRovingFocus';
import { useRovingFocus } from '@/shared/hooks/useRovingFocus';

type SeatsByTrainCarProps = {
    scheduleInfoDto: ScheduleInfoDto;
    seatsRequestDto: SeatsRequestDto;
    selectedSeats: SeatDto[];
    handleSelectedSeats: (seat: SeatDto) => void;
    checkReservedSeats: (seats: SeatDto[]) => void;
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
    const { seats, frontFacilities, rearFacilities } =
        useSeatsByTrainCar(seatsRequestDto);
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
    const displaySeats = useMemo(() => {
        const isOwnReservedSeat = (seat: SeatDto) =>
            reservedSeats?.some(
                (reserved) =>
                    reserved.trainCarNumber === seat.trainCarNumber &&
                    reserved.seatNumber === seat.seatNumber &&
                    reserved.seatColumn === seat.seatColumn,
            ) ?? false;
        return seats.map((seat) =>
            isOwnReservedSeat(seat) ? { ...seat, isReserved: false } : seat,
        );
    }, [seats, reservedSeats]);

    useEffect(() => {
        checkReservedSeats(displaySeats);
    }, [displaySeats]);

    const isMaxSelected = selectedSeats.length >= LIMIT.SEATS;
    const isSeatSelected = (seat: SeatDto) =>
        selectedSeats.some(
            (selectedSeat) =>
                selectedSeat.seatCd === seat.seatCd &&
                selectedSeat.trainCarCd === seatsRequestDto.trainCarCd,
        );
    const isSeatDisabled = (seat: SeatDto) =>
        seat.isReserved || (isMaxSelected && !isSeatSelected(seat));

    const seatRowList: (SeatDto | undefined)[][] = rows.map((row) =>
        displayColumns.map((column) =>
            column === ''
                ? undefined
                : displaySeats.find(
                      (seat) =>
                          seat.seatColumn === column && seat.seatNumber === row,
                  ),
        ),
    );

    const seatPositionMap = new Map<string, RovingPosition>();
    seatRowList.forEach((rowSeats, rowIndex) =>
        rowSeats.forEach((seat, colIndex) => {
            if (seat && !isSeatDisabled(seat)) {
                seatPositionMap.set(seat.seatCd, {
                    row: rowIndex,
                    col: colIndex,
                });
            }
        }),
    );
    const { getItemProps: getSeatItemProps } = useRovingFocus({
        keys: [...seatPositionMap.keys()],
        orientation: 'grid',
        getPosition: (seatCd) => seatPositionMap.get(seatCd),
    });

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
                    <FacilityByTrainCar
                        isFront={true}
                        facilities={!isDown ? frontFacilities : rearFacilities}
                    />
                    <div
                        role="grid"
                        aria-label="座席"
                        className="flex flex-col gap-2"
                    >
                        {seatRowList.map((rowSeats, rowIndex) => (
                            <div
                                key={rows[rowIndex]}
                                role="row"
                                className="grid gap-2"
                                style={{
                                    gridTemplateColumns: `repeat(${displayColumns.length}, minmax(0, 1fr))`,
                                }}
                            >
                                {rowSeats.map((seat, colIndex) => {
                                    if (!seat) {
                                        return (
                                            <div
                                                key={`empty-${rowIndex}-${colIndex}`}
                                                role="presentation"
                                            />
                                        );
                                    }
                                    const isSelected = isSeatSelected(seat);
                                    return (
                                        <div
                                            key={seat.seatCd}
                                            role="gridcell"
                                            className="flex"
                                        >
                                            <Seat
                                                seat={seat}
                                                onClick={handleSelectedSeats}
                                                disabled={isSeatDisabled(seat)}
                                                type={
                                                    seat.isReserved
                                                        ? 'unreservable'
                                                        : isSelected
                                                          ? 'isSelected'
                                                          : isMaxSelected
                                                            ? 'unreservable'
                                                            : 'reservable'
                                                }
                                                itemProps={getSeatItemProps(
                                                    seat.seatCd,
                                                )}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                    <FacilityByTrainCar
                        isFront={false}
                        facilities={isDown ? frontFacilities : rearFacilities}
                    />
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
