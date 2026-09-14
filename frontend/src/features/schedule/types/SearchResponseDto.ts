import type { ScheduleDto } from '@/features/schedule/types/ScheduleDto';

export type SearchResponseDto = {
    reservedFare: number | null;
    greenFare: number | null;
    gcFare: number | null;
    schedules: ScheduleDto[];
};
