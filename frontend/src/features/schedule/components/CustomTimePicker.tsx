import { HiOutlineClock } from 'react-icons/hi';

import { TimeSegmentColumn } from '@/features/schedule/components/TimeSegmentColumn';
import { HOURS, MINUTES } from '@/features/schedule/constants/Time';
import { useTimeSegments } from '@/features/schedule/hooks/useTimeSegments';

type CustomTimePickerProps = {
    id: string;
    label: string;
    value: string;
    setValue: (time: string) => void;
    getFieldError?: (field: string) => string;
    children?: React.ReactNode;
};

export function CustomTimePicker({
    id,
    label,
    value,
    setValue,
    getFieldError,
    children,
}: CustomTimePickerProps) {
    const {
        hour,
        minute,
        isOpen,
        containerRef,
        inputRef,
        hourListRef,
        minuteListRef,
        handleFocus,
        handleBlur,
        handleContainerBlur,
        handleClickClockIcon,
        handleChange,
        handleClick,
        handleKeyDown,
        handleSelectHour,
        handleSelectMinute,
    } = useTimeSegments(value, setValue);

    return (
        <div className="flex w-full flex-col items-start justify-between gap-2">
            <div className="flex h-full items-center gap-4">
                <label htmlFor={id}>{label}</label>
                {children}
            </div>
            <div
                ref={containerRef}
                className="relative w-full"
                onBlur={handleContainerBlur}
            >
                <input
                    id={id}
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="focus:border-primary w-full cursor-pointer rounded-xl bg-white p-2 pr-9 outline-none focus:border-2"
                />
                <span
                    tabIndex={0}
                    onClick={handleClickClockIcon}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleClickClockIcon();
                        }
                    }}
                    className="focus:ring-primary absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded text-gray-500 outline-none focus:ring-2"
                >
                    <HiOutlineClock />
                </span>
                {isOpen && (
                    <div className="border-primary absolute z-20 flex w-fit divide-x rounded-xl border bg-white">
                        <TimeSegmentColumn
                            values={HOURS}
                            selectedValue={hour}
                            onSelect={handleSelectHour}
                            listRef={hourListRef}
                        />
                        <TimeSegmentColumn
                            values={MINUTES}
                            selectedValue={minute}
                            onSelect={handleSelectMinute}
                            listRef={minuteListRef}
                        />
                    </div>
                )}
            </div>
            {getFieldError?.(id) && (
                <p className="text-left text-sm text-red-600">
                    {getFieldError(id)}
                </p>
            )}
        </div>
    );
}
