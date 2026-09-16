import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SeatDto } from '@/features/schedule/types/SeatDto';

export type SelectSeatsLocationState = {
    scheduleInfoDto: ScheduleInfoDto;
    searchRequestDto: SearchRequestDto | null;
    prevSelectedSeats?: SeatDto[];
    reservedSeats?: ReservedSeatDto[];
    reservationId?: string;
    isChanging: boolean;
    isFromReservedTicket: boolean;
    isBack: boolean;
    preChangeScheduleInfo?: ScheduleInfoDto;
    preChangeReservedSeats?: ReservedSeatDto[];
};
