import { devices, type Browser, type Page } from "@playwright/test";
import { sql } from "@repo/db";
import type { User } from "@repo/db/auth";
import { changeOwnPassword, createUser } from "@repo/db/users";
import { expect, storedContent, test } from "../fixtures/db";
import { URL, expectNoHorizontalScroll, loginAdmin, loginAs, submitLogin } from "../fixtures/helpers";

// จัดการผู้ใช้/คลินิกใน admin กลาง: ทีมงานเท่านั้น รหัสชั่วคราวแสดงครั้งเดียว บังคับเปลี่ยนรหัสครั้งแรก
// บัญชีที่สร้างใช้อีเมล @e2e.test คลินิกใช้รหัส e2e-* (fixture ลบให้หลังแต่ละเทสต์)

const STAFF = "staff@demo.test";
const LUMIERE = "lumiere@demo.test";
const NEW_PASSWORD = "e2e-new-password-1";

// อีเมลไม่ซ้ำกันทุกรอบ กันตัวจำกัดการลองรหัสผิด (นับต่ออีเมล) ค้างข้ามรอบ
const email = (name: string) => `${name}-${Date.now()}@e2e.test`;

async function staffActor(): Promise<User> {
  const [u] = await sql<User[]>`SELECT id, email, name, role FROM users WHERE email = ${STAFF}`;
  return u!;
}

/** สร้างบัญชีคลินิกที่เปลี่ยนรหัสแล้ว (พร้อมใช้งาน) ผ่าน backend ตรงๆ */
async function seedUser(address: string, clinics: string[]) {
  const actor = await staffActor();
  const { id, password } = await createUser(actor, { email: address, name: `E2E ${address.split("@")[0]}`, role: "clinic", clinics });
  await changeOwnPassword({ id, email: address, name: "", role: "clinic" }, password, NEW_PASSWORD);
  return id;
}

async function newPage(browser: Browser) {
  return (await browser.newContext()).newPage();
}

const acceptDialogs = (page: Page) => page.on("dialog", (d) => void d.accept());

async function openUser(page: Page, id: number) {
  await page.goto(`${URL.admin}/users/${id}`);
  await expect(page.locator(".ca-h1")).toBeVisible();
}

test("ทีมงานสร้างบัญชีคลินิก รหัสชั่วคราวแสดงครั้งเดียว และต้องเปลี่ยนรหัสก่อนใช้งาน", async ({ page, browser }) => {
  const address = email("new");
  await loginAdmin(page, STAFF);
  await page.getByRole("link", { name: "ผู้ใช้", exact: true }).click();
  await expect(page).toHaveURL(/\/users$/);

  await page.locator("summary", { hasText: "+ เพิ่มผู้ใช้" }).click();
  await page.getByLabel("อีเมล", { exact: true }).fill(address);
  await page.getByLabel("ชื่อ", { exact: true }).fill("แอดมิน E2E");
  // บัญชีคลินิกต้องเลือกคลินิก
  await page.getByRole("button", { name: "สร้างบัญชี" }).click();
  await expect(page.locator(".adm-error")).toContainText("ต้องเลือกอย่างน้อย 1 คลินิก");
  // เลือกทีมงานแล้วช่องคลินิกหาย
  await page.getByLabel("บทบาท").selectOption("staff");
  await expect(page.locator(".ca-checks")).toHaveCount(0);
  await page.getByLabel("บทบาท").selectOption("clinic");
  await page.getByLabel(/Lumière Clinic/).check();
  await page.getByRole("button", { name: "สร้างบัญชี" }).click();

  const temp = await page.locator(".ca-temp-code").textContent();
  expect(temp).toMatch(/^\S{12}$/);
  await expect(page.locator(".ca-temp")).toContainText("รหัสนี้จะไม่แสดงอีก");
  expect(page.url()).not.toContain(temp!);
  const row = page.locator(".ca-row", { hasText: address });
  await expect(row).toContainText("รอเปลี่ยนรหัส");
  await expect(row).toContainText("Lumière Clinic");

  // โหลดหน้าใหม่ รหัสไม่แสดงอีก
  await page.reload();
  await expect(page.locator(".ca-temp")).toHaveCount(0);
  expect(await page.content()).not.toContain(temp!);

  // ผู้ใช้ใหม่ login ด้วยรหัสชั่วคราว ถูกบังคับเปลี่ยนรหัส
  const user = await newPage(browser);
  await loginAs(user, address, temp!);
  await expect(user).toHaveURL(/\/account\/password$/);
  await expect(user.locator(".ca-notice")).toBeVisible();
  for (const path of ["/", "/clinics/standard"]) {
    await user.goto(`${URL.admin}${path}`);
    await expect(user).toHaveURL(/\/account\/password$/);
  }
  const api = await user.request.put(`${URL.admin}/api/clinics/standard/content`, { headers: { Origin: URL.admin }, data: {} });
  expect(api.status()).toBe(403);
  expect((await api.json()).error).toContain("เปลี่ยนรหัสผ่าน");

  // ยืนยันไม่ตรง
  await user.getByLabel("รหัสผ่านเดิม").fill(temp!);
  await user.getByLabel("รหัสผ่านใหม่", { exact: true }).fill(NEW_PASSWORD);
  await user.getByLabel("ยืนยันรหัสผ่านใหม่").fill(`${NEW_PASSWORD}x`);
  await user.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }).click();
  await expect(user.locator(".adm-error")).toContainText("ไม่ตรงกัน");

  await user.getByLabel("ยืนยันรหัสผ่านใหม่").fill(NEW_PASSWORD);
  await user.getByRole("button", { name: "เปลี่ยนรหัสผ่าน" }).click();
  await expect(user).toHaveURL(/\/clinics\/standard$/);
  await expect(user.locator(".adm-brand")).toContainText("แพ็กเกจ Standard");

  await page.reload();
  await expect(page.locator(".ca-row", { hasText: address })).toContainText("ใช้งาน");
});

test("รีเซ็ตรหัสผ่าน: session เดิมหลุด รหัสเก่าใช้ไม่ได้ รหัสชั่วคราวใหม่ใช้ได้", async ({ page, browser }) => {
  const address = email("reset");
  const id = await seedUser(address, ["standard"]);

  const user = await newPage(browser);
  await loginAs(user, address, NEW_PASSWORD);
  await expect(user).toHaveURL(/\/clinics\/standard$/);

  await loginAdmin(page, STAFF);
  acceptDialogs(page);
  await openUser(page, id);
  await page.getByRole("button", { name: "รีเซ็ตรหัสผ่าน" }).click();
  const temp = await page.locator(".ca-temp-code").textContent();
  expect(temp).toMatch(/^\S{12}$/);

  await user.reload();
  await expect(user).toHaveURL(/\/login$/);

  await submitLogin(user, address, NEW_PASSWORD);
  await expect(user.locator(".adm-error")).toContainText("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

  await loginAs(user, address, temp!);
  await expect(user).toHaveURL(/\/account\/password$/);
});

test("ปิดบัญชีแล้ว login ไม่ได้ เปิดกลับแล้วใช้ได้", async ({ page, browser }) => {
  const address = email("disable");
  const id = await seedUser(address, ["standard"]);

  const user = await newPage(browser);
  await loginAs(user, address, NEW_PASSWORD);

  await loginAdmin(page, STAFF);
  acceptDialogs(page);
  await openUser(page, id);
  await page.getByRole("button", { name: "ปิดบัญชี" }).click();
  await expect(page.locator(".ca-badges .ca-badge[data-status]")).toHaveText("ปิดอยู่");

  // session ที่เปิดอยู่หลุด และ login ใหม่ไม่ได้
  await user.reload();
  await expect(user).toHaveURL(/\/login$/);
  await submitLogin(user, address, NEW_PASSWORD);
  await expect(user.locator(".adm-error")).toContainText("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

  await page.getByRole("button", { name: "เปิดบัญชี" }).click();
  await expect(page.locator(".ca-badges .ca-badge[data-status]")).toHaveText("ใช้งาน");
  await loginAs(user, address, NEW_PASSWORD);
  await expect(user).toHaveURL(/\/clinics\/standard$/);
});

test("ทีมงานลบบัญชี", async ({ page }) => {
  const address = email("delete");
  const id = await seedUser(address, ["standard"]);

  await loginAdmin(page, STAFF);
  acceptDialogs(page);
  await openUser(page, id);
  await page.getByRole("button", { name: "ลบบัญชี" }).click();
  await expect(page).toHaveURL(/\/users$/);
  await expect(page.locator(".ca-row", { hasText: address })).toHaveCount(0);
  expect(await sql`SELECT 1 FROM users WHERE email = ${address}`).toHaveLength(0);
});

test("ทีมงานจัดการบัญชีตัวเองแบบทำลายไม่ได้", async ({ page }) => {
  await loginAdmin(page, STAFF);
  const me = await staffActor();
  await openUser(page, me.id);
  await expect(page.getByText("นี่คือบัญชีของคุณ")).toBeVisible();
  for (const name of ["ลบบัญชี", "ปิดบัญชี", "รีเซ็ตรหัสผ่าน"]) {
    await expect(page.getByRole("button", { name })).toHaveCount(0);
  }
  await expect(page.getByLabel("บทบาท")).toBeDisabled();
});

test("บัญชีคลินิกเข้าหน้าจัดการไม่ได้ (404) และไม่เห็นเมนูจัดการ", async ({ page }) => {
  await loginAdmin(page, LUMIERE);
  await expect(page).toHaveURL(/\/clinics\/standard$/);
  await expect(page.getByRole("link", { name: "ผู้ใช้", exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "บันทึกการใช้งาน" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "เปลี่ยนรหัสผ่าน" })).toBeVisible();
  const me = await staffActor();
  for (const path of ["/users", "/audit", `/users/${me.id}`, "/clinics/standard/settings"]) {
    expect((await page.goto(`${URL.admin}${path}`))?.status(), path).toBe(404);
  }
});

test("ทีมงานเพิ่มคลินิกใหม่จากแม่แบบเดิม ผูกผู้ใช้ และปิดคลินิกแล้วผู้ใช้มองไม่เห็น", async ({ page, browser }) => {
  await loginAdmin(page, STAFF);
  acceptDialogs(page);

  await page.locator("summary", { hasText: "+ เพิ่มคลินิก" }).click();
  await page.getByLabel("รหัสคลินิก").fill("e2e-clinic");
  await page.getByLabel("ชื่อคลินิก").fill("E2E Clinic");
  await page.getByLabel("แพ็กเกจ", { exact: true }).selectOption("Standard");
  await page.getByLabel("แม่แบบเว็บ").selectOption("standard");
  await page.getByLabel("ลิงก์เว็บคลินิก").fill("http://localhost:3001");
  await page.getByRole("button", { name: "เพิ่มคลินิก", exact: true }).click();
  await expect(page.locator(".ca-ok")).toContainText("เพิ่มคลินิก e2e-clinic แล้ว");
  const card = page.locator(".ca-card", { hasText: "E2E Clinic" });
  await expect(card).toContainText("หน้าเดียวเต็ม (Standard)");

  // รหัสซ้ำ แจ้งข้อความจาก backend
  await page.getByLabel("รหัสคลินิก").fill("e2e-clinic");
  await page.getByLabel("ชื่อคลินิก").fill("ซ้ำ");
  await page.getByLabel("แพ็กเกจ", { exact: true }).selectOption("Starter");
  await page.getByLabel("แม่แบบเว็บ").selectOption("starter");
  await page.getByLabel("ลิงก์เว็บคลินิก").fill("http://localhost:3002");
  await page.getByRole("button", { name: "เพิ่มคลินิก", exact: true }).click();
  await expect(page.locator(".adm-error")).toContainText("มีอยู่แล้ว");

  // ย้ายผู้ใช้จาก Mira Skin มาคลินิกใหม่
  const address = email("assign");
  const id = await seedUser(address, ["starter"]);
  await openUser(page, id);
  await page.getByLabel(/Mira Skin/).uncheck();
  await page.getByLabel(/E2E Clinic/).check();
  await page.getByRole("button", { name: "บันทึก", exact: true }).click();
  await expect(page.locator(".ca-ok")).toHaveText("บันทึกแล้ว");

  const user = await newPage(browser);
  await loginAs(user, address, NEW_PASSWORD);
  await expect(user).toHaveURL(/\/clinics\/e2e-clinic$/);
  await expect(user.locator(".adm-brand")).toContainText("แพ็กเกจ Standard");
  await expect(user.locator(".adm-tabs button", { hasText: "รีวิว" })).toBeVisible();
  // เนื้อหาเก็บตามรหัสคลินิกใหม่ ไม่ปนกับเดโม standard
  const put = await user.request.put(`${URL.admin}/api/clinics/e2e-clinic/content`, {
    headers: { Origin: URL.admin },
    data: { hero: { title: "E2E", lead: "", image: "" } },
  });
  expect(put.status()).toBe(200);
  expect(await storedContent("e2e-clinic")).toHaveProperty("hero");
  expect(await storedContent("standard")).toBeNull();

  // ปิดคลินิก
  await page.goto(`${URL.admin}/clinics/e2e-clinic/settings`);
  await page.getByRole("button", { name: "ปิดใช้งานคลินิก" }).click();
  await expect(page.getByRole("button", { name: "เปิดใช้งานคลินิก" })).toBeVisible();
  await page.goto(URL.admin);
  await expect(page.locator(".ca-card", { hasText: "E2E Clinic" })).toContainText("ปิดใช้งาน");

  await user.goto(URL.admin);
  await expect(user.locator(".adm-card")).toContainText("บัญชีนี้ยังไม่มีคลินิก");
  expect((await user.goto(`${URL.admin}/clinics/e2e-clinic`))?.status()).toBe(404);
  const denied = await user.request.put(`${URL.admin}/api/clinics/e2e-clinic/content`, { headers: { Origin: URL.admin }, data: {} });
  expect(denied.status()).toBe(403);
});

test("บันทึกการใช้งานแสดงรายการที่ทำ", async ({ page }) => {
  const address = email("audit");
  const id = await seedUser(address, ["standard"]);
  await loginAdmin(page, STAFF);
  acceptDialogs(page);
  await openUser(page, id);
  await page.getByRole("button", { name: "ปิดบัญชี" }).click();
  await expect(page.locator(".ca-badges .ca-badge[data-status]")).toHaveText("ปิดอยู่");

  await page.getByRole("link", { name: "บันทึกการใช้งาน" }).click();
  await expect(page).toHaveURL(/\/audit$/);
  const rows = page.locator(".ca-log-row", { hasText: address });
  await expect(rows.filter({ hasText: "สร้างผู้ใช้" })).toContainText(`โดย ${STAFF}`);
  await expect(rows.filter({ hasText: "เปลี่ยนรหัสผ่าน" })).toHaveCount(1);
  await expect(rows.first()).toContainText("ปิดบัญชี");
});

test.describe("375px หน้าจัดการ", () => {
  test.use({ ...devices["iPhone 13 mini"], viewport: { width: 375, height: 812 } });

  test("ไม่เลื่อนแนวนอน", async ({ page }) => {
    const id = await seedUser(email("mobile"), ["standard"]);
    await loginAdmin(page, STAFF);
    for (const path of ["/", "/users", `/users/${id}`, "/audit", "/clinics/standard/settings", "/account/password"]) {
      await page.goto(`${URL.admin}${path}`);
      const add = page.locator("summary", { hasText: "+ เพิ่ม" });
      if (await add.count()) await add.click();
      await expectNoHorizontalScroll(page);
    }
  });
});
