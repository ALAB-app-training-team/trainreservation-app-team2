import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';

export type ScheduleSearchLocationState = {
    searchRequestDto: SearchRequestDto;
    isBack: boolean;
    reservationId: string;
};
