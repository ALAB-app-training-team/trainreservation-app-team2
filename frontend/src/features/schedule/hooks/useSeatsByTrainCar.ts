import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';
import type { SeatsRequestDto } from '@/features/schedule/types/SeatsRequestDto';

export function useSeatsByTrainCar(
    trainCarCd: string,
    seatsRequestDto: SeatsRequestDto,
) {
    const { data: seats } = useSuspenseQuery({
        queryKey: ['seat', seatsRequestDto],
        queryFn: async () => {
            const response = await axios.get<SeatResponseDto[]>(
                ENDPOINTS.SEATS_SELECT(trainCarCd),
                {
                    params: seatsRequestDto,
                },
            );
            return response.data;
        },
    });

    return { seats };
}
