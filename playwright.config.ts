import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    {
      name: "desktop",
      testMatch: "mock.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:3100" },
    },
    {
      name: "mobile",
      testMatch: "mock.spec.ts",
      use: {
        ...devices["Pixel 7"],
        defaultBrowserType: "chromium",
        baseURL: "http://127.0.0.1:3100",
      },
    },
    {
      name: "live-adapter",
      testMatch: "live.spec.ts",
      use: { ...devices["Desktop Chrome"], baseURL: "http://127.0.0.1:3101" },
    },
  ],
  webServer: [
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
      url: "http://127.0.0.1:3100",
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_NEEDIT_API_MODE: "mock",
        NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3100",
        NEXT_DIST_DIR: ".next-test-mock",
      },
    },
    {
      command: "npm run dev -- --hostname 127.0.0.1 --port 3101",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: false,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_NEEDIT_API_MODE: "live",
        NEXT_PUBLIC_NEEDIT_API_BASE_URL: "http://127.0.0.1:4400",
        NEXT_PUBLIC_NEEDIT_CONTRACT_VERIFIED: "true",
        NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3101",
        NEXT_DIST_DIR: ".next-test-live",
      },
    },
  ],
});
