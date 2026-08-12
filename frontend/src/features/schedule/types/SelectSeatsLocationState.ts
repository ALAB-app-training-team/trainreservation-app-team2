import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

export type SelectSeatsLocationState = {
    scheduleInfoDto: ScheduleInfoDto;
    searchRequestDto: SearchRequestDto | null;
    prevSelectedSeats?: SeatResponseDto[];
    reservedSeats?: ReservedSeatDto[];
    reservationId?: string;
    preChangeScheduleCd?: string;
    preChangeReservedSeats?: ReservedSeatDto[];
};
