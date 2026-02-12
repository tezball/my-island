import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 60_000,
    expect: {
        timeout: 10_000,
    },
    fullyParallel: false,
    retries: 0,
    workers: 1,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:5173',
        video: 'on',
        screenshot: 'on',
        trace: 'retain-on-failure',
        viewport: { width: 390, height: 844 }, // iPhone 14 Pro — mobile-first app
    },
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});
