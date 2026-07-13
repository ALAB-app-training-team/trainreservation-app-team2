import axios from 'axios';

import { ENDPOINTS } from '@/api/routes';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservedTickets() {
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

    return { getReservedTickets };
}
