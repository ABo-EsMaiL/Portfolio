import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', testMatch: '**/*.spec.ts', workers: 1,
  outputDir: '.tools/test-results', reporter: 'list',
  expect: { timeout: 10000 }, // Owner-requested 1.6s data hold and dust exit extend the automatic intro.
  use: { baseURL: 'http://127.0.0.1:3000', channel: 'msedge', headless: true },
});
