import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

export type ReservationResponseDto = {
    trainTypeName: string;
    departureTime: string;
    departureStationName: string;
    arrivalTime: string;
    arrivalStationName: string;
    rideDate: string;
    reservedSeats: ReservedSeatDto[];
};
