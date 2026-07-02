import type { SetStateAction } from 'react';

import type { Station } from '@/features/schedule/types/Station';

type StationSelectProps = {
    id: string;
    label: string;
    list: Station[];
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    getFieldError?: (field: string) => string;
};

export function StationSelect({
    id,
    label,
    list,
    value,
    setValue,
    getFieldError: getFieldError,
}: StationSelectProps) {
    return (
        <>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor={id}>{label}</label>
                <select
                    id={id}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="focus:border-primary w-full cursor-pointer rounded-xl border-2 border-transparent bg-white p-2 outline-none"
                >
                    {list.map((item, index) => {
                        return (
                            <option key={index} value={item.station_cd}>
                                {item.name}
                            </option>
                        );
                    })}
                </select>
                {getFieldError?.(id) && (
                    <p className="text-left text-sm text-red-600">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
