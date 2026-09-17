import {
    MdOutlineAccessible,
    MdOutlineBabyChangingStation,
    MdOutlineHelpOutline,
    MdOutlineMan,
    MdOutlineMeetingRoom,
    MdOutlineWc,
    MdOutlineWoman,
} from 'react-icons/md';
import { RiLuggageDepositLine } from 'react-icons/ri';

import { FacilityIcon } from '@/features/schedule/components/FacilityIcon';
import { FacilityLegendModal } from '@/features/schedule/components/FacilityLegendModal';
import type { FacilityDto } from '@/features/schedule/types/FacilityDto';
import type { FacilityItem } from '@/features/schedule/types/FacilityItem';
import { CustomModal } from '@/shared/components/CustomModal';
import { useModal } from '@/shared/hooks/useModal';

type FacilityByTrainCarProps = {
    facilities: FacilityDto;
};

export function FacilityByTrainCar({ facilities }: FacilityByTrainCarProps) {
    const { isOpen, handleModalOpen, onRequestClose } = useModal();

    const facilityItemList: FacilityItem[] = [
        {
            hasFacility: facilities.hasAllGenderRestroom,
            icon: MdOutlineWc,
            label: '男女共用トイレ',
            description: '男女どなたでも利用できるトイレです。',
            iconClassName: 'text-facility-all-gender',
        },
        {
            hasFacility: facilities.hasMensRestroom,
            icon: MdOutlineMan,
            label: '男性用トイレ',
            description: '男性専用のトイレです。',
            iconClassName: 'text-facility-mens',
        },
        {
            hasFacility: facilities.hasWomensRestroom,
            icon: MdOutlineWoman,
            label: '女性用トイレ',
            description: '女性専用のトイレです。',
            iconClassName: 'text-facility-womens',
        },
        {
            hasFacility: facilities.hasWheelchairRestroom,
            icon: MdOutlineAccessible,
            label: '車いす対応トイレ',
            description: '車いすのまま利用できる広いトイレです。',
            iconClassName: 'text-facility-wheelchair',
        },
        {
            hasFacility: facilities.hasBabyChangingTable,
            icon: MdOutlineBabyChangingStation,
            label: 'ベビーベッド',
            description: 'おむつ替えができるベビーベッドがあります。',
            iconClassName: 'text-facility-baby',
        },
        {
            hasFacility: facilities.hasLuggageStorage,
            icon: RiLuggageDepositLine,
            label: '荷物置き場',
            description: '大型のスーツケースなどを置けるスペースです。',
            iconClassName: 'text-facility-luggage',
        },
        {
            hasFacility: facilities.hasMultipurposeRoom,
            icon: MdOutlineMeetingRoom,
            label: '多目的室',
            description:
                '身体の不自由な方、授乳や体調不良のときに使える個室です。',
            iconClassName: 'text-facility-multipurpose',
        },
    ];

    const availableFacilityList = facilityItemList.filter(
        (facility) => facility.hasFacility,
    );

    if (availableFacilityList.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-1">
            {availableFacilityList.map((facility) => (
                <FacilityIcon
                    key={facility.label}
                    icon={facility.icon}
                    label={facility.label}
                    iconClassName={facility.iconClassName}
                />
            ))}
            <button
                type="button"
                onClick={handleModalOpen}
                aria-label="アイコンの説明を開く"
                className="text-fg-muted hover:text-fg rounded-full p-1"
            >
                <MdOutlineHelpOutline className="size-6" />
            </button>
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
                <FacilityLegendModal
                    facilityItemList={facilityItemList}
                    onRequestClose={onRequestClose}
                />
            </CustomModal>
        </div>
    );
}
