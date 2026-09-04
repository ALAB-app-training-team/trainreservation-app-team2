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
            <div
                className={`flex items-center gap-2 ${isDisabled ? 'cursor-not-allowed' : ''}`}
            >
                <input
                    type="checkbox"
                    id="isOnlyAvailable"
                    data-testid="isOnlyAvailable-checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className={`accent-primary focus-visible:ring-primary size-4 focus-visible:ring-1 focus-visible:ring-offset-2 ${isDisabled ? 'pointer-events-none' : 'cursor-pointer'}`}
                />
                <label
                    htmlFor="isOnlyAvailable"
                    className={`${
                        isDisabled
                            ? 'cursor-not-allowed text-gray-500'
                            : 'cursor-pointer'
                    }`}
                >
                    空席がある列車のみ表示する
                </label>
            </div>
            {isDisabled && (
                <p
                    data-testid="isOnlyAvailable-hint"
                    className="cursor-not-allowed text-xs text-gray-500"
                >
                    （座席種別または人数を指定中は自動で空席がある列車のみ表示されます）
                </p>
            )}
        </div>
    );
}
