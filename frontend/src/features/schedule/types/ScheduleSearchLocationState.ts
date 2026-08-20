import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';

export type ScheduleSearchLocationState = {
    searchRequestDto: SearchRequestDto;
    isBack: boolean;
    reservationId: string;
    isChanging: boolean;
    isFromReservedTicket: boolean;
    reservedSeats: ReservedSeatDto[];
    preChangeScheduleInfo: ScheduleInfoDto;
};
