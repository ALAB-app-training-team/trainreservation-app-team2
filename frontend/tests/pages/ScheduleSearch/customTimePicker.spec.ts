import { expect, test } from '@playwright/test';
import type { Browser, BrowserContextOptions } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';

const IPHONE_USER_AGENT =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const ANDROID_USER_AGENT =
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';
const MAC_USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15';
const WINDOWS_USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0';

type DeviceProfile = {
    name: string;
    isMobile: boolean;
    contextOptions: BrowserContextOptions;
    maxTouchPoints?: number;
};

const DEVICE_PROFILES: DeviceProfile[] = [
    {
        name: 'iPhone',
        isMobile: true,
        contextOptions: {
            userAgent: IPHONE_USER_AGENT,
            viewport: { width: 390, height: 844 },
            hasTouch: true,
            isMobile: true,
        },
    },
    {
        // 横向きでは画面幅が md 以上になりメディアクエリでは拾えないため、
        // UA 条件が効いていることを確認する
        name: 'iPhone（横向き）',
        isMobile: true,
        contextOptions: {
            userAgent: IPHONE_USER_AGENT,
            viewport: { width: 844, height: 390 },
            hasTouch: true,
            isMobile: true,
        },
    },
    {
        name: 'Android',
        isMobile: true,
        contextOptions: {
            userAgent: ANDROID_USER_AGENT,
            viewport: { width: 412, height: 915 },
            hasTouch: true,
            isMobile: true,
        },
    },
    {
        // UA からはモバイルと判別できず、maxTouchPoints でのみ拾えるケース
        name: 'iPad（デスクトップ用Webサイトを表示）',
        isMobile: true,
        contextOptions: {
            userAgent: MAC_USER_AGENT,
            viewport: { width: 1024, height: 1366 },
            hasTouch: true,
        },
        maxTouchPoints: 5,
    },
    {
        // タッチ対応PCは要件上モバイル扱いしない
        name: 'Windows タッチPC（Surface）',
        isMobile: false,
        contextOptions: {
            userAgent: WINDOWS_USER_AGENT,
            viewport: { width: 1280, height: 800 },
            hasTouch: true,
        },
        maxTouchPoints: 10,
    },
    {
        name: '通常のPC',
        isMobile: false,
        contextOptions: {
            userAgent: WINDOWS_USER_AGENT,
            viewport: { width: 1280, height: 800 },
            hasTouch: false,
        },
    },
];

const openScheduleSearch = async (
    browser: Browser,
    baseURL: string | undefined,
    profile: DeviceProfile,
) => {
    const context = await browser.newContext({
        baseURL,
        ...profile.contextOptions,
    });
    if (profile.maxTouchPoints !== undefined) {
        await context.addInitScript((maxTouchPoints: number) => {
            Object.defineProperty(navigator, 'maxTouchPoints', {
                get: () => maxTouchPoints,
            });
        }, profile.maxTouchPoints);
    }

    const page = await context.newPage();
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');

    return { context, page, time: scheduleSearchPage.time };
};

for (const profile of DEVICE_PROFILES) {
    test(`${profile.name}では時刻入力欄が${profile.isMobile ? '読み取り専用になる' : '直接入力できる'}`, async ({
        browser,
        baseURL,
    }) => {
        const { context, time } = await openScheduleSearch(
            browser,
            baseURL,
            profile,
        );

        await expect(time).toHaveJSProperty('readOnly', profile.isMobile);

        await context.close();
    });
}

test('モバイル端末では数字キー・Backspaceで時刻が変わらない', async ({
    browser,
    baseURL,
}) => {
    const profile = DEVICE_PROFILES[0];
    const { context, page, time } = await openScheduleSearch(
        browser,
        baseURL,
        profile,
    );

    await time.click();
    const initialValue = await time.inputValue();

    await page.keyboard.press('0');
    await page.keyboard.press('7');
    await expect(time).toHaveValue(initialValue);

    await page.keyboard.press('Backspace');
    await expect(time).toHaveValue(initialValue);

    await page.keyboard.press('Delete');
    await expect(time).toHaveValue(initialValue);

    await context.close();
});

test('モバイル端末でも矢印キーでは操作でき、分は5分単位になる', async ({
    browser,
    baseURL,
}) => {
    const profile = DEVICE_PROFILES[0];
    const { context, page, time } = await openScheduleSearch(
        browser,
        baseURL,
        profile,
    );

    await time.click();
    // 分を編集対象にしてから値を送る
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');

    const minute = (await time.inputValue()).split(':')[1];
    expect(Number(minute) % 5).toBe(0);

    await context.close();
});

test('PCでは従来どおり数字キーで時刻を直接入力できる', async ({
    browser,
    baseURL,
}) => {
    const profile = DEVICE_PROFILES[DEVICE_PROFILES.length - 1];
    const { context, page, time } = await openScheduleSearch(
        browser,
        baseURL,
        profile,
    );

    await time.click();
    // 入力欄の余白をクリックするとキャレットが分側に入るため、
    // 時を編集対象にしてから入力する
    await page.keyboard.press('ArrowLeft');
    await page.keyboard.press('0');
    await page.keyboard.press('7');
    await page.keyboard.press('2');
    await page.keyboard.press('3');

    // 5分単位ではない値も入力できること（予約変更の初期表示と同じ粒度）
    await expect(time).toHaveValue('07:23');

    await context.close();
});
