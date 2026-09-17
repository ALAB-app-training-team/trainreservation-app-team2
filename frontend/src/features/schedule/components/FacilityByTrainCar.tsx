import {
    MdOutlineAccessible,
    MdOutlineBabyChangingStation,
    MdOutlineMan,
    MdOutlineMeetingRoom,
    MdOutlineWc,
    MdOutlineWoman,
} from 'react-icons/md';
import { RiLuggageDepositLine } from 'react-icons/ri';

import { FacilityIcon } from '@/features/schedule/components/FacilityIcon';
import type { FacilityDto } from '@/features/schedule/types/FacilityDto';
import type { FacilityItem } from '@/features/schedule/types/FacilityItem';

type FacilityByTrainCarProps = {
    facilities: FacilityDto;
};

export function FacilityByTrainCar({ facilities }: FacilityByTrainCarProps) {
    const facilityItemList: FacilityItem[] = [
        {
            hasFacility: facilities.hasAllGenderRestroom,
            icon: MdOutlineWc,
            label: '男女共用トイレ',
            iconClassName: 'text-facility-all-gender',
        },
        {
            hasFacility: facilities.hasMensRestroom,
            icon: MdOutlineMan,
            label: '男性用トイレ',
            iconClassName: 'text-facility-mens',
        },
        {
            hasFacility: facilities.hasWomensRestroom,
            icon: MdOutlineWoman,
            label: '女性用トイレ',
            iconClassName: 'text-facility-womens',
        },
        {
            hasFacility: facilities.hasWheelchairRestroom,
            icon: MdOutlineAccessible,
            label: '車いす対応トイレ',
            iconClassName: 'text-facility-wheelchair',
        },
        {
            hasFacility: facilities.hasBabyChangingTable,
            icon: MdOutlineBabyChangingStation,
            label: 'ベビーベッド',
            iconClassName: 'text-facility-baby',
        },
        {
            hasFacility: facilities.hasLuggageStorage,
            icon: RiLuggageDepositLine,
            label: '荷物置き場',
            iconClassName: 'text-facility-luggage',
        },
        {
            hasFacility: facilities.hasMultipurposeRoom,
            icon: MdOutlineMeetingRoom,
            label: '多目的室',
            iconClassName: 'text-facility-multipurpose',
        },
    ];

    return (
        <div className="flex gap-1">
            {facilityItemList
                .filter((facility) => facility.hasFacility)
                .map((facility) => (
                    <FacilityIcon
                        key={facility.label}
                        icon={facility.icon}
                        label={facility.label}
                        iconClassName={facility.iconClassName}
                    />
                ))}
        </div>
    );
}
