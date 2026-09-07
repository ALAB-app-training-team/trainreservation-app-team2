import dayjs from 'dayjs';
import type { SetStateAction } from 'react';

type CustomDatePickerProps = {
    id: string;
    label: string;
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    getFieldError?: (field: string) => string;
    maxDate: Date;
    minDate: Date;
};

export function CustomDatePicker({
    id,
    label,
    value,
    setValue,
    getFieldError,
    maxDate,
    minDate,
}: CustomDatePickerProps) {
    return (
        <div className="flex w-full flex-col items-start justify-between gap-2">
            <div className="flex h-full items-center gap-4">
                <label htmlFor={id}>{label}</label>
            </div>
            <input
                id={id}
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="focus:border-primary-ink bg-surface w-full cursor-pointer rounded-xl p-2 outline-none focus:border-2"
                min={dayjs(minDate).format('YYYY-MM-DD')}
                max={dayjs(maxDate).format('YYYY-MM-DD')}
            />
            {getFieldError?.(id) && (
                <p className="text-danger text-left text-sm">
                    {getFieldError(id)}
                </p>
            )}
        </div>
    );
}
