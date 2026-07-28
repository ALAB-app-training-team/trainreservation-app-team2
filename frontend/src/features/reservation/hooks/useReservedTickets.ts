import { useSuspenseQuery } from '@tanstack/react-query';

import { ENDPOINTS } from '@/api/routes';
import { getGuestLoginInfo } from '@/features/reservation/helpers/getGuestLoginInfo';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import apiClient from '@/shared/apis/apiClient';

export function useReservedTickets(reservationId: string) {
    const getReservedTickets = async (
        reservationId: string,
        guestLoginInfo: ReservationListRequestDto,
    ): Promise<ReservationResponseDto> => {
        const response = await apiClient.get<ReservationResponseDto>(
            ENDPOINTS.RESERVATION(reservationId),
            {
                params: {
                    reserverName: guestLoginInfo.reserverName,
                    reserverMail: guestLoginInfo.reserverMail,
                },
            },
        );
        return response.data;
    };

    const { data: reservedTickets } = useSuspenseQuery({
        queryKey: ['reservationTickets', reservationId],
        queryFn: () => getReservedTickets(reservationId, getGuestLoginInfo()),
        refetchOnMount: true,
    });

    return { reservedTickets };
}
