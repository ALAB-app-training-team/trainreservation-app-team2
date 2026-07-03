import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationList() {
    const { data: reservations } = useSuspenseQuery({
        queryKey: ['reservationList'],
        queryFn: async () => {
            const response = await axios.get<ReservationResponseDto[]>(
                ENDPOINTS.RESERVATIONLIST(),
            );
            return response.data;
        },
    });

    return { reservations };
}
