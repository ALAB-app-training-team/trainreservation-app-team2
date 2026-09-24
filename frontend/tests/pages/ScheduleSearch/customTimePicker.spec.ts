import { expect, test } from '@playwright/test';
import type { Browser, ViewportSize } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';

const MD_BREAKPOINT = 768;
const NARROW_VIEWPORT: ViewportSize = { width: MD_BREAKPOINT - 1, height: 844 };
const WIDE_VIEWPORT: ViewportSize = { width: MD_BREAKPOINT, height: 800 };

type ViewportProfile = {
    name: string;
    isNarrowScreen: boolean;
    viewport: ViewportSize;
};

const VIEWPORT_PROFILES: ViewportProfile[] = [
    {
        name: 'スマートフォン幅',
        isNarrowScreen: true,
        viewport: { width: 390, height: 844 },
    },
    {
        name: 'md 直前の幅',
        isNarrowScreen: true,
        viewport: NARROW_VIEWPORT,
    },
    {
        name: 'md ちょうどの幅',
        isNarrowScreen: false,
        viewport: WIDE_VIEWPORT,
    },
    {
        name: 'PC 幅',
        isNarrowScreen: false,
        viewport: { width: 1280, height: 800 },
    },
];

const openScheduleSearch = async (
    browser: Browser,
    baseURL: string | undefined,
    viewport: ViewportSize,
) => {
    const context = await browser.newContext({ baseURL, viewport });
    const page = await context.newPage();
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');

    return { context, page, time: scheduleSearchPage.time };
};

for (const profile of VIEWPORT_PROFILES) {
    test(`${profile.name}では時刻入力欄が${profile.isNarrowScreen ? '読み取り専用になる' : '直接入力できる'}`, async ({
        browser,
        baseURL,
    }) => {
        const { context, time } = await openScheduleSearch(
            browser,
            baseURL,
            profile.viewport,
        );

        await expect(time).toHaveJSProperty('readOnly', profile.isNarrowScreen);

        await context.close();
    });
}

test('md をまたぐリサイズで読み取り専用の切り替わりが追従する', async ({
    browser,
    baseURL,
}) => {
    const { context, page, time } = await openScheduleSearch(
        browser,
        baseURL,
        WIDE_VIEWPORT,
    );

    await expect(time).toHaveJSProperty('readOnly', false);

    await page.setViewportSize(NARROW_VIEWPORT);
    await expect(time).toHaveJSProperty('readOnly', true);

    await page.setViewportSize(WIDE_VIEWPORT);
    await expect(time).toHaveJSProperty('readOnly', false);

    await context.close();
});

test('md 未満では数字キー・Backspaceで時刻が変わらない', async ({
    browser,
    baseURL,
}) => {
    const { context, page, time } = await openScheduleSearch(
        browser,
        baseURL,
        NARROW_VIEWPORT,
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

test('md 未満でも矢印キーでは操作でき、分は5分単位になる', async ({
    browser,
    baseURL,
}) => {
    const { context, page, time } = await openScheduleSearch(
        browser,
        baseURL,
        NARROW_VIEWPORT,
    );

    await time.click();
    // 分を編集対象にしてから値を送る
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowDown');

    const minute = (await time.inputValue()).split(':')[1];
    expect(Number(minute) % 5).toBe(0);

    await context.close();
});

test('md 以上では従来どおり数字キーで時刻を直接入力できる', async ({
    browser,
    baseURL,
}) => {
    const { context, page, time } = await openScheduleSearch(browser, baseURL, {
        width: 1280,
        height: 800,
    });

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
