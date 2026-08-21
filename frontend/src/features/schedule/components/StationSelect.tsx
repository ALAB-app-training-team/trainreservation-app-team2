import type { SetStateAction } from 'react';
import Select from 'react-select';

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
    const options = list.map((item) => ({
        value: item.stationCd,
        label: item.name,
    }));
    const selectedOption = options.find((option) => option.value === value);

    return (
        <>
            <div className="flex w-full flex-col items-start gap-2">
                <label htmlFor={id}>{label}</label>
                <Select
                    inputId={id}
                    value={selectedOption}
                    onChange={(option) => {
                        if (option) setValue(option.value);
                    }}
                    className="w-full text-left"
                    classNames={{
                        control: ({ isFocused }) =>
                            'cursor-pointer rounded-xl bg-white p-2 ' +
                            `${isFocused ? 'border-primary border-2' : 'border-transparent'}`,
                        input: () => 'cursor-pointer',
                        menu: () => 'bg-white p-2',
                        option: ({ isFocused, isSelected }) =>
                            `!cursor-pointer ${isSelected ? 'bg-primary text-white' : isFocused ? 'bg-primary-light' : 'text-gray-700'}`,
                    }}
                    unstyled
                    options={options}
                    noOptionsMessage={() => '該当する駅が見つかりません'}
                />
                {getFieldError?.(id) && (
                    <p className="text-left text-sm text-red-600">
                        {getFieldError(id)}
                    </p>
                )}
            </div>
        </>
    );
}
