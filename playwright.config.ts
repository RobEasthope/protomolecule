import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E testing configuration for protomolecule monorepo
 * Tests run against the built Storybook instance to validate components in isolation
 *
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: Boolean(process.env.CI),

  // Run tests in parallel
  fullyParallel: true,

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Uncomment to test on more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Reporter to use
  reporter: process.env.CI
    ? [["html"], ["github"], ["list"]]
    : [["html"], ["list"]],

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Test directory
  testDir: "./e2e",

  // Shared settings for all projects
  use: {
    // Base URL for tests (Storybook runs on port 6006)
    baseURL: "http://localhost:6006",

    // Take screenshot on failure
    screenshot: "only-on-failure",

    // Collect trace on first retry
    trace: "on-first-retry",

    // Record video on first retry
    video: "retain-on-failure",
  },

  // Run Storybook dev server before starting tests
  webServer: {
    command: "pnpm storybook",
    reuseExistingServer: !process.env.CI,
    stderr: "pipe",
    stdout: "ignore",
    timeout: 120000, // 2 minutes for Storybook to start
    url: "http://localhost:6006",
  },

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
});
