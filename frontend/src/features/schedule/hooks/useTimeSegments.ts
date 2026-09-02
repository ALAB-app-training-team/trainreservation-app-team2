import {
    type ChangeEvent,
    type FocusEvent,
    type KeyboardEvent,
    type MouseEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';

import { HOURS, MINUTES } from '@/features/schedule/constants/Time';

export function useTimeSegments(
    value: string,
    setValue: (time: string) => void,
) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSegment, setActiveSegment] = useState<Segment | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hourListRef = useRef<HTMLDivElement>(null);
    const minuteListRef = useRef<HTMLDivElement>(null);

    const digitBufferRef = useRef('');
    const pendingSelectionRef = useRef<Segment | null>(null);

    // hour:0~23, minites:0~55, 文字数を設定
    type Segment = 'hour' | 'minute';
    const SEGMENTS: Record<
        Segment,
        { characters: [number, number]; max: number; choices: number[] }
    > = {
        hour: { characters: [0, 2], max: 23, choices: HOURS },
        minute: { characters: [3, 5], max: 59, choices: MINUTES },
    };

    // valueをhour・minuteに分割
    const [hourString, minuteString] = value.split(':');
    const values: Record<Segment, number> = {
        hour: Number(hourString),
        minute: Number(minuteString),
    };

    // 時刻ドロップダウンを閉じる判定
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: globalThis.MouseEvent) => {
            // TimePicker外をクリックされた場合
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

    // 値が変わったあとも、HH または mm を選択状態に戻す
    useLayoutEffect(() => {
        const segment = pendingSelectionRef.current;
        if (!segment || !inputRef.current) return;
        const [start, end] = SEGMENTS[segment].characters;
        inputRef.current.setSelectionRange(start, end);
        pendingSelectionRef.current = null;
    }, [activeSegment, value]);

    // 選択中のリスト項目を見える位置へスクロールする
    useEffect(() => {
        if (!isOpen) return;
        hourListRef.current
            ?.querySelector('[data-selected="true"]')
            ?.scrollIntoView({ block: 'nearest' });
        minuteListRef.current
            ?.querySelector('[data-selected="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [isOpen, value]);

    const buildValue = (segment: Segment, newValue: number) => {
        const next = { ...values, [segment]: newValue };
        const safeHour = Number.isNaN(next.hour) ? 0 : next.hour;
        const safeMinute = Number.isNaN(next.minute) ? 0 : next.minute;
        return `${safeHour.toString().padStart(2, '0')}:${safeMinute.toString().padStart(2, '0')}`;
    };

    // 時または分を編集対象にする関数
    const focusSegment = (segment: Segment) => {
        digitBufferRef.current = '';
        pendingSelectionRef.current = segment;
        setActiveSegment(segment);
    };

    // 時または分の値を確定する関数
    const commitSegment = (segment: Segment, newValue: number) => {
        const clamped = Math.min(Math.max(newValue, 0), SEGMENTS[segment].max);
        setValue(buildValue(segment, clamped));
    };

    // 矢印キーで時刻を進めたり戻したりする処理
    const stepSegment = (segment: Segment, direction: 1 | -1) => {
        const { choices } = SEGMENTS[segment];
        const current = values[segment];

        // 現在の値に一番近い候補を探す
        const findClosestChoiceIndex = (choices: number[], target: number) => {
            if (Number.isNaN(target)) return 0;
            let closest = 0;
            for (let i = 1; i < choices.length; i++) {
                if (
                    Math.abs(choices[i] - target) <
                    Math.abs(choices[closest] - target)
                ) {
                    closest = i;
                }
            }
            return closest;
        };

        const index = choices.includes(current)
            ? choices.indexOf(current)
            : findClosestChoiceIndex(choices, current);
        const nextValue =
            choices[(index + direction + choices.length) % choices.length];
        focusSegment(segment);
        commitSegment(segment, nextValue);
    };

    const handleSelectHour = (h: number) => {
        setValue(buildValue('hour', h));
        focusSegment('minute');
    };

    const handleSelectMinute = (m: number) => {
        setValue(buildValue('minute', m));
        setIsOpen(false);
    };

    const handleFocus = () => {
        setIsOpen(true);
    };

    const handleBlur = () => {
        setActiveSegment(null);
    };

    // 時刻ピッカー全体からフォーカスが外に出たら閉じる処理
    const handleContainerBlur = (e: FocusEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsOpen(false);
        }
    };

    const handleClickClockIcon = () => {
        setIsOpen((prev) => !prev);
        focusSegment(activeSegment ?? 'hour');
        inputRef.current?.focus();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        // valueを時刻（hh:mm）形式に整える
        const formatTimeText = (raw: string): string => {
            const digits = raw.replace(/[^0-9]/g, '').slice(0, 4);
            if (digits.length <= 2) return digits;
            return `${digits.slice(0, 2)}:${digits.slice(2)}`;
        };
        setValue(formatTimeText(e.target.value));
    };

    // input をクリックしたとき
    const handleClick = (e: MouseEvent<HTMLInputElement>) => {
        setIsOpen(true);
        const caret = e.currentTarget.selectionStart ?? 0;
        const segment: Segment = caret < 3 ? 'hour' : 'minute';
        const [start, end] = SEGMENTS[segment].characters;
        digitBufferRef.current = '';
        setActiveSegment(segment);
        e.currentTarget.setSelectionRange(start, end);
    };

    // キーボード入力をしたとき
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const segment = activeSegment ?? 'hour';

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                focusSegment('hour');
                return;
            case 'ArrowRight':
                e.preventDefault();
                focusSegment('minute');
                return;
            case 'ArrowUp':
            case 'ArrowDown':
                e.preventDefault();
                setIsOpen(true);
                stepSegment(segment, e.key === 'ArrowDown' ? 1 : -1);
                return;
            case 'Backspace':
            case 'Delete':
                e.preventDefault();
                focusSegment(segment);
                commitSegment(segment, 0);
                return;
        }

        if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            const buffer = digitBufferRef.current + e.key;
            const enteredValue = Number(buffer);
            const maxLeadingDigit = segment === 'hour' ? 2 : 5;
            const isFirstOfTwoDigits =
                buffer.length === 1 && Number(e.key) <= maxLeadingDigit;

            if (isFirstOfTwoDigits) {
                digitBufferRef.current = buffer;
                pendingSelectionRef.current = segment;
                setActiveSegment(segment);
                commitSegment(segment, enteredValue);
                return;
            }

            focusSegment(segment === 'hour' ? 'minute' : segment);
            commitSegment(segment, enteredValue);
            return;
        }

        // 数字以外の文字入力禁止
        if (e.key.length === 1) {
            e.preventDefault();
        }
    };

    return {
        hour: values.hour,
        minute: values.minute,
        isOpen,
        containerRef,
        inputRef,
        hourListRef,
        minuteListRef,
        handleFocus,
        handleBlur,
        handleContainerBlur,
        handleIconActivate: handleClickClockIcon,
        handleChange,
        handleClick,
        handleKeyDown,
        handleSelectHour,
        handleSelectMinute,
    };
}
