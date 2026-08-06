import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import { DEFAULT_SEAT_TYPE } from '@/features/schedule/constants/SeatTypeLabel';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';
import type { SeatTypeCd } from '@/features/schedule/types/SeatTypeCd';
import type { TrainCarFormationResponseDto } from '@/features/schedule/types/TrainCarFormationResponseDto';

export function useTrainCar(
    scheduleInfoDto: ScheduleInfoDto,
    reservedSeats?: ReservedSeatDto[],
) {
    const { data: trainCars } = useSuspenseQuery({
        queryKey: ['ScheduleCd', scheduleInfoDto.scheduleCd],
        queryFn: async () => {
            const response = await apiClient.get<
                TrainCarFormationResponseDto[]
            >(ENDPOINTS.TRAINCAR(scheduleInfoDto.scheduleCd));
            return response.data;
        },
    });

    const reservedFirstCar = trainCars?.find(
        (car) => car.trainCarNumber === reservedSeats?.[0]?.trainCarNumber,
    );
    const [activeSeatTypeCd, setActiveSeatTypeCd] = useState<SeatTypeCd>(
        () => (reservedFirstCar?.seatTypeCd as SeatTypeCd) ?? DEFAULT_SEAT_TYPE,
    );

    const filteredCars = useMemo(() => {
        if (!trainCars) return [];
        return trainCars.filter((car) => car.seatTypeCd === activeSeatTypeCd);
    }, [trainCars, activeSeatTypeCd]);

    const [selectedTrainCarCd, setSelectedTrainCarCd] = useState<string>(
        () => reservedFirstCar?.trainCarCd ?? '',
    );

    const activeTrainCarCd = useMemo(() => {
        const isCarInCurrentTab = filteredCars.some(
            (car) => car.trainCarCd === selectedTrainCarCd,
        );
        if (selectedTrainCarCd && isCarInCurrentTab) {
            return selectedTrainCarCd;
        }
        if (filteredCars && filteredCars.length > 0) {
            return filteredCars[0].trainCarCd;
        }
        return trainCars && trainCars.length > 0 ? trainCars[0].trainCarCd : '';
    }, [selectedTrainCarCd, filteredCars, trainCars]);

    const handleSeatTypeChange = (code: SeatTypeCd) => {
        setActiveSeatTypeCd(code);
    };

    const seatsRequestDto: SeatsRequestDto = useMemo(
        () => ({
            scheduleCd: scheduleInfoDto.scheduleCd,
            date: scheduleInfoDto.date,
            departureTime: scheduleInfoDto.departureTime,
            arrivalTime: scheduleInfoDto.arrivalTime,
            trainCarCd: activeTrainCarCd,
        }),
        [scheduleInfoDto, activeTrainCarCd],
    );

    return {
        trainCars,
        activeSeatTypeCd,
        filteredCars,
        activeTrainCarCd,
        handleSeatTypeChange,
        setSelectedTrainCarCd,
        seatsRequestDto,
    };
}
