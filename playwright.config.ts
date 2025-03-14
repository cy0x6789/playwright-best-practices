import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
    testDir: './src/tests',
    timeout: 30000,
    retries: 2,
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure'
    },
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }]
    ],
    projects: [
        {
            name: 'Chrome',
            use: { browserName: 'chromium' }
        },
        {
            name: 'Firefox',
            use: { browserName: 'firefox' }
        },
        {
            name: 'WebKit',
            use: { browserName: 'webkit' }
        }
    ]
};

export default config;
