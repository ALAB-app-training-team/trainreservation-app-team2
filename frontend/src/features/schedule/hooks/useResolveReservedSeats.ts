import { useSuspenseQueries, useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';
import type { TrainCarFormationResponseDto } from '@/features/schedule/types/TrainCarFormationResponseDto';

export function useResolveReservedSeats(
    scheduleInfoDto: ScheduleInfoDto,
    reservedSeats?: ReservedSeatDto[],
): SeatResponseDto[] {
    const { data: trainCars } = useSuspenseQuery({
        queryKey: ['ScheduleCd', scheduleInfoDto.scheduleCd],
        queryFn: async () => {
            const response = await apiClient.get<
                TrainCarFormationResponseDto[]
            >(ENDPOINTS.TRAINCAR(scheduleInfoDto.scheduleCd));
            return response.data;
        },
    });

    const reservedCarNumbers = new Set(
        (reservedSeats ?? []).map((seat) => seat.trainCarNumber),
    );
    const targetCarCds = trainCars
        .filter((car) => reservedCarNumbers.has(car.trainCarNumber))
        .map((car) => car.trainCarCd);

    const results = useSuspenseQueries({
        queries: targetCarCds.map((trainCarCd) => {
            const dto: SeatsRequestDto = {
                scheduleCd: scheduleInfoDto.scheduleCd,
                date: scheduleInfoDto.date,
                departureTime: scheduleInfoDto.departureTime,
                arrivalTime: scheduleInfoDto.arrivalTime,
                trainCarCd,
            };
            return {
                queryKey: ['seat', dto.date, dto.scheduleCd, dto.trainCarCd],
                queryFn: async () => {
                    const response = await apiClient.get<SeatResponseDto[]>(
                        ENDPOINTS.SEATS_SELECT(),
                        { params: dto },
                    );
                    return response.data;
                },
            };
        }),
    });
    const allSeats = results.flatMap((result) => result.data);
    return allSeats.filter((seat) =>
        (reservedSeats ?? []).some(
            (reserved) =>
                reserved.trainCarNumber === seat.trainCarNumber &&
                reserved.seatNumber === seat.seatNumber &&
                reserved.seatColumn === seat.seatColumn,
        ),
    );
}
