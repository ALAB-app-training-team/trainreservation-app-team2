import { FacilityIcon } from '@/features/schedule/components/FacilityIcon';
import type { FacilityItem } from '@/features/schedule/types/FacilityItem';
import { CustomModalTitle } from '@/shared/components/CustomModalTitle';

type FacilityLegendModalProps = {
    facilityItemList: FacilityItem[];
    onRequestClose: () => void;
};

export function FacilityLegendModal({
    facilityItemList,
    onRequestClose,
}: FacilityLegendModalProps) {
    return (
        <div className="flex flex-col items-start gap-4">
            <CustomModalTitle
                title="アイコンの説明"
                onRequestClose={onRequestClose}
                isSubmitting={false}
            />
            <ul className="flex w-full list-none flex-col gap-4 p-0">
                {facilityItemList.map((facility) => (
                    <li
                        key={facility.label}
                        className="flex items-center gap-3 text-left"
                    >
                        <FacilityIcon
                            icon={facility.icon}
                            label={facility.label}
                            isDecorative
                            iconClassName={facility.iconClassName}
                        />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-fg font-medium">
                                {facility.label}
                            </p>
                            <p className="text-fg-muted text-sm">
                                {facility.description}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
