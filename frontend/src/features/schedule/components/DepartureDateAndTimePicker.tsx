import type { SetStateAction } from 'react';

type DepartureDateAndTimePickerProps = {
    id: string;
    label: string;
    type: string;
    value: string;
    setValue: React.Dispatch<SetStateAction<string>> | ((time: string) => void);
    getFieldError?: (field: string) => string;
    maxDate?: Date;
    minDate?: Date;
};

export function DepartureDateAndTimePicker({
    id,
    label,
    type,
    value,
    setValue,
    getFieldError,
    maxDate,
    minDate,
}: DepartureDateAndTimePickerProps) {
    return (
        <div className="flex w-full flex-col items-start gap-2">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="focus:border-primary w-full cursor-pointer rounded-xl bg-white p-2 outline-none focus:border-2"
                min={minDate?.toISOString()?.split('T')[0]}
                max={maxDate?.toISOString()?.split('T')[0]}
            />
            {getFieldError?.(id) && (
                <p className="text-left text-sm text-red-600">
                    {getFieldError(id)}
                </p>
            )}
        </div>
    );
}
