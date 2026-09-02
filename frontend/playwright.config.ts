import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(import.meta.dirname, '.env') });
// console.log('process.env.VITA_WEB_BASE_URL', process.env.VITA_WEB_BASE_URL);
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',
    /* ローカル実行時はvisualRegressionを除外し、GitHubActionでのみ実行する */
    testIgnore: process.env.CI ? [] : ['**/visualRegression.spec.ts'],
    snapshotPathTemplate:
        '{testDir}/{testFileDir}/visualRegression.spec.ts-snapshots/{arg}{ext}',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: 1,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        locale: 'ja-JP',
        actionTimeout: 5 * 1000, // clickなどのtimeout値を設定
    },

    /* Configure projects for major browsers */
    projects: [
        // {
        //     name: 'chromium',
        //     use: { ...devices['Desktop Chrome'] },
        // },

        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },

        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        {
            name: 'Microsoft Edge',
            use: { ...devices['Desktop Edge'], channel: 'msedge' },
        },
        // {
        //   name: 'Google Chrome',
        //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        // },
    ],

    webServer: [
        {
            command: 'npm run dev',
            url: 'http://localhost:5173',
            reuseExistingServer: !process.env.CI,
            stdout: 'ignore',
            stderr: 'pipe',
        },
        {
            command: `cd ../backend && chmod +x gradlew && ./gradlew bootRun --args='--spring.profiles.active=local' --stacktrace`,
            url: 'http://localhost:8080/api/reservations',
            reuseExistingServer: !process.env.CI,
            timeout: 300 * 1000,
            stdout: 'ignore',
            stderr: 'pipe',
        },
    ],
});
