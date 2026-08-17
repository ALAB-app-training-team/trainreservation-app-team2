import dayjs from 'dayjs';
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
    children?: React.ReactNode;
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
    children,
}: DepartureDateAndTimePickerProps) {
    return (
        <div className="flex w-full flex-col items-start justify-between gap-2">
            <div className="flex h-full items-center gap-4">
                <label htmlFor={id}>{label}</label>
                {children}
            </div>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="focus:border-primary w-full cursor-pointer rounded-xl bg-white p-2 outline-none focus:border-2"
                min={minDate ? dayjs(minDate).format('YYYY-MM-DD') : undefined}
                max={maxDate ? dayjs(maxDate).format('YYYY-MM-DD') : undefined}
            />
            {getFieldError?.(id) && (
                <p className="text-left text-sm text-red-600">
                    {getFieldError(id)}
                </p>
            )}
        </div>
    );
}
