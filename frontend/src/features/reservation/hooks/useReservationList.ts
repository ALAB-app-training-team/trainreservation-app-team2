import { useSuspenseQuery } from '@tanstack/react-query';

import { ENDPOINTS } from '@/api/routes';
import { getGuestLoginInfo } from '@/features/reservation/helpers/getGuestLoginInfo';
import type { ReservationListRequestDto } from '@/features/reservation/types/ReservationListRequestDto';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';
import apiClient from '@/shared/apis/apiClient';

export function useReservationList() {
    const getReservation = async (
        request: ReservationListRequestDto,
    ): Promise<ReservationResponseDto[]> => {
        const response = await apiClient.get<ReservationResponseDto[]>(
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

    const sortReservationList = (reservationList: ReservationResponseDto[]) => {
        return reservationList.sort(
            (a, b) =>
                new Date(a.rideDate).getDate() -
                    new Date(b.rideDate).getDate() ||
                a.departureTime.localeCompare(b.departureTime),
        );
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeReservations = sortReservationList(
        reservationList?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate >= now && !reservation.isDeleted;
        }),
    );

    const canceledReservations = sortReservationList(
        reservationList?.filter((reservation) => reservation.isDeleted),
    );

    const pastReservations = sortReservationList(
        reservationList?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate < now && !reservation.isDeleted;
        }),
    );

    return {
        activeReservations,
        canceledReservations,
        pastReservations,
        getReservation,
    };
}
