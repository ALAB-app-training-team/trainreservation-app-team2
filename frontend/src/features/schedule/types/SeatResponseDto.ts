import type { FacilityDto } from '@/features/schedule/types/FacilityDto';
import type { SeatDto } from '@/features/schedule/types/SeatDto';

export type SeatResponseDto = {
    // 設備情報は未実装のためバックエンドから null が返る
    frontFacilities: FacilityDto | null;
    rearFacilities: FacilityDto | null;
    seats: SeatDto[];
};
