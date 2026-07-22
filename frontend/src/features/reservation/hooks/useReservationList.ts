import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import { getGuestLoginInfo } from '@/features/reservation/helpers/getGuestLoginInfo';
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

    const { data: reservationList = [] } = useSuspenseQuery({
        queryKey: ['reservationList'],
        queryFn: () => getReservation(getGuestLoginInfo()),
        refetchOnMount: true,
    });

    return { reservationList, getReservation };
}
