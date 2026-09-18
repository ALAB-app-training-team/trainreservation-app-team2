import type { FacilityDto } from '@/features/schedule/types/FacilityDto';

export type FacilityFlagKey = {
    [K in keyof FacilityDto]: FacilityDto[K] extends boolean ? K : never;
}[keyof FacilityDto];
