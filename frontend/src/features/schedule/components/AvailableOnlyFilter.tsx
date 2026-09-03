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
                className={`items-center" flex ${isDisabled ? 'cursor-not-allowed' : ''}`}
            >
                <input
                    type="checkbox"
                    id="isOnlyAvailable"
                    data-testid="isOnlyAvailable-checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={(e) => onChange(e.target.checked)}
                    className={`accent-primary ${isDisabled ? 'pointer-events-none' : 'cursor-pointer'}`}
                />
                <label
                    htmlFor="isOnlyAvailable"
                    className={`text-sm ${
                        isDisabled
                            ? 'text-fg-muted cursor-not-allowed'
                            : 'cursor-pointer'
                    }`}
                >
                    空席がある列車のみ表示する
                </label>
            </div>
            {isDisabled && (
                <p
                    data-testid="isOnlyAvailable-hint"
                    className="text-fg-muted cursor-not-allowed text-xs"
                >
                    （座席種別または人数を指定中は自動で空席がある列車のみ表示されます）
                </p>
            )}
        </div>
    );
}
