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
        <div className="flex w-full flex-col items-start gap-2">
            <div className="flex h-8 items-center gap-4">
                <label htmlFor={id}>{label}</label>
            </div>
            <input
                id={id}
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="focus:ring-primary-ink bg-surface w-full min-w-0 cursor-pointer appearance-none rounded-xl p-2 outline-none focus:ring-2 focus:ring-inset"
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
