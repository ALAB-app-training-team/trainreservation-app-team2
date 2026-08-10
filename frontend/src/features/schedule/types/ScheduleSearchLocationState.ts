import type { ReservedSeatDto } from '@/features/reservation/types/ReservedSeatDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';

export type ScheduleSearchLocationState = {
    searchRequestDto: SearchRequestDto;
    isBack: boolean;
    reservationId: string;
    reservedSeats: ReservedSeatDto[];
    preChangeScheduleCd: string;
};
