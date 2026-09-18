import type { IconType } from 'react-icons';

import type { FacilityFlagKey } from '@/features/schedule/types/FacilityFlagKey';
import type { FacilityLabel } from '@/features/schedule/types/FacilityLabel';

export type FacilityItem = {
    facilityKey: FacilityFlagKey;
    icon: IconType;
    label: FacilityLabel;
    description: string;
    iconClassName: string;
};
