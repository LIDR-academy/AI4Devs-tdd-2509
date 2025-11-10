import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './playwright',
  timeout: 30_000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: process.env.API_BASE_URL ?? 'http://localhost:3010',
  },
  projects: [
    {
      name: 'api',
      use: devices['Desktop Chrome'],
    },
  ],
  // Uncomment if you want Playwright to start the backend automatically
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3010',
  //   reuseExistingServer: !process.env.CI,
  // },
});
