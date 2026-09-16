import { useEffect } from 'react';

// Tailwind の md ブレークポイント。この幅以上ではシートが
// 常時表示レイアウト（md:static）になりロック自体が不要になる
const DESKTOP_MEDIA_QUERY = '(min-width: 768px)';

export function useLockBodyScroll(isLocked: boolean) {
    useEffect(() => {
        if (!isLocked) return;

        const { body } = document;
        const previousStyle = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
        };
        let scrollY = window.scrollY;

        const lock = () => {
            scrollY = window.scrollY;
            body.style.position = 'fixed';
            body.style.top = `-${scrollY}px`;
            body.style.width = '100%';
            body.style.overflow = 'hidden';
        };

        const unlock = () => {
            body.style.position = previousStyle.position;
            body.style.top = previousStyle.top;
            body.style.width = previousStyle.width;
            body.style.overflow = previousStyle.overflow;
            window.scrollTo(0, scrollY);
        };

        const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
        if (!mediaQuery.matches) {
            lock();
        }

        // デスクトップ幅をまたいでリサイズ・画面回転されたら
        // ロックの有無を追従させる（デスクトップ幅ではシートを
        // 閉じる手段がなく、ロックされたままになるのを防ぐ）
        const handleBreakpointChange = (e: MediaQueryListEvent) => {
            if (e.matches) {
                unlock();
            } else {
                lock();
            }
        };
        mediaQuery.addEventListener('change', handleBreakpointChange);

        return () => {
            mediaQuery.removeEventListener('change', handleBreakpointChange);
            unlock();
        };
    }, [isLocked]);
}
