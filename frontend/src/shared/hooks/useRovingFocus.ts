import type { KeyboardEvent, RefCallback } from 'react';
import { useRef, useState } from 'react';

export type RovingOrientation = 'horizontal' | 'vertical' | 'both' | 'grid';

type LinearOrientation = Exclude<RovingOrientation, 'grid'>;

export type RovingPosition = {
    row: number;
    col: number;
};

export type RovingItemProps = {
    ref: RefCallback<HTMLElement>;
    tabIndex: 0 | -1;
    onFocus: () => void;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

type CommonOptions<K extends string> = {
    keys: readonly K[];
    activeKey?: K;
    onNavigate?: (key: K) => void;
};

type LinearOptions = {
    orientation: LinearOrientation;
    canLoop?: boolean;
};

type GridOptions<K extends string> = {
    orientation: 'grid';
    getPosition: (key: K) => RovingPosition | undefined;
};

type UseRovingFocusOptions<K extends string> = CommonOptions<K> &
    (LinearOptions | GridOptions<K>);

const PREV_KEYS: Record<LinearOrientation, string[]> = {
    horizontal: ['ArrowLeft'],
    vertical: ['ArrowUp'],
    both: ['ArrowLeft', 'ArrowUp'],
};

const NEXT_KEYS: Record<LinearOrientation, string[]> = {
    horizontal: ['ArrowRight'],
    vertical: ['ArrowDown'],
    both: ['ArrowRight', 'ArrowDown'],
};

const GRID_KEYS = [
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
];

function isHandledKey(orientation: RovingOrientation, eventKey: string) {
    if (orientation === 'grid') return GRID_KEYS.includes(eventKey);
    return (
        PREV_KEYS[orientation].includes(eventKey) ||
        NEXT_KEYS[orientation].includes(eventKey) ||
        eventKey === 'Home' ||
        eventKey === 'End'
    );
}

function resolveLinearKey<K extends string>(
    keys: readonly K[],
    currentKey: K,
    orientation: LinearOrientation,
    canLoop: boolean,
    eventKey: string,
): K | undefined {
    const index = keys.indexOf(currentKey);
    const lastIndex = keys.length - 1;
    if (index < 0) return undefined;

    if (NEXT_KEYS[orientation].includes(eventKey)) {
        if (index < lastIndex) return keys[index + 1];
        return canLoop ? keys[0] : undefined;
    }
    if (PREV_KEYS[orientation].includes(eventKey)) {
        if (index > 0) return keys[index - 1];
        return canLoop ? keys[lastIndex] : undefined;
    }
    if (eventKey === 'Home') return keys[0];
    if (eventKey === 'End') return keys[lastIndex];
    return undefined;
}

type PositionedKey<K> = RovingPosition & { key: K };

function pickNearest<K>(
    candidates: PositionedKey<K>[],
    axis: keyof RovingPosition,
    isAscending: boolean,
): K | undefined {
    if (candidates.length === 0) return undefined;
    return candidates.reduce((best, candidate) => {
        const isCloser = isAscending
            ? candidate[axis] < best[axis]
            : candidate[axis] > best[axis];
        return isCloser ? candidate : best;
    }).key;
}

function resolveGridKey<K extends string>(
    keys: readonly K[],
    currentKey: K,
    getPosition: (key: K) => RovingPosition | undefined,
    event: KeyboardEvent<HTMLElement>,
): K | undefined {
    const current = getPosition(currentKey);
    if (!current) return undefined;

    const positionedKeys: PositionedKey<K>[] = keys.flatMap((key) => {
        const position = getPosition(key);
        return position ? [{ key, ...position }] : [];
    });
    const sameRowList = positionedKeys.filter((p) => p.row === current.row);
    const sameColList = positionedKeys.filter((p) => p.col === current.col);

    switch (event.key) {
        case 'ArrowRight':
            return pickNearest(
                sameRowList.filter((p) => p.col > current.col),
                'col',
                true,
            );
        case 'ArrowLeft':
            return pickNearest(
                sameRowList.filter((p) => p.col < current.col),
                'col',
                false,
            );
        case 'ArrowDown':
            return pickNearest(
                sameColList.filter((p) => p.row > current.row),
                'row',
                true,
            );
        case 'ArrowUp':
            return pickNearest(
                sameColList.filter((p) => p.row < current.row),
                'row',
                false,
            );
        case 'Home':
            return event.ctrlKey
                ? keys[0]
                : pickNearest(sameRowList, 'col', true);
        case 'End':
            return event.ctrlKey
                ? keys[keys.length - 1]
                : pickNearest(sameRowList, 'col', false);
        default:
            return undefined;
    }
}

export function useRovingFocus<K extends string>(
    options: UseRovingFocusOptions<K>,
) {
    const { keys, activeKey, onNavigate } = options;
    const elementsRef = useRef(new Map<K, HTMLElement>());
    const [focusedKey, setFocusedKey] = useState<K | undefined>(undefined);
    const isControlled = activeKey !== undefined;
    const rememberFocusedKey = (key: K) => {
        if (!isControlled) setFocusedKey(key);
    };

    const preferredKey = activeKey ?? focusedKey;
    const currentKey: K | undefined =
        preferredKey !== undefined && keys.includes(preferredKey)
            ? preferredKey
            : keys[0];

    const resolveNextKey = (
        key: K,
        event: KeyboardEvent<HTMLElement>,
    ): K | undefined => {
        if (options.orientation === 'grid') {
            return resolveGridKey(keys, key, options.getPosition, event);
        }
        return resolveLinearKey(
            keys,
            key,
            options.orientation,
            options.canLoop ?? false,
            event.key,
        );
    };

    const getItemProps = (key: K): RovingItemProps => ({
        ref: (element) => {
            if (element) {
                elementsRef.current.set(key, element);
            } else {
                elementsRef.current.delete(key);
            }
        },
        tabIndex: key === currentKey ? 0 : -1,
        onFocus: () => rememberFocusedKey(key),
        onKeyDown: (event) => {
            if (!isHandledKey(options.orientation, event.key)) return;
            event.preventDefault();
            const nextKey = resolveNextKey(key, event);
            if (nextKey === undefined || nextKey === key) return;
            rememberFocusedKey(nextKey);
            onNavigate?.(nextKey);
            elementsRef.current.get(nextKey)?.focus();
        },
    });

    return { getItemProps, currentKey };
}
