import { useSuspenseQuery } from '@tanstack/react-query';

import apiClient from '@/api/apiClient';
import { ENDPOINTS } from '@/api/routes';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationList() {
    const getReservation = async (): Promise<ReservationResponseDto[]> => {
        const response = await apiClient.get<ReservationResponseDto[]>(
            ENDPOINTS.RESERVATION(),
        );
        return response.data;
    };

    const { data: reservationList = [] } = useSuspenseQuery({
        queryKey: ['reservationList'],
        queryFn: () => getReservation(),
        refetchOnMount: true,
    });

    const sortReservationsAsc = (reservationList: ReservationResponseDto[]) => {
        return reservationList.sort(
            (a, b) =>
                new Date(a.rideDate).getTime() -
                    new Date(b.rideDate).getTime() ||
                a.departureTime.localeCompare(b.departureTime),
        );
    };

    const sortReservationsDesc = (
        reservationList: ReservationResponseDto[],
    ) => {
        return reservationList.sort(
            (a, b) =>
                new Date(b.rideDate).getTime() -
                    new Date(a.rideDate).getTime() ||
                a.departureTime.localeCompare(b.departureTime),
        );
    };

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeReservations = sortReservationsAsc(
        reservationList?.filter((reservation) => {
            const departureDate = new Date(reservation.rideDate);
            return departureDate >= now && !reservation.isDeleted;
        }),
    );

    const canceledReservations = sortReservationsDesc(
        reservationList?.filter((reservation) => reservation.isDeleted),
    );

    const pastReservations = sortReservationsDesc(
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
