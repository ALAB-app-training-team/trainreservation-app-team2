import { MdOutlineHelpOutline } from 'react-icons/md';

import { FacilityIcon } from '@/features/schedule/components/FacilityIcon';
import { FacilityLegendModal } from '@/features/schedule/components/FacilityLegendModal';
import { FACILITY_ITEM_LIST } from '@/features/schedule/constants/FacilityItemList';
import type { FacilityDto } from '@/features/schedule/types/FacilityDto';
import { CustomModal } from '@/shared/components/CustomModal';
import { useModal } from '@/shared/hooks/useModal';

type FacilityByTrainCarProps = {
    isFront: boolean;
    facilities: FacilityDto;
};

export function FacilityByTrainCar({
    isFront,
    facilities,
}: FacilityByTrainCarProps) {
    const { isOpen, handleModalOpen, onRequestClose } = useModal();

    const availableFacilityList = FACILITY_ITEM_LIST.filter(
        (facility) => facilities[facility.facilityKey],
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
                aria-label={
                    isFront
                        ? '前方アイコンの説明を開く'
                        : '後方アイコンの説明を開く'
                }
                className="text-fg-muted hover:text-fg rounded-full p-1"
            >
                <MdOutlineHelpOutline className="size-6" />
            </button>
            <CustomModal isOpen={isOpen} onRequestClose={onRequestClose}>
                <FacilityLegendModal
                    facilityItemList={FACILITY_ITEM_LIST}
                    onRequestClose={onRequestClose}
                />
            </CustomModal>
        </div>
    );
}
