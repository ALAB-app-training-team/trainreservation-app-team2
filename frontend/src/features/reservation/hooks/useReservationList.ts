// import { useSuspenseQuery } from '@tanstack/react-query';
// import axios from 'axios';

// import { ENDPOINTS } from '@/api/routes';
import type { ReservationResponseDto } from '@/features/reservation/types/ReservationResponseDto';

export function useReservationList() {
    // const { data: reservations } = useSuspenseQuery({
    //     queryKey: ['reservationList'],
    //     queryFn: async () => {
    //         const response = await axios.get<ReservationResponseDto[]>(
    //             ENDPOINTS.RESERVATIONLIST(),
    //         );
    //         return response.data;
    //     },
    // });

    return { reservations };
}

const reservations: ReservationResponseDto[] = [
    {
        purchaseId: '521390fb-8077-4383-831d-9b321739ad11',
        trainTypeName: 'やまびこ51号',
        departureTime: '06:00:00',
        departureStationName: '東京',
        arrivalTime: '07:00:00',
        arrivalStationName: '仙台',
        rideDate: '2026-07-10',
        reservedSeats: [
            {
                trainCarTypeName: '指定席',
                trainCarNumber: 1,
                seatNumber: 1,
                seatColumn: 'A',
                codeToken: '4d661a82-044b-45a7-8799-978b5a5e2a5f',
            },
            {
                trainCarTypeName: '指定席',
                trainCarNumber: 1,
                seatNumber: 2,
                seatColumn: 'B',
                codeToken: 'ee38f696-a063-4bcd-a88a-00a9ff925fc2',
            },
            {
                trainCarTypeName: '指定席',
                trainCarNumber: 1,
                seatNumber: 3,
                seatColumn: 'C',
                codeToken: 'bd07ab55-3fde-43a6-9073-0d334f4e1a3e',
            },
        ],
    },
    {
        purchaseId: '521390fb-8077-4383-831d-9b321739ad11',
        trainTypeName: 'やまびこ51号',
        departureTime: '06:00:00',
        departureStationName: '東京',
        arrivalTime: '07:00:00',
        arrivalStationName: '仙台',
        rideDate: '2026-07-02',
        reservedSeats: [
            {
                trainCarTypeName: '指定席',
                trainCarNumber: 1,
                seatNumber: 1,
                seatColumn: 'A',
                codeToken: '4d661a82-044b-45a7-8799-978b5a5e2a5f',
            },
            {
                trainCarTypeName: '指定席',
                trainCarNumber: 1,
                seatNumber: 2,
                seatColumn: 'B',
                codeToken: 'ee38f696-a063-4bcd-a88a-00a9ff925fc2',
            },
            {
                trainCarTypeName: '指定席',
                trainCarNumber: 1,
                seatNumber: 3,
                seatColumn: 'C',
                codeToken: 'bd07ab55-3fde-43a6-9073-0d334f4e1a3e',
            },
        ],
    },
];
