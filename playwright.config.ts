import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

const SHOP_URL = 'https://www.saucedemo.com';
const API_URL = 'https://dummyjson.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI, // a stray test.only() fails the CI build instead of silently skipping the suite
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,

  reporter: isCI
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    // SauceDemo marks elements with data-test, so getByTestId() reads that attribute.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // API tests need no browser, so they run once instead of once per browser.
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_URL },
    },
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: SHOP_URL },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'], baseURL: SHOP_URL },
    },
    {
      name: 'webkit',
      testDir: './tests/ui',
      use: { ...devices['Desktop Safari'], baseURL: SHOP_URL },
    },
  ],
});
