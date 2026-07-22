import { useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import { getGuestLoginInfo } from '@/features/reservation/helpers/getGuestLoginInfo';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservedTickets(purchaseId: string) {
    const getReservedTickets = async (
        purchaseId: string,
        guestLoginInfo: ReservationListRequestDto,
    ): Promise<ReservationResponseDto> => {
        const response = await axios.get<ReservationResponseDto>(
            ENDPOINTS.RESERVATION(purchaseId),
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
        queryKey: ['reservationTickets', purchaseId],
        queryFn: () => getReservedTickets(purchaseId, getGuestLoginInfo()),
        refetchOnMount: true,
    });

    return { reservedTickets };
}
