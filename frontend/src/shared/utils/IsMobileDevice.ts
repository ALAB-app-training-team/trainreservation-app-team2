// モバイル端末のUA。判定はUAを主とする
const MOBILE_USER_AGENT_REGEX = /iPhone|iPad|iPod|Android/i;

// タッチ対応PC（Surface / ChromeOS / X11のLinux）のUA。幅による判定から除外する
const DESKTOP_OS_USER_AGENT_REGEX = /Windows NT|CrOS|X11/;

// iPad（短辺768px・長辺1024px）相当までをタブレットとみなす画面サイズの上限
const TABLET_MAX_SCREEN_SIZE = 1024;

export const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;

    const userAgent = navigator.userAgent;
    const hasTouch = navigator.maxTouchPoints >= 1;

    // デスクトップ表示のiPadはUAがMacintoshになるため、タッチ有無で判別する
    const isDesktopModeIPad = userAgent.includes('Macintosh') && hasTouch;

    if (MOBILE_USER_AGENT_REGEX.test(userAgent) || isDesktopModeIPad)
        return true;

    // UAで判別できない端末向けの補助判定。
    // ウィンドウ幅ではなく画面サイズを見るため、ウィンドウを狭めても判定は変わらない。
    // またタッチ対応PCを除くため、iPad相当のタブレットサイズまでに限定する。
    return (
        hasTouch &&
        !DESKTOP_OS_USER_AGENT_REGEX.test(userAgent) &&
        Math.min(window.screen.width, window.screen.height) <=
            TABLET_MAX_SCREEN_SIZE
    );
};
