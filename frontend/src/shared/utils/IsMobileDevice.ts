const MOBILE_MEDIA_QUERY = '(pointer: coarse) and (max-width: 767px)';

export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent;

    const isDesktopModeMobile =
        userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1;

    return (
        /iPhone|iPad|iPod|Android/i.test(userAgent) ||
        isDesktopModeMobile ||
        window.matchMedia(MOBILE_MEDIA_QUERY).matches
    );
};
