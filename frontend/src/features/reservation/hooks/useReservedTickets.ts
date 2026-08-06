import { useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import { getGuestLoginInfo } from '@/features/reservation/helpers/getGuestLoginInfo';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservedTickets(reservationId: string) {
    const getGuestReservedTickets = async (
        reservationId: string,
        guestLoginInfo: ReservationListRequestDto,
    ): Promise<ReservationResponseDto> => {
        const response = await apiClient.get<ReservationResponseDto>(
            ENDPOINTS.GUESTRESERVATION(reservationId),
            {
                params: {
                    reserverName: guestLoginInfo.reserverName,
                    reserverMail: guestLoginInfo.reserverMail,
                },
            },
        );
        return response.data;
    };

    const getAccountReservedTickets = async (
        reservationId: string,
    ): Promise<ReservationResponseDto> => {
        const response = await apiClient.get<ReservationResponseDto>(
            ENDPOINTS.RESERVATION(reservationId),
        );
        return response.data;
    };

    const accountInfo = localStorage.getItem('name');
    const guestLoginInfo = getGuestLoginInfo();

    const { data: reservedTickets } = useSuspenseQuery({
        queryKey: [
            'reservationTickets',
            reservationId,
            guestLoginInfo.reserverMail,
        ],
        queryFn: () =>
            accountInfo !== null
                ? getAccountReservedTickets(reservationId)
                : getGuestReservedTickets(reservationId, guestLoginInfo),
        refetchOnMount: true,
    });

    const getReservationTicket = async (
        reservationId: string,
        guestLoginInfo: ReservationListRequestDto,
    ): Promise<ReservationResponseDto> => {
        const response = await apiClient
            .get<ReservationResponseDto>(
                ENDPOINTS.GUESTRESERVATION(reservationId),
                {
                    params: {
                        reserverName: guestLoginInfo.reserverName,
                        reserverMail: guestLoginInfo.reserverMail,
                    },
                },
            )
            .then((response) => response.data);
        return response;
    };

    console.log('reservedTickets', reservedTickets);
    return { reservedTickets, getReservationTicket };
}
