// @ts-check
import { defineConfig, devices } from "@playwright/test";
import { config as testConfig } from "./config/config.js";
// import dotenv from "dotenv";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */
// dotenv.config();

const config = defineConfig({
  testDir: "./tests",
  testMatch: "tests/**/*.spec.js",
  testIgnore: [
    "tests/example.spec.js",
    "tests-examples/**/*.spec.js",
    "tests/auth/*.spec.js",
    "tests/api/carAPIMethods/**/*.spec.js",
  ],
  /* Timeout for every tests */
  timeout: 90000,
  /* Expect assertion */
  expect: {
    timeout: 10000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ["html", { open: process.env.CI ? "never" : "on-failure" }],
    ["list"],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testConfig.baseURL,
    headless: true,
    httpCredentials: testConfig.httpCredentials,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    launchOptions: {
      slowMo: 500,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "setup",
      testMatch: "**/setup/**/*.setup.js",
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
    {
      name: "api",
      testMatch: "tests/api/carAPIMethods/**/*.spec.js",
      fullyParallel: false,
    },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
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
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

export default config;
