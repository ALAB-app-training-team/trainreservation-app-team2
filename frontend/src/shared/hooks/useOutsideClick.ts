import { type RefObject, useEffect, useRef } from 'react';

export function useOutsideClick(
    callback: () => void,
    isActive: boolean,
    triggerRef?: RefObject<HTMLElement | null>,
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };
        const handleFocusOut = (event: FocusEvent) => {
            const nextFocused = event.relatedTarget as Node | null;
            if (
                ref.current &&
                (!nextFocused || !ref.current.contains(nextFocused))
            ) {
                callback();
            }
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            callback();
            triggerRef?.current?.focus();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('focusout', handleFocusOut);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('focusout', handleFocusOut);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isActive, callback, triggerRef]);

    return { ref };
}
