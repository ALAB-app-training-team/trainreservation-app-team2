import { useSyncExternalStore } from 'react';

const MD_MEDIA_QUERY = '(min-width: 768px)';

const mediaQuery =
    typeof window === 'undefined' ? null : window.matchMedia(MD_MEDIA_QUERY);

const subscribe = (onStoreChange: () => void) => {
    mediaQuery?.addEventListener('change', onStoreChange);
    return () => mediaQuery?.removeEventListener('change', onStoreChange);
};

export function useIsBelowMd() {
    return useSyncExternalStore(
        subscribe,
        () => !(mediaQuery?.matches ?? true),
        () => false,
    );
}
