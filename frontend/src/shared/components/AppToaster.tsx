import { useEffect, useRef } from 'react';
import { Toaster, type ToasterProps } from 'sonner';

export function AppToaster(props: ToasterProps) {
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    const actionButton = node.matches('[data-action]')
                        ? node
                        : node.querySelector<HTMLElement>('[data-action]');
                    actionButton?.focus();
                }
            }
        });
        observer.observe(container, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, []);

    return <Toaster ref={containerRef} {...props} />;
}
