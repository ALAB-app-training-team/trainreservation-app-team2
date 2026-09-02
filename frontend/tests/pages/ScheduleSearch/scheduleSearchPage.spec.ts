import { test, expect } from '@playwright/test';
import { ScheduleSearchPage } from '@tests/pages/ScheduleSearch/ScheduleSearchPage';
import dayjs from 'dayjs';

test('駅の初期表示・初回選択肢', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(page.getByTestId('departureStation-select')).toContainText(
        '東京',
    );
    await expect(page.getByTestId('arrivalStation-select')).toContainText(
        '上野',
    );
    await scheduleSearchPage.openDepartureStationDropdown();
    await expect(page.getByRole('option')).toHaveText([
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

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await scheduleSearchPage.selectDepartureStation('仙台');
    await scheduleSearchPage.openArrivalStationDropdown();
    await expect(page.getByRole('option')).toHaveText([
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

test('駅を検索できる', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');

    // 検索して駅を絞り込める
    await scheduleSearchPage.openDepartureStationDropdown();
    await scheduleSearchPage.departureStation.fill('新');
    await expect(page.getByRole('option')).toHaveText([
        '新白河',
        '新花巻',
        '新青森',
        '新庄',
        '新潟',
    ]);

    // 検索しても選択中の駅が変わらない
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('departureStation-select')).toContainText(
        '東京',
    );

    // 検索した駅を選択できる
    await scheduleSearchPage.openDepartureStationDropdown();
    await scheduleSearchPage.departureStation.fill('新');
    await page.getByRole('option', { name: '新青森' }).click();
    await expect(page.getByTestId('departureStation-select')).toContainText(
        '新青森',
    );

    // 存在しない駅で検索しても、選択中の駅が変わらない
    await scheduleSearchPage.openDepartureStationDropdown();
    await scheduleSearchPage.departureStation.fill('存在しない駅');
    await expect(page.getByText('該当する駅が見つかりません')).toBeVisible();
    await expect(page.getByRole('option')).toHaveCount(0);
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('departureStation-select')).toContainText(
        '新青森',
    );

    // 検索文字列を消すとすべて表示される
    await scheduleSearchPage.openDepartureStationDropdown();
    await scheduleSearchPage.departureStation.fill('新');
    await expect(page.getByRole('option')).toHaveText([
        '新白河',
        '新花巻',
        '新青森',
        '新庄',
        '新潟',
    ]);
    await scheduleSearchPage.departureStation.clear();
    await expect(page.getByRole('option')).toHaveText([
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

    // 出発駅で絞り込まれた到着駅に対して駅名検索できる
    await scheduleSearchPage.selectDepartureStation('仙台');
    await scheduleSearchPage.openArrivalStationDropdown();
    await scheduleSearchPage.arrivalStation.fill('新');
    await expect(page.getByRole('option')).toHaveText([
        '新白河',
        '新花巻',
        '新青森',
    ]);
    await expect(page.getByRole('option', { name: '新庄' })).toHaveCount(0);
    await expect(page.getByRole('option', { name: '新潟' })).toHaveCount(0);
});

test('乗車日の初期は本日の日付、時刻の初期は現在の時刻', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(scheduleSearchPage.date).toHaveValue(
        dayjs().format('YYYY-MM-DD'),
    );
    await expect(scheduleSearchPage.time).toHaveValue(dayjs().format('HH:mm'));
});

test('乗車日は本日から一か月後まで選択できる', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(scheduleSearchPage.date).toHaveAttribute(
        'min',
        dayjs().format('YYYY-MM-DD'),
    );
    await expect(scheduleSearchPage.date).toHaveAttribute(
        'max',
        dayjs().add(1, 'month').format('YYYY-MM-DD'),
    );
});

test('出発駅・到着駅の入れ替えができること', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(page.getByTestId('departureStation-select')).toContainText(
        '東京',
    );
    await expect(page.getByTestId('arrivalStation-select')).toContainText(
        '上野',
    );
    await scheduleSearchPage.clickSwitchStationButton();
    await expect(page.getByTestId('departureStation-select')).toContainText(
        '上野',
    );
    await expect(page.getByTestId('arrivalStation-select')).toContainText(
        '東京',
    );
});

test('出発時刻・到着時刻の切り替えができること、空席表示チェックボックスにチェックが入っていると満席がないこと、チェックをはずすと満席が0以上であること', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    await scheduleSearchPage.goto();
    await expect(page).toHaveURL('/scheduleSearch');
    await expect(scheduleSearchPage.departureTimeButton).toBeChecked();
    await expect(scheduleSearchPage.availableTrainCheckBox).toBeChecked();
    await expect(page.getByText('満席')).toBeHidden();

    // 出発時刻で検索
    await scheduleSearchPage.time.fill('06:20');
    await expect(
        page.getByTestId('schedule-departure-time').first(),
    ).toHaveText('06:20');
    const departureTimes = await page
        .getByTestId('schedule-departure-time')
        .allTextContents();
    departureTimes.forEach((time) => {
        expect(time >= '06:20').toBe(true);
    });
    const sortedDepartureTimes = [...departureTimes].sort((a, b) =>
        a.localeCompare(b),
    );
    expect(departureTimes).toEqual(sortedDepartureTimes);
    // 「空席がある列車のみ表示する」ボタンを外す
    await scheduleSearchPage.clickAvailableTrainCheckBox();
    await expect(scheduleSearchPage.availableTrainCheckBox).not.toBeChecked();
    const fullTrainCountWithDepartureTime = await page
        .getByText('満席')
        .count();
    await expect(fullTrainCountWithDepartureTime).toBeGreaterThanOrEqual(0);
    const departureTimesWithUnavailableTrain = await page
        .getByTestId('schedule-departure-time')
        .allTextContents();
    departureTimesWithUnavailableTrain.forEach((time) => {
        expect(time >= '06:20').toBe(true);
    });
    const sortedDepartureTimesWithUnavailableTrain = [
        ...departureTimesWithUnavailableTrain,
    ].sort((a, b) => a.localeCompare(b));
    expect(departureTimesWithUnavailableTrain).toEqual(
        sortedDepartureTimesWithUnavailableTrain,
    );

    // 到着時刻で検索
    await scheduleSearchPage.clickAvailableTrainCheckBox();
    await expect(scheduleSearchPage.availableTrainCheckBox).toBeChecked();
    await scheduleSearchPage.clickArrivalTimeButton();
    await expect(scheduleSearchPage.arrivalTimeButton).toBeChecked();
    await scheduleSearchPage.time.fill('06:37');
    await expect(page.getByTestId('schedule-arrival-time').first()).toHaveText(
        '06:37',
    );
    const arrivalTimes = await page
        .getByTestId('schedule-arrival-time')
        .allTextContents();
    arrivalTimes.forEach((time) => {
        expect(time <= '06:37').toBe(true);
    });
    const sortedArrivalTimes = [...arrivalTimes].sort((a, b) =>
        b.localeCompare(a),
    );
    expect(arrivalTimes).toEqual(sortedArrivalTimes);
    // 「空席がある列車のみ表示する」ボタンを外す
    await scheduleSearchPage.clickAvailableTrainCheckBox();
    await expect(scheduleSearchPage.availableTrainCheckBox).not.toBeChecked();
    const fullTrainCountWithArrivalTime = await page.getByText('満席').count();
    await expect(fullTrainCountWithArrivalTime).toBeGreaterThanOrEqual(0);
    const arrivalTimesWithUnavailableTrain = await page
        .getByTestId('schedule-arrival-time')
        .allTextContents();
    arrivalTimesWithUnavailableTrain.forEach((time) => {
        expect(time <= '06:37').toBe(true);
    });
    const sortedArrivalTimesWithUnavailableTrain = [
        ...arrivalTimesWithUnavailableTrain,
    ].sort((a, b) => b.localeCompare(a));
    expect(arrivalTimesWithUnavailableTrain).toEqual(
        sortedArrivalTimesWithUnavailableTrain,
    );
});

test('列車が見つからない場合、翌日の始発で検索できる', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    const currentDate = await scheduleSearchPage.date.inputValue();
    const expectedNextDate = dayjs(currentDate)
        .add(1, 'day')
        .format('YYYY-MM-DD');

    // 時刻が00:00になること
    await scheduleSearchPage.time.fill('23:59');
    await expect(scheduleSearchPage.searchNextDayButton).toBeVisible();
    await scheduleSearchPage.clickSearchNextDayButton();
    await expect(scheduleSearchPage.date).toHaveValue(expectedNextDate);
    await expect(scheduleSearchPage.time).toHaveValue('00:00');
    await expect(scheduleSearchPage.departureTimeButton).toBeChecked();

    // 出発時刻で検索されること
    await scheduleSearchPage.clickArrivalTimeButton();
    await expect(scheduleSearchPage.searchNextDayButton).toBeVisible();
    await scheduleSearchPage.clickSearchNextDayButton();
    await expect(scheduleSearchPage.departureTimeButton).toBeChecked();

    // 検索可能期間の上限日の場合、翌日の始発検索ボタンが非活性になること
    await scheduleSearchPage.date.fill(
        dayjs().add(1, 'month').format('YYYY-MM-DD'),
    );
    await scheduleSearchPage.time.fill('23:59');
    await expect(scheduleSearchPage.searchNextDayButton).toBeDisabled();
    await expect(
        page.getByText('予約可能期間を超えるため、翌日は検索できません'),
    ).toBeVisible();
});

test('座席種別と人数のドロップダウンが表示され、初期値がハイフンであること', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    await expect(scheduleSearchPage.seatTypeSelect).toBeVisible();
    await expect(scheduleSearchPage.passengersSelect).toBeVisible();

    await expect(
        page.locator('#seatType').locator('..').locator('..'),
    ).toContainText('-');
    await expect(
        page.locator('#passengers').locator('..').locator('..'),
    ).toContainText('-');
});

test('座席種別を指定すると、空席チェックがONかつ無効化され補足テキストが表示される', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    await scheduleSearchPage.selectSeatType('指定席');

    await expect(scheduleSearchPage.availableTrainCheckBox).toBeChecked();
    await expect(scheduleSearchPage.availableTrainCheckBox).toBeDisabled();
    await expect(scheduleSearchPage.isOnlyAvailableHint).toBeVisible();
    await expect(scheduleSearchPage.isOnlyAvailableHint).toHaveText(
        /座席種別または人数を指定中は自動で空席がある列車のみ表示されます/,
    );
});

test('人数を指定すると、空席チェックがONかつ無効化され補足テキストが表示される', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    await scheduleSearchPage.selectPassengers('3人');

    await expect(scheduleSearchPage.availableTrainCheckBox).toBeChecked();
    await expect(scheduleSearchPage.availableTrainCheckBox).toBeDisabled();
    await expect(scheduleSearchPage.isOnlyAvailableHint).toBeVisible();
    await expect(scheduleSearchPage.isOnlyAvailableHint).toHaveText(
        /座席種別または人数を指定中は自動で空席がある列車のみ表示されます/,
    );
});

test('座席種別をハイフンに戻すと空席チェックが操作可能になる', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    await scheduleSearchPage.selectSeatType('指定席');
    await scheduleSearchPage.selectSeatType('-');

    await expect(scheduleSearchPage.availableTrainCheckBox).toBeEnabled();
    await expect(scheduleSearchPage.isOnlyAvailableHint).toBeHidden();
});

test('人数をハイフンに戻すと空席チェックが操作可能になる', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    await scheduleSearchPage.selectPassengers('3人');
    await scheduleSearchPage.selectPassengers('-');

    await expect(scheduleSearchPage.availableTrainCheckBox).toBeEnabled();
    await expect(scheduleSearchPage.isOnlyAvailableHint).toBeHidden();
});

test('座席種別がハイフンの時に空席チェックをオフにできる', async ({ page }) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);
    await scheduleSearchPage.goto();

    await expect(page.getByText(/\d+件の列車が見つかりました/)).toBeVisible();

    await expect(scheduleSearchPage.availableTrainCheckBox).toBeEnabled();
    await expect(scheduleSearchPage.availableTrainCheckBox).toBeChecked();

    await scheduleSearchPage.unCheckAvailableTrainCheckBox();
    await expect(scheduleSearchPage.availableTrainCheckBox).not.toBeChecked();
});

test('グランクラスかつ4人指定時に、グランクラス残席が4未満の列車は返されない', async ({
    page,
}) => {
    const scheduleSearchPage = new ScheduleSearchPage(page);

    const responsePromise = page.waitForResponse(
        (response) =>
            response.url().includes('/schedules') && response.status() === 200,
    );

    await scheduleSearchPage.goto();
    const response = await responsePromise;
    const allSchedules = await response.json();

    const resultLocator = page.getByText(/\d+件の列車が見つかりました/);
    await expect(resultLocator).toBeVisible();

    const time = await page.getByRole('textbox', { name: '時刻' }).inputValue();

    await scheduleSearchPage.selectSeatType('グランクラス');
    await scheduleSearchPage.selectPassengers('4人');

    await expect(resultLocator).toBeVisible();

    const displayCount = Number(
        (await resultLocator.textContent())?.match(/(\d+)/)?.[1],
    );

    const expectedCount = allSchedules.filter(
        (schedule: { gcSeats: number; departureTime: string }) =>
            schedule.gcSeats >= 4 &&
            schedule.departureTime.slice(0, 5) >= time.slice(0, 5),
    ).length;

    expect(displayCount).toBe(expectedCount);
});
