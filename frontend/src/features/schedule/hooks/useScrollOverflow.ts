import type { DependencyList } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export function useScrollOverflow(deps: DependencyList = []) {
    const ref = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) return;

        const update = () => {
            const { scrollLeft, clientWidth, scrollWidth } = element;
            setCanScrollLeft(scrollLeft > 1);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
        };

        update();
        element.addEventListener('scroll', update, { passive: true });
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(element);

        return () => {
            element.removeEventListener('scroll', update);
            resizeObserver.disconnect();
        };
    }, deps);

    return { ref, canScrollLeft, canScrollRight };
}
