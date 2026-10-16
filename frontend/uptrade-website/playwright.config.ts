import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT || 3311)

// Smoke tests run against a production build (`npm run build` first). /api/* is mocked in the tests.
export default defineConfig({
    testDir: 'tests/e2e',
    timeout: 30_000,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['list']] : 'list',
    use: { baseURL: `http://localhost:${PORT}`, viewport: { width: 1440, height: 900 }, trace: 'retain-on-failure' },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
    webServer: {
        command: `npx next start -p ${PORT}`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
    },
})
