import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

export type ReservationListResponseDto = {
    trainTypeName: string;
    departureTime: string;
    departureStationName: string;
    arrivalStationName: string;
    rideDate: string;
    seats: ReservedSeatDto[];
};
