import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium';
const envExe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const chromiumPath = envExe
  ? envExe
  : existsSync(SANDBOX_CHROMIUM)
    ? SANDBOX_CHROMIUM
    : undefined;

const launchOptions = chromiumPath ? { executablePath: chromiumPath } : {};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions,
      },
    },
    {
      name: 'pixel-7',
      use: {
        ...devices['Pixel 7'],
        launchOptions,
      },
    },
    {
      name: 'iphone-14',
      use: {
        ...devices['iPhone 14'],
        defaultBrowserType: 'chromium',
        launchOptions,
      },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
