import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { HiOutlineClock } from 'react-icons/hi';

const HOURS = Array.from(Array(24).keys());
const MINUTES = Array.from(Array(12).keys(), (i) => i * 5);

const pad = (n: number) => n.toString().padStart(2, '0');

const formatTimeInput = (raw: string): string => {
    const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2)}`;
};

type Segment = 'hour' | 'minute';

const SEGMENT_RANGE: Record<Segment, [number, number]> = {
    hour: [0, 2],
    minute: [3, 5],
};

const SEGMENT_MAX: Record<Segment, number> = {
    hour: 23,
    minute: 59,
};

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
    const [isOpen, setIsOpen] = useState(false);
    const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);
    const digitBufferRef = useRef('');
    // Only set by a real click/keydown, never by a bare focus event. This
    // keeps programmatic value changes (e.g. Playwright's fill()) from being
    // clipped to whatever segment happens to be selected in the DOM.
    const pendingSelectionRef = useRef<Segment | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Re-applies the segment highlight after a click/keydown-driven update,
    // matching how native input[type=time] keeps the active segment fully
    // selected while it's being edited.
    useLayoutEffect(() => {
        if (!pendingSelectionRef.current || !inputRef.current) return;
        const [start, end] = SEGMENT_RANGE[pendingSelectionRef.current];
        inputRef.current.setSelectionRange(start, end);
        pendingSelectionRef.current = null;
    }, [activeSegment, value]);

    // Keeps the highlighted list item in view while arrow keys step through it.
    useEffect(() => {
        if (!isOpen) return;
        hourListRef.current
            ?.querySelector('[data-selected="true"]')
            ?.scrollIntoView({ block: 'nearest' });
        minuteListRef.current
            ?.querySelector('[data-selected="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [isOpen, value]);

    const [hourStr, minuteStr] = value.split(':');
    const hour = Number(hourStr);
    const minute = Number(minuteStr);

    const focusSegment = (segment: Segment) => {
        digitBufferRef.current = '';
        pendingSelectionRef.current = segment;
        setActiveSegment(segment);
    };

    const commitSegment = (segment: Segment, num: number) => {
        const clamped = Math.min(Math.max(num, 0), SEGMENT_MAX[segment]);
        const newHour =
            segment === 'hour' ? clamped : Number.isNaN(hour) ? 0 : hour;
        const newMinute =
            segment === 'minute' ? clamped : Number.isNaN(minute) ? 0 : minute;
        setValue(`${pad(newHour)}:${pad(newMinute)}`);
    };

    // Steps through the same values shown in the dropdown list (hours by 1,
    // minutes by 5), keeping the segment active instead of advancing.
    const stepSegment = (segment: Segment, direction: 1 | -1) => {
        const list = segment === 'hour' ? HOURS : MINUTES;
        const current = segment === 'hour' ? hour : minute;
        let index = list.indexOf(current);
        if (index === -1) {
            index = list.reduce(
                (closest, v, i) =>
                    Math.abs(v - (Number.isNaN(current) ? 0 : current)) <
                    Math.abs(
                        list[closest] - (Number.isNaN(current) ? 0 : current),
                    )
                        ? i
                        : closest,
                0,
            );
        }
        const nextValue = list[(index + direction + list.length) % list.length];
        focusSegment(segment);
        commitSegment(segment, nextValue);
    };

    const handleSelectHour = (h: number) => {
        setValue(`${pad(h)}:${Number.isNaN(minute) ? '00' : pad(minute)}`);
        focusSegment('minute');
    };

    const handleSelectMinute = (m: number) => {
        setValue(`${Number.isNaN(hour) ? '00' : pad(hour)}:${pad(m)}`);
        setIsOpen(false);
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleIconActivate = () => {
        setIsOpen((prev) => !prev);
        focusSegment(activeSegment ?? 'hour');
        inputRef.current?.focus();
    };

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
        setIsOpen(true);
        const caret = e.currentTarget.selectionStart ?? 0;
        const segment: Segment = caret < 3 ? 'hour' : 'minute';
        const [start, end] = SEGMENT_RANGE[segment];
        digitBufferRef.current = '';
        setActiveSegment(segment);
        e.currentTarget.setSelectionRange(start, end);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey || e.metaKey) return;
        const segment = activeSegment ?? 'hour';

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            focusSegment('hour');
            return;
        }
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            focusSegment('minute');
            return;
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            stepSegment(segment, e.key === 'ArrowDown' ? 1 : -1);
            return;
        }
        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault();
            focusSegment(segment);
            commitSegment(segment, 0);
            return;
        }
        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            const buffer = digitBufferRef.current + e.key;
            const tentative = Number(buffer);
            const maxLeadingDigit = segment === 'hour' ? 2 : 5;

            if (buffer.length === 1 && Number(e.key) <= maxLeadingDigit) {
                digitBufferRef.current = buffer;
                pendingSelectionRef.current = segment;
                setActiveSegment(segment);
                commitSegment(segment, tentative);
                return;
            }

            focusSegment(segment === 'hour' ? 'minute' : segment);
            commitSegment(segment, tentative);
            return;
        }
        if (e.key.length === 1) {
            e.preventDefault();
        }
    };

    return (
        <div className="flex w-full flex-col items-start justify-between gap-2">
            <div className="flex h-full items-center gap-4">
                <label htmlFor={id}>{label}</label>
                {children}
            </div>
            <div
                ref={containerRef}
                className="relative w-full"
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsOpen(false);
                    }
                }}
            >
                <input
                    id={id}
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={value}
                    onChange={(e) => setValue(formatTimeInput(e.target.value))}
                    onFocus={handleFocus}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setActiveSegment(null)}
                    className="focus:border-primary w-full cursor-pointer rounded-xl bg-white p-2 pr-9 outline-none focus:border-2"
                />
                <span
                    tabIndex={0}
                    aria-label="時刻を選択"
                    onClick={handleIconActivate}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleIconActivate();
                        }
                    }}
                    className="focus:ring-primary absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded text-gray-500 outline-none focus:ring-2"
                >
                    <HiOutlineClock />
                </span>
                {isOpen && (
                    <div className="border-primary absolute z-20 mt-1 flex w-fit divide-x rounded-xl border bg-white shadow-lg">
                        <div
                            ref={hourListRef}
                            tabIndex={-1}
                            className="max-h-48 overflow-y-auto"
                        >
                            {HOURS.map((h) => (
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    key={h}
                                    data-selected={h === hour}
                                    onClick={() => handleSelectHour(h)}
                                    className={`block w-full cursor-pointer px-4 py-1 text-left ${
                                        h === hour
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-primary-light'
                                    }`}
                                >
                                    {pad(h)}
                                </button>
                            ))}
                        </div>
                        <div
                            ref={minuteListRef}
                            tabIndex={-1}
                            className="max-h-48 overflow-y-auto"
                        >
                            {MINUTES.map((m) => (
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    key={m}
                                    data-selected={m === minute}
                                    onClick={() => handleSelectMinute(m)}
                                    className={`block w-full cursor-pointer px-4 py-1 text-left ${
                                        m === minute
                                            ? 'bg-primary text-white'
                                            : 'hover:bg-primary-light'
                                    }`}
                                >
                                    {pad(m)}
                                </button>
                            ))}
                        </div>
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
