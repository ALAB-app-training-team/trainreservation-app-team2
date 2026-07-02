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
        queryKey: ['ScheduleCd', scheduleInfoDto.schedule_cd],
        queryFn: async () => {
            const response = await axios.get<TrainCarFormationResponseDto[]>(
                ENDPOINTS.TRAINCAR(),
                {
                    params: { schedule_cd: scheduleInfoDto.schedule_cd },
                },
            );
            return response.data;
        },
    });

    const [activeSeatTypeCd, setActiveSeatTypeCd] =
        useState<SeatTypeCd>(DEFAULT_SEAT_TYPE);

    const filteredCars = useMemo(() => {
        if (!trainCars) return [];
        return trainCars.filter((car) => car.seat_type_cd === activeSeatTypeCd);
    }, [trainCars, activeSeatTypeCd]);

    const [selectedTrainCarCd, setSelectedTrainCarCd] = useState<string>('');

    const activeTrainCarCd = useMemo(() => {
        const isCarInCurrentTab = filteredCars.some(
            (car) => car.train_car_cd === selectedTrainCarCd,
        );

        if (selectedTrainCarCd && isCarInCurrentTab) {
            return selectedTrainCarCd;
        }
        if (filteredCars && filteredCars.length > 0) {
            return filteredCars[0].train_car_cd;
        }
        return trainCars && trainCars.length > 0
            ? trainCars[0].train_car_cd
            : '';
    }, [selectedTrainCarCd, filteredCars, trainCars]);

    const handleSeatTypeChange = (code: SeatTypeCd) => {
        setActiveSeatTypeCd(code);
    };

    const seatsRequestDto: SeatsRequestDto = useMemo(
        () => ({
            schedule_cd: scheduleInfoDto.schedule_cd,
            date: scheduleInfoDto.date,
            departure_time: scheduleInfoDto.departure_time,
            arrival_time: scheduleInfoDto.arrival_time,
            train_car_cd: activeTrainCarCd,
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
