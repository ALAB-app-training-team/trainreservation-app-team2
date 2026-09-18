import { FACILITY_LABELS } from '@/features/schedule/constants/FacilityLabels';

export type FacilityLabel =
    (typeof FACILITY_LABELS)[keyof typeof FACILITY_LABELS];
