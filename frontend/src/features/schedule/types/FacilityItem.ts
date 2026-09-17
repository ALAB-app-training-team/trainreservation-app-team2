import type { IconType } from 'react-icons';

export type FacilityItem = {
    hasFacility: boolean;
    icon: IconType;
    label: string;
    description: string;
    iconClassName: string;
};
