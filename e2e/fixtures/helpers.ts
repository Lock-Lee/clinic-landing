import { expect, type Page } from "@playwright/test";
import path from "node:path";
import { users } from "@repo/db/seed-data";

export const URL = {
  landing: "http://localhost:3000",
  standard: "http://localhost:3001",
  starter: "http://localhost:3002",
  premium: "http://localhost:3003",
  admin: "http://localhost:3010",
};

// รูป PNG เล็กๆ สำหรับทดสอบอัปโหลด
export const TEST_IMAGE = path.join(__dirname, "test-image.png");

export function account(email: string) {
  const u = users.find((x) => x.email === email);
  if (!u) throw new Error(`ไม่มีบัญชีทดสอบ ${email} ใน seed-data`);
  return u;
}

/** หน้าไม่เลื่อนแนวนอน (กติกา 375px ของ repo) */
export async function expectNoHorizontalScroll(page: Page) {
  const { sw, w } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, w: window.innerWidth }));
  expect(sw, `scrollWidth ${sw} > ${w}`).toBeLessThanOrEqual(w);
}

/** เข้าหลังบ้านตัวอย่างในเว็บเดโม (/admin ไม่มี login จริง) */
export async function enterDemoAdmin(page: Page, base: string) {
  await page.goto(`${base}/admin`);
  await page.getByRole("button", { name: "เข้าสู่หลังบ้านตัวอย่าง" }).click();
  await expect(page.locator(".adm-tabs")).toBeVisible();
}

export async function openTab(page: Page, label: string) {
  await page.locator(".adm-tabs button", { hasText: label }).click();
  await expect(page.locator(".adm-main > h2")).toHaveText(label);
}

export async function saveAdmin(page: Page) {
  await page.locator(".adm-savebar").getByRole("button", { name: "บันทึก", exact: true }).click();
  await expect(page.locator(".adm-toast")).toContainText("บันทึกแล้ว");
}

/** กรอกฟอร์ม login admin กลาง (ไม่รอผล ใช้กับกรณีที่คาดว่า login ไม่ผ่านด้วย) */
export async function submitLogin(page: Page, email: string, password: string) {
  await page.goto(`${URL.admin}/login`);
  await page.getByLabel("อีเมล").fill(email);
  await page.getByLabel("รหัสผ่าน").fill(password);
  await page.getByRole("button", { name: /เข้าสู่ระบบ/ }).click();
}

/** login admin กลาง แล้วรอจนพ้นหน้า login */
export async function loginAs(page: Page, email: string, password: string) {
  await submitLogin(page, email, password);
  await page.waitForURL((u) => !u.pathname.startsWith("/login"));
}

/** login admin กลางด้วยบัญชีทดสอบจาก seed-data */
export async function loginAdmin(page: Page, email: string) {
  await loginAs(page, email, account(email).password);
}
