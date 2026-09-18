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
    /** 移動対象となるキーの並び。tabIndex=0 を付ける要素や Home/End の行き先はこの順序で決まる */
    keys: readonly K[];
    /**
     * 渡すと controlled モードになり、tabIndex=0 は常に activeKey の要素に付く。
     * その場合、矢印キーでの移動を activeKey に反映するのは呼び出し側（onNavigate）の責務。
     * 省略すると最後にフォーカスした要素を内部で記憶する。
     */
    activeKey?: K;
    /** 矢印キー等で移動先が決まったときに呼ばれる。フォーカス移動自体はフックが行う */
    onNavigate?: (key: K) => void;
};

type LinearOptions = {
    orientation: LinearOrientation;
    /** 端で反対側の端へ回り込むか。省略時は回り込まない */
    canLoop?: boolean;
};

type GridOptions<K extends string> = {
    orientation: 'grid';
    /** キーに対応するグリッド上の位置。undefined を返したキーは移動対象から外れる */
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

/**
 * このフックが処理対象とするキーかどうか。
 * 対象キーは移動先がなくてもブラウザ既定動作（ページスクロール等）を抑止するために使う。
 */
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
    // activeKey で制御されている間は内部 state を参照しないので、更新もしない（無駄な再描画を防ぐ）
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
            // 端で移動先がない場合もページスクロール等の既定動作は抑止する
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
