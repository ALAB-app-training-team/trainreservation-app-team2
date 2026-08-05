import type { ScheduleInfoDto } from '@/features/schedule/types/ScheduleInfoDto';
import type { SearchRequestDto } from '@/features/schedule/types/SearchRequestDto';
import type { SeatResponseDto } from '@/features/schedule/types/SeatResponseDto';

export type SelectSeatsLocationState = {
    scheduleInfoDto: ScheduleInfoDto;
    searchRequestDto: SearchRequestDto | null;
    selectedSeats: SeatResponseDto[];
};
