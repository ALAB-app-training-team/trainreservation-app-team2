import { useEffect } from 'react';

export function useLockBodyScroll(isLocked: boolean) {
    useEffect(() => {
        if (!isLocked) return;

        const scrollY = window.scrollY;
        const { body } = document;
        const previousStyle = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
        };

        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';

        return () => {
            body.style.position = previousStyle.position;
            body.style.top = previousStyle.top;
            body.style.width = previousStyle.width;
            body.style.overflow = previousStyle.overflow;
            window.scrollTo(0, scrollY);
        };
    }, [isLocked]);
}
