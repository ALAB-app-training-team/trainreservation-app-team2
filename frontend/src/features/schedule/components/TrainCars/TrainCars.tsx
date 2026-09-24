import { Suspense } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { SeatsByTrainCar } from '@/features/schedule/components/SeatsByTrainCar/SeatsByTrainCar';
import { SeatsByTrainCarSkeleton } from '@/features/schedule/components/SeatsByTrainCar/SeatsByTrainCarSkeleton';
import { SEAT_TYPE_LABELS } from '@/features/schedule/constants/SeatTypeLabel';
import { useScrollOverflow } from '@/features/schedule/hooks/useScrollOverflow';
import { useTrainCar } from '@/features/schedule/hooks/useTrainCar';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatDto } from '@/features/schedule/types/SeatDto';
import type { SeatTypeCd } from '@/features/schedule/types/SeatTypeCd';
import { ERROR_MESSAGE } from '@/shared/constants/ErrorMessages';
import { useRovingFocus } from '@/shared/hooks/useRovingFocus';

type TrainCarsProps = {
    scheduleInfoDto: ScheduleInfoDto;
    selectedSeats: SeatDto[];
    handleSelectedSeats: (seat: SeatDto) => void;
    checkReservedSeats: (seats: SeatDto[]) => void;
    reservedSeats?: ReservedSeatDto[];
};

const SEAT_TYPE_CODES = Object.keys(SEAT_TYPE_LABELS) as SeatTypeCd[];
const SEAT_TYPE_PANEL_ID = 'seat-type-panel';
const seatTypeTabId = (code: SeatTypeCd) => `seat-type-tab-${code}`;

export function TrainCars({
    scheduleInfoDto,
    selectedSeats,
    reservedSeats,
    handleSelectedSeats,
    checkReservedSeats,
}: TrainCarsProps) {
    const {
        trainCars,
        activeSeatTypeCd,
        filteredCars,
        activeTrainCarCd,
        handleSeatTypeChange,
        setSelectedTrainCarCd,
        seatsRequestDto,
    } = useTrainCar(scheduleInfoDto, reservedSeats);
    const {
        ref: trainCarListRef,
        canScrollLeft,
        canScrollRight,
    } = useScrollOverflow([filteredCars.length]);

    const { getItemProps: getSeatTypeTabProps } = useRovingFocus({
        keys: SEAT_TYPE_CODES,
        orientation: 'horizontal',
        canLoop: true,
        activeKey: activeSeatTypeCd,
        onNavigate: handleSeatTypeChange,
    });

    const { getItemProps: getTrainCarRadioProps } = useRovingFocus({
        keys: filteredCars.map((car) => car.trainCarCd),
        orientation: 'both',
        canLoop: true,
        activeKey: activeTrainCarCd,
        onNavigate: setSelectedTrainCarCd,
    });

    return (
        <div className="border-primary-light flex w-full flex-col gap-8 rounded-2xl border-2 p-8">
            <div
                role="tablist"
                aria-label="座席種別"
                className="bg-primary-light flex w-full rounded-full p-1"
            >
                {SEAT_TYPE_CODES.map((code) => {
                    const isActive = activeSeatTypeCd === code;
                    return (
                        <button
                            key={code}
                            type="button"
                            role="tab"
                            id={seatTypeTabId(code)}
                            aria-selected={isActive}
                            aria-controls={SEAT_TYPE_PANEL_ID}
                            onClick={() => handleSeatTypeChange(code)}
                            className={`flex-1 rounded-full px-4 py-2 text-center text-xs font-medium transition-all duration-200 ${
                                isActive
                                    ? 'bg-surface text-fg cursor-default font-semibold'
                                    : 'hover:text-fg cursor-pointer'
                            }`}
                            {...getSeatTypeTabProps(code)}
                        >
                            {trainCars?.find(
                                (car) =>
                                    car.seatTypeCd.toUpperCase() ===
                                    code.toUpperCase(),
                            )?.trainCarTypeName || SEAT_TYPE_LABELS[code]}
                        </button>
                    );
                })}
            </div>
            <div
                role="tabpanel"
                id={SEAT_TYPE_PANEL_ID}
                aria-labelledby={seatTypeTabId(activeSeatTypeCd)}
                className="flex flex-col gap-8"
            >
                {filteredCars.length > 0 ? (
                    <>
                        <div className="relative">
                            <div
                                ref={trainCarListRef}
                                role="radiogroup"
                                aria-label="号車"
                                className="flex scroll-px-12 gap-2 overflow-x-auto"
                                data-testid="train-cars"
                                onFocus={(e) =>
                                    e.target.scrollIntoView({
                                        block: 'nearest',
                                        inline: 'nearest',
                                    })
                                }
                            >
                                {filteredCars.map((car) => {
                                    const isActive =
                                        activeTrainCarCd === car.trainCarCd;
                                    return (
                                        <button
                                            key={car.trainCarNumber}
                                            type="button"
                                            role="radio"
                                            aria-checked={isActive}
                                            onClick={() =>
                                                setSelectedTrainCarCd(
                                                    car.trainCarCd,
                                                )
                                            }
                                            className={`flex h-16 min-w-16 flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-200 md:h-20 md:min-w-20 ${
                                                isActive
                                                    ? 'border-primary-ink bg-primary-light text-primary-ink font-bold shadow-sm'
                                                    : 'border-primary-light hover:bg-primary-light'
                                            }`}
                                            {...getTrainCarRadioProps(
                                                car.trainCarCd,
                                            )}
                                        >
                                            <span className="text-xl font-bold">
                                                {car.trainCarNumber}
                                            </span>
                                            <span className="text-sm">
                                                号車
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {canScrollLeft && (
                                <div
                                    aria-hidden="true"
                                    data-testid="train-cars-scroll-hint-left"
                                    className="from-surface pointer-events-none absolute inset-y-0 left-0 flex w-12 items-center justify-start bg-gradient-to-r pl-1"
                                >
                                    <IoChevronBack className="text-primary-ink size-5" />
                                </div>
                            )}
                            {canScrollRight && (
                                <div
                                    aria-hidden="true"
                                    data-testid="train-cars-scroll-hint"
                                    className="from-surface pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-end bg-gradient-to-l pr-1"
                                >
                                    <IoChevronForward className="text-primary-ink size-5" />
                                </div>
                            )}
                        </div>
                        <Suspense fallback={<SeatsByTrainCarSkeleton />}>
                            <SeatsByTrainCar
                                scheduleInfoDto={scheduleInfoDto}
                                seatsRequestDto={seatsRequestDto}
                                selectedSeats={selectedSeats}
                                handleSelectedSeats={handleSelectedSeats}
                                checkReservedSeats={checkReservedSeats}
                                reservedSeats={reservedSeats}
                            />
                        </Suspense>
                    </>
                ) : (
                    <p className="text-fg-muted py-4 pl-2 text-sm">
                        {ERROR_MESSAGE.NO_TRAIN}
                    </p>
                )}
            </div>
        </div>
    );
}
