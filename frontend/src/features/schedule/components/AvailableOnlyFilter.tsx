import { HiOutlineFilter } from 'react-icons/hi';

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
        <label
            htmlFor="isOnlyAvailable"
            className={`flex w-full flex-wrap items-center gap-2 rounded-lg px-2 py-1.5 ${
                isDisabled
                    ? 'cursor-not-allowed'
                    : 'hover:bg-primary-ink/8 cursor-pointer'
            }`}
        >
            <span className="flex items-center gap-2">
                <HiOutlineFilter className="text-primary-ink shrink-0 text-lg" />
                <span>空席がある列車のみ表示する</span>
                <span className="relative ml-1 inline-flex h-5 w-9 shrink-0 items-center">
                    <input
                        type="checkbox"
                        id="isOnlyAvailable"
                        data-testid="isOnlyAvailable-checkbox"
                        checked={isChecked}
                        disabled={isDisabled}
                        onChange={(e) => onChange(e.target.checked)}
                        className={`peer absolute inset-0 z-10 size-full opacity-0 ${
                            isDisabled
                                ? 'pointer-events-none'
                                : 'cursor-pointer'
                        }`}
                    />
                    <span
                        aria-hidden="true"
                        className={`peer-focus-visible:ring-primary-ink pointer-events-none absolute inset-0 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 ${
                            isChecked && !isDisabled
                                ? 'bg-primary'
                                : 'bg-surface-disabled'
                        }`}
                    />
                    <span
                        aria-hidden="true"
                        className="bg-surface pointer-events-none absolute left-0.5 size-4 rounded-full shadow transition-transform peer-checked:translate-x-4"
                    />
                </span>
            </span>
            {isDisabled && (
                <span
                    data-testid="isOnlyAvailable-hint"
                    className="text-fg-muted w-full pl-4 text-left text-xs md:w-auto md:pl-0"
                >
                    ※座席種別または人数を指定中は自動で空席がある列車のみ表示されます
                </span>
            )}
        </label>
    );
}
