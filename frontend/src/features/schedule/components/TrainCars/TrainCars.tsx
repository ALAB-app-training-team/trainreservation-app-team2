import { Suspense } from 'react';

import { SeatsByTrainCar } from '@/features/schedule/components/SeatsByTrainCar/SeatsByTrainCar';
import { SeatsByTrainCarSkeleton } from '@/features/schedule/components/SeatsByTrainCar/SeatsByTrainCarSkeleton';
import { SEAT_TYPE_LABELS } from '@/features/schedule/constants/SeatTypeLabel';
import { useTrainCar } from '@/features/schedule/hooks/useTrainCar';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatTypeCd } from '@/features/schedule/types/SeatTypeCd';

type TrainCarsProps = {
    scheduleInfoDto: ScheduleInfoDto;
    selectedSeats: SeatResponseDto[];
    limitSeats: number;
    handleSelectedSeats: (seat: SeatResponseDto) => void;
};

export function TrainCars({
    scheduleInfoDto,
    selectedSeats,
    limitSeats,
    handleSelectedSeats,
}: TrainCarsProps) {
    const {
        trainCars,
        activeSeatTypeCd,
        filteredCars,
        activeTrainCarCd,
        handleSeatTypeChange,
        setSelectedTrainCarCd,
        seatsRequestDto,
    } = useTrainCar(scheduleInfoDto);

    return (
        <div className="border-primary-light flex flex-col gap-8 rounded-2xl border-2 p-8">
            <div className="bg-primary-light flex w-full rounded-full p-1">
                {(Object.keys(SEAT_TYPE_LABELS) as SeatTypeCd[]).map((code) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => handleSeatTypeChange(code)}
                        className={`flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-all duration-200 ${
                            activeSeatTypeCd === code
                                ? 'cursor-default bg-white font-semibold text-gray-900'
                                : 'cursor-pointer hover:text-gray-900'
                        }`}
                    >
                        {trainCars?.find(
                            (car) =>
                                car.seatTypeCd.toUpperCase() ===
                                code.toUpperCase(),
                        )?.trainCarTypeName || SEAT_TYPE_LABELS[code]}
                    </button>
                ))}
            </div>
            {filteredCars.length > 0 ? (
                <>
                    <div className="text-left">号車を選択</div>
                    <div className="flex scrollbar-thin gap-2 overflow-x-auto">
                        {filteredCars.map((car) => (
                            <button
                                key={car.trainCarNumber}
                                type="button"
                                onClick={() =>
                                    setSelectedTrainCarCd(car.trainCarCd)
                                }
                                className={`flex h-20 min-w-[80px] flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-200 ${
                                    activeTrainCarCd === car.trainCarCd
                                        ? 'border-primary bg-primary-light text-primary font-bold shadow-sm'
                                        : 'border-primary-light hover:bg-primary-light'
                                }`}
                            >
                                <span className="font-bold">
                                    {car.trainCarNumber}
                                </span>
                            </button>
                        ))}
                    </div>
                    <Suspense fallback={<SeatsByTrainCarSkeleton />}>
                        <SeatsByTrainCar
                            seatsRequestDto={seatsRequestDto}
                            selectedSeats={selectedSeats}
                            handleSelectedSeats={handleSelectedSeats}
                        />
                    </Suspense>
                </>
            ) : (
                <>
                    <p className="py-4 pl-2 text-sm text-gray-400">
                        該当する列車がありません
                    </p>
                </>
            )}
        </div>
    );
}
