import { test, expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import dayjs from 'dayjs';

test('駅の初期表示', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.departureStation).toHaveValue('THK01');
    await expect(scheduleSearchPage.arrivalStation).toHaveValue('THK02');
});

test('駅の初回選択肢', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(
        scheduleSearchPage.departureStation.locator('option'),
    ).toHaveText([
        `東京`,
        `大宮`,
        '小山',
        '宇都宮',
        '那須高原',
        '新白河',
        '郡山',
        '福島',
        '白石蔵王',
        '仙台',
        '古川',
        'くりこま高原',
        '一ノ関',
        '水沢江刺',
        '北上',
        '新花巻',
        '盛岡',
        'いわて沼宮内',
        '二戸',
        '八戸',
        '七戸十和田',
        '新青森',
        '米沢',
        '高畠',
        '赤湯',
        'かみのやま温泉',
        '山形',
        '天童',
        'さくらんぼ東根',
        '村山',
        '大石田',
        '新庄',
        '雫石',
        '田沢湖',
        '角館',
        '大曲',
        '秋田',
        '熊谷',
        '本庄早稲田',
        '高崎',
        '上毛高原',
        '越後湯沢',
        'ガーラ湯沢',
        '浦佐',
        '長岡',
        '燕三条',
        '新潟',
        '安中榛名',
        '軽井沢',
        '佐久平',
        '上田',
        '長野',
        '飯山',
        '上越妙高',
    ]);
});

test('駅を選択すると、その路線の駅のみ選択肢に表示される', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    scheduleSearchPage.departureStation.selectOption('THK09');
    await expect(
        scheduleSearchPage.arrivalStation.locator('option'),
    ).toHaveText([
        `東京`,
        `上野`,
        `大宮`,
        '小山',
        '宇都宮',
        '那須高原',
        '新白河',
        '郡山',
        '福島',
        '白石蔵王',
        '古川',
        'くりこま高原',
        '一ノ関',
        '水沢江刺',
        '北上',
        '新花巻',
        '盛岡',
        'いわて沼宮内',
        '二戸',
        '八戸',
        '七戸十和田',
        '新青森',
        '雫石',
        '田沢湖',
        '角館',
        '大曲',
        '秋田',
    ]);
});

test('出発日の初期は本日の日付、時刻の初期は現在の時刻', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    scheduleSearchPage.goto();
    await expect(scheduleSearchPage.date).toHaveValue(
        dayjs().format('YYYY-MM-DD'),
    );
    await expect(scheduleSearchPage.time).toHaveValue(dayjs().format('HH:mm'));
});

test('出発日は本日から一か月後まで選択できる', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    scheduleSearchPage.goto();
    await expect(scheduleSearchPage.date).toHaveAttribute(
        'min',
        dayjs().format('YYYY-MM-DD'),
    );
    await expect(scheduleSearchPage.date).toHaveAttribute(
        'max',
        dayjs().add(1, 'month').format('YYYY-MM-DD'),
    );
});

test('空席表示チェックボックスにチェックが入っていると満席がないこと、チェックをはずすと満席が0以上であること', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.availableTrainCheckBox).toBeChecked();
    await expect(page.getByText('満席')).toBeHidden();

    await scheduleSearchPage.clickAvailableTrainCheckBox();
    await expect(scheduleSearchPage.availableTrainCheckBox).not.toBeChecked();
    const fullTrainCount = await page.getByText('満席').count();
    await expect(fullTrainCount).toBeGreaterThanOrEqual(0);
});
