import type { RefObject } from 'react';

type TimeSegmentColumnProps = {
    values: number[];
    selectedValue: number;
    onSelect: (value: number) => void;
    listRef: RefObject<HTMLDivElement | null>;
};

export function TimeSegmentColumn({
    values,
    selectedValue,
    onSelect,
    listRef,
}: TimeSegmentColumnProps) {
    return (
        <div
            ref={listRef}
            tabIndex={-1}
            className="max-h-[220px] overflow-y-auto md:max-h-48"
        >
            {values.map((value) => (
                <button
                    type="button"
                    tabIndex={-1}
                    key={value}
                    data-selected={value === selectedValue}
                    onClick={() => onSelect(value)}
                    className={`flex size-[44px] min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center md:size-auto md:p-1 ${
                        value === selectedValue
                            ? 'bg-primary text-white'
                            : 'hover:bg-primary-light'
                    }`}
                >
                    {value.toString().padStart(2, '0')}
                </button>
            ))}
        </div>
    );
}
