import { devices } from "@playwright/test";
import { test } from "../fixtures/db";
import { URL, enterDemoAdmin, expectNoHorizontalScroll } from "../fixtures/helpers";

// ทุกหน้าต้องใช้ได้บนมือถือ 375px (ไม่เลื่อนแนวนอน)
test.use({ ...devices["iPhone 13 mini"], viewport: { width: 375, height: 812 } });

const pages = [
  URL.landing,
  URL.starter,
  URL.standard,
  `${URL.standard}/line`,
  URL.premium,
  `${URL.premium}/services`,
  `${URL.premium}/articles`,
  `${URL.premium}/about`,
  `${URL.premium}/contact`,
  `${URL.admin}/login`,
];

for (const url of pages) {
  test(`375px: ${url.replace("http://localhost:", ":")}`, async ({ page }) => {
    await page.goto(url);
    await expectNoHorizontalScroll(page);
  });
}

for (const base of [URL.starter, URL.standard, URL.premium]) {
  test(`375px หลังบ้าน: ${base.replace("http://localhost:", ":")}/admin`, async ({ page }) => {
    await enterDemoAdmin(page, base);
    await expectNoHorizontalScroll(page);
  });
}

test("375px เมนูมือถือ Premium กางเมนูย่อยได้", async ({ page }) => {
  await page.goto(URL.premium);
  await page.getByRole("button", { name: "เมนู" }).click();
  const item = page.locator(".sk-nav-item", { hasText: "บริการ" }).first();
  await item.getByRole("button", { name: /เมนูย่อย/ }).click();
  await test.expect(item.locator(".sk-sub")).toBeVisible();
  await expectNoHorizontalScroll(page);
});
