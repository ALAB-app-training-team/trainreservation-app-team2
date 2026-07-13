import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationList() {
    const getReservation = async (
        request: ReservationListRequestDto,
    ): Promise<ReservationResponseDto[]> => {
        const response = await axios.get<ReservationResponseDto[]>(
            ENDPOINTS.RESERVATION(),
            {
                params: request,
            },
        );
        return response.data;
    };

    return { getReservation };
}
