import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

export type ReservationResponseDto = {
    reservationId?: string;
    trainTypeName: string;
    departureTime: string;
    departureStationName: string;
    arrivalTime: string;
    arrivalStationName: string;
    rideDate: string;
    isDeleted: boolean;
    reservedSeats: ReservedSeatDto[];
};
