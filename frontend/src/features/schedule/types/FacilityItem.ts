import type { IconType } from 'react-icons';

import type { FacilityLabel } from '@/features/schedule/types/FacilityLabel';

export type FacilityItem = {
    hasFacility: boolean;
    icon: IconType;
    label: FacilityLabel;
    description: string;
    iconClassName: string;
};
