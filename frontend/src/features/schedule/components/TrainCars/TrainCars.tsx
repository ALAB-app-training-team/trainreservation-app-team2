import { Suspense } from 'react';

import { SeatsByTrainCar } from '@/features/schedule/components/SeatsByTrainCar/SeatsByTrainCar';
import { SeatsByTrainCarSkeleton } from '@/features/schedule/components/SeatsByTrainCar/SeatsByTrainCarSkeleton';
<<<<<<< HEAD
import {
    SEAT_TYPE_LABELS,
    type SeatTypeCd,
} from '@/features/schedule/constants/seatType';
import { useTrainCar } from '@/features/schedule/hooks/useTrainCar';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
=======
import { SEAT_TYPE_LABELS } from '@/features/schedule/constants/SeatTypeLabel';
import { useTrainCar } from '@/features/schedule/hooks/useTrainCar';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatTypeCd } from '@/features/schedule/types/SeatTypeCd';
>>>>>>> ffb549f21578c91a63a1e6630eb03ddef83c2f66

type TrainCarsProps = {
    scheduleInfoDto: ScheduleInfoDto;
    selectedSeats: SeatResponseDto[];
    handleSelectedSeats: (seat: SeatResponseDto) => void;
};

export function TrainCars({
    scheduleInfoDto,
    selectedSeats,
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
        <div className="border-primary-light rounded-3xl border-2 bg-white p-8 shadow-sm">
            <div className="mb-8 flex w-full space-x-1 rounded-full bg-gray-100 p-1">
                {(Object.keys(SEAT_TYPE_LABELS) as SeatTypeCd[]).map((code) => (
                    <button
                        key={code}
                        type="button"
                        onClick={() => handleSeatTypeChange(code)}
                        className={`flex-1 rounded-full px-5 py-3 text-center text-sm font-medium transition-all duration-200 ${
                            activeSeatTypeCd === code
                                ? 'bg-white font-semibold text-gray-900 shadow-md'
                                : 'text-gray-500 hover:text-gray-900'
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
            <div className="mb-4 w-full text-left text-base text-gray-900">
                号車を選択
            </div>
            <div className="mb-8 flex scrollbar-thin space-x-3 overflow-x-auto pb-4">
                {filteredCars.map((car) => (
                    <button
                        key={car.trainCarNumber}
                        type="button"
                        onClick={() => setSelectedTrainCarCd(car.trainCarCd)}
                        className={`flex h-20 min-w-[80px] flex-col items-center justify-center rounded-2xl border-2 p-3 transition-all duration-200 ${
                            activeTrainCarCd === car.trainCarCd
                                ? 'border-primary bg-primary-light text-primary font-bold shadow-sm'
                                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <span className="text-base font-bold">
                            {car.trainCarNumber}
                        </span>
                    </button>
                ))}

                {filteredCars.length === 0 && (
                    <p className="py-4 pl-2 text-sm text-gray-400">
                        該当する列車がありません
                    </p>
                )}
            </div>

            {filteredCars.length > 0 && (
                <Suspense fallback={<SeatsByTrainCarSkeleton />}>
                    <SeatsByTrainCar
                        seatsRequestDto={seatsRequestDto}
                        selectedSeats={selectedSeats}
                        handleSelectedSeats={handleSelectedSeats}
                    />
                </Suspense>
            )}
        </div>
    );
}
