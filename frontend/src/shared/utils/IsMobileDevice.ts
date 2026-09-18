export const isMobileDevice = () => {
    if (typeof navigator === 'undefined') return false;

    const userAgent = navigator.userAgent;
    const isIPadOS =
        userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1;

    return /iPhone|iPad|iPod|Android/i.test(userAgent) || isIPadOS;
};
