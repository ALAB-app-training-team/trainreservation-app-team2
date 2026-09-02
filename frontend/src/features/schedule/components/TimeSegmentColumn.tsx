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
        <div ref={listRef} tabIndex={-1} className="max-h-48 overflow-y-auto">
            {values.map((value) => (
                <button
                    type="button"
                    tabIndex={-1}
                    key={value}
                    data-selected={value === selectedValue}
                    onClick={() => onSelect(value)}
                    className={`block cursor-pointer p-1 ${
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
