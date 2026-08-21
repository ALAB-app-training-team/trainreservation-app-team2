import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

export type ReservationResponseDto = {
    reservationId: string;
    scheduleCd: string;
    trainTypeName: string;
    departureTime: string;
    departureStationCd: string;
    departureStationName: string;
    arrivalTime: string;
    arrivalStationCd: string;
    arrivalStationName: string;
    rideDate: string;
    isDeleted: boolean;
    reservedSeats: ReservedSeatDto[];
    isReserverMatched: boolean;
};
