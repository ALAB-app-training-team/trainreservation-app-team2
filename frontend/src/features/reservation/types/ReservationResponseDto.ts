import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';

export type ReservationResponseDto = {
    trainTypeName: string;
    departure_time: string;
    departureStationName: string;
    arrival_time: string;
    arrivalStationName: string;
    ride_date: string;
    reservedSeats: ReservedSeatDto[];
};
