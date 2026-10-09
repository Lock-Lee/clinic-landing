import { expect, setPlan, storedContent, test } from "../fixtures/db";
import { TEST_IMAGE, URL, loginAdmin } from "../fixtures/helpers";

// admin กลาง: login จริง คลินิกเห็นเฉพาะเว็บตัวเอง สิทธิ์ตามแพ็กเกจ ตรวจทั้งหน้าและ API

const STAFF = "staff@demo.test";
const MIRA = "mira@demo.test"; // Starter
const BELLE = "belle@demo.test"; // Premium

test("ยังไม่ login ถูกส่งไปหน้า login", async ({ page }) => {
  await page.goto(URL.admin);
  await expect(page).toHaveURL(/\/login$/);
});

test("รหัสผ่านผิด แจ้งเตือนและไม่ได้ cookie", async ({ page, context }) => {
  await page.goto(`${URL.admin}/login`);
  await page.getByLabel("อีเมล").fill(MIRA);
  await page.getByLabel("รหัสผ่าน").fill("wrong-password");
  await page.getByRole("button", { name: /เข้าสู่ระบบ/ }).click();
  // ใช้ class เพราะตอน dev Next มี role="alert" ของตัวเองอีกอัน
  await expect(page.locator(".adm-error")).toContainText("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  expect((await context.cookies()).find((c) => c.name === "clinic_admin")).toBeUndefined();
});

test("ทีมงานเห็นทุกคลินิก", async ({ page }) => {
  await loginAdmin(page, STAFF);
  await expect(page.locator(".ca-card")).toHaveCount(3);
  for (const id of ["starter", "standard", "premium"]) {
    expect((await page.goto(`${URL.admin}/clinics/${id}`))?.status()).toBe(200);
  }
});

test("คลินิกเห็นเฉพาะเว็บตัวเอง", async ({ page }) => {
  await loginAdmin(page, MIRA);
  await expect(page).toHaveURL(/\/clinics\/starter$/);
  await expect(page.locator(".adm-brand")).toContainText("แพ็กเกจ Starter");
  expect((await page.goto(`${URL.admin}/clinics/standard`))?.status()).toBe(404);
});

test("API ปฏิเสธคลินิกอื่นและส่วนที่แพ็กไม่มีสิทธิ์", async ({ page }) => {
  await loginAdmin(page, MIRA);
  const api = page.request;
  const headers = { Origin: URL.admin };

  expect((await api.put(`${URL.admin}/api/clinics/standard/content`, { headers, data: { hero: {} } })).status()).toBe(403);

  const ok = await api.put(`${URL.admin}/api/clinics/starter/content`, {
    headers,
    data: { hero: { title: "จาก admin กลาง", lead: "", image: "" }, promotions: [{ name: "ห้ามบันทึก" }] },
  });
  expect(ok.status()).toBe(200);
  const data = await storedContent("starter");
  expect(data).toHaveProperty("hero");
  expect(data).not.toHaveProperty("promotions");

  await page.goto(URL.starter);
  await expect(page.locator("h1")).toHaveText("จาก admin กลาง");
});

test("อัปโหลดรูปได้เฉพาะคลินิกตัวเอง", async ({ page }) => {
  await loginAdmin(page, MIRA);
  const file = { name: "test.png", mimeType: "image/png", buffer: require("node:fs").readFileSync(TEST_IMAGE) };
  const headers = { Origin: URL.admin };
  const own = await page.request.post(`${URL.admin}/api/clinics/starter/upload`, { headers, multipart: { file } });
  expect(own.status()).toBe(200);
  expect((await own.json()).url).toMatch(/\/clinic-media\/starter\//);
  const other = await page.request.post(`${URL.admin}/api/clinics/standard/upload`, { headers, multipart: { file } });
  expect(other.status()).toBe(403);
});

test("ไม่ login เรียก API ไม่ได้", async ({ request }) => {
  const res = await request.put(`${URL.admin}/api/clinics/starter/content`, { headers: { Origin: URL.admin }, data: {} });
  expect(res.status()).toBe(401);
});

test.describe("สิทธิ์ตามแพ็กเกจ", () => {
  test.afterEach(async () => setPlan("premium", "Premium"));

  test("Premium แก้ได้ทุกแท็บ", async ({ page }) => {
    await loginAdmin(page, BELLE);
    await expect(page.locator(".adm-tabs button[data-locked]")).toHaveCount(0);
  });

  test("ทีมงานลดเป็น Standard แล้วแท็บบทความ/เมนูถูกล็อก", async ({ page, browser }) => {
    await loginAdmin(page, STAFF);
    await page.locator(".ca-card", { hasText: "Atelier Belle" }).getByRole("link", { name: "แก้ไขข้อมูลคลินิก" }).click();
    await expect(page).toHaveURL(/\/clinics\/premium\/settings$/);
    await page.getByLabel("แพ็กเกจ", { exact: true }).selectOption("Standard");
    await page.getByRole("button", { name: "บันทึกข้อมูลคลินิก" }).click();
    await expect(page.locator(".ca-ok")).toHaveText("บันทึกข้อมูลคลินิกแล้ว");
    await page.goto(URL.admin);
    await expect(page.locator(".ca-card", { hasText: "Atelier Belle" }).locator(".ca-badge").first()).toHaveText("แพ็กเกจ Standard");

    const clinicPage = await (await browser.newContext()).newPage();
    await loginAdmin(clinicPage, BELLE);
    const locked = clinicPage.locator(".adm-tabs button[data-locked]");
    await expect(locked).toHaveCount(2);
    await expect(locked.nth(0)).toContainText("บทความ");
    await expect(locked.nth(1)).toContainText("เมนู");

    await locked.nth(0).click();
    await expect(clinicPage.locator(".adm-locked")).toContainText("มีในแพ็กเกจ Premium");

    // API ก็ไม่บันทึกบทความ
    const res = await clinicPage.request.put(`${URL.admin}/api/clinics/premium/content`, {
      headers: { Origin: URL.admin },
      data: { articles: [], reviews: [] },
    });
    expect(res.status()).toBe(200);
    const data = await storedContent("premium");
    expect(data).toHaveProperty("reviews");
    expect(data).not.toHaveProperty("articles");
  });
});

test("ออกจากระบบแล้วเข้าหน้าแก้ไม่ได้", async ({ page }) => {
  await loginAdmin(page, BELLE);
  await page.getByRole("button", { name: "ออกจากระบบ" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto(`${URL.admin}/clinics/premium`);
  await expect(page).toHaveURL(/\/login$/);
});
