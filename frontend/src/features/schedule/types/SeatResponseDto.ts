import type { FacilityDto } from '@/features/schedule/types/FacilityDto';
import type { SeatDto } from '@/features/schedule/types/SeatDto';

export type SeatResponseDto = {
    frontFacilities: FacilityDto;
    rearFacilities: FacilityDto;
    seats: SeatDto[];
};
