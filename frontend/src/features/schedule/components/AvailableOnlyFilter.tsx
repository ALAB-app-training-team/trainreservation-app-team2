import { Checkbox } from '@/shared/components/Checkbox';

type AvailableOnlyFilterProps = {
    isChecked: boolean;
    isDisabled: boolean;
    onChange: (checked: boolean) => void;
};

export function AvailableOnlyFilter({
    isChecked,
    isDisabled,
    onChange,
}: AvailableOnlyFilterProps) {
    return (
        <div className="flex flex-col">
            <Checkbox
                id="isOnlyAvailable"
                dataTestId="isOnlyAvailable-checkbox"
                checked={isChecked}
                disabled={isDisabled}
                onChange={onChange}
                inputClassName="size-4"
                label="空席がある列車のみ表示する"
            />
            {isDisabled && (
                <p
                    data-testid="isOnlyAvailable-hint"
                    className="cursor-not-allowed text-left text-xs"
                >
                    （座席種別または人数を指定中は自動で空席がある列車のみ表示されます）
                </p>
            )}
        </div>
    );
}
