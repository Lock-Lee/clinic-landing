import { defineConfig, devices } from "@playwright/test";

// e2e ของทั้ง monorepo: ต้องเปิด Docker (bun run db:up) ก่อน
// dev server ที่เปิดอยู่แล้วจะถูกใช้ต่อ ไม่มีก็สั่งเปิดให้ (ห้าม build ระหว่าง dev เปิดอยู่)
// รันทีละเทสต์ เพราะทุกเว็บใช้ฐานข้อมูลชุดเดียวกัน
const app = (filter: string, port: number) => ({
  command: `bunx turbo run dev --filter=${filter}`,
  cwd: "..",
  url: `http://localhost:${port}`,
  reuseExistingServer: true,
  timeout: 120_000,
});

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",
  use: {
    ...devices["Desktop Chrome"],
    locale: "th-TH",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: [
    app("landing", 3000),
    app("clinic-demo", 3001),
    app("clinic-starter-demo", 3002),
    app("clinic-full-demo", 3003),
    app("admin", 3010),
  ],
});
