import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo, useState } from 'react';

import { ENDPOINTS } from '@/api/routes';
import type { SeatTypeCd } from '@/features/schedule/constants/seatType';
import { DEFAULT_SEAT_TYPE } from '@/features/schedule/constants/seatType';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';
import type { TrainCarFormationResponseDto } from '@/features/schedule/types/TrainCarFormationResponseDto';

export function useTrainCar(scheduleInfoDto: ScheduleInfoDto) {
    const { data: trainCars } = useSuspenseQuery({
        queryKey: ['ScheduleCd', scheduleInfoDto.scheduleCd],
        queryFn: async () => {
            const response = await axios.get<TrainCarFormationResponseDto[]>(
                ENDPOINTS.TRAINCAR(),
                {
                    params: { scheduleCd: scheduleInfoDto.scheduleCd },
                },
            );
            return response.data;
        },
    });

    const [activeSeatTypeCd, setActiveSeatTypeCd] =
        useState<SeatTypeCd>(DEFAULT_SEAT_TYPE);

    const filteredCars = useMemo(() => {
        if (!trainCars) return [];
        return trainCars.filter((car) => car.seatTypeCd === activeSeatTypeCd);
    }, [trainCars, activeSeatTypeCd]);

    const [selectedTrainCarCd, setSelectedTrainCarCd] = useState<string>('');

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
