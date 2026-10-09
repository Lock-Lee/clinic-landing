import { expect, storedContent, test } from "../fixtures/db";
import { TEST_IMAGE, URL, enterDemoAdmin, openTab, saveAdmin } from "../fixtures/helpers";

// หลังบ้านตัวอย่างในเว็บเดโม: แก้แล้วบันทึกลง Postgres หน้าเว็บเปลี่ยนตาม

test.describe("Starter (+ หลังบ้าน)", () => {
  test("แก้หัวข้อหน้าแรกและราคาบริการ แล้วหน้าเว็บเปลี่ยน", async ({ page }) => {
    await enterDemoAdmin(page, URL.starter);
    await page.getByLabel("หัวข้อใหญ่").fill("หัวข้อจากเทสต์ e2e");

    await openTab(page, "บริการและราคา");
    await page.locator(".adm-list-title").first().click();
    await page.locator(".adm-list-item[data-open]").getByLabel("ราคา (บาท)").fill("เริ่มต้น 777");
    await saveAdmin(page);

    await page.goto(URL.starter);
    await expect(page.locator("h1")).toHaveText("หัวข้อจากเทสต์ e2e");
    await expect(page.locator("#services")).toContainText("เริ่มต้น 777 บาท");
  });

  test("คืนค่าเริ่มต้นได้", async ({ page }) => {
    await enterDemoAdmin(page, URL.starter);
    await page.getByLabel("หัวข้อใหญ่").fill("จะถูกล้าง");
    await saveAdmin(page);
    page.once("dialog", (d) => d.accept());
    await page.getByRole("button", { name: "คืนค่าเริ่มต้น" }).click();
    await expect(page.locator(".adm-toast")).toContainText("กลับเป็นเนื้อหาเริ่มต้น");
    await page.goto(URL.starter);
    await expect(page.locator("h1")).not.toHaveText("จะถูกล้าง");
  });

  test("API บันทึกเฉพาะส่วนที่แพ็ก Starter มีสิทธิ์", async ({ request }) => {
    const res = await request.put(`${URL.starter}/api/admin`, {
      data: { hero: { title: "ok", lead: "", image: "" }, promotions: [{ name: "ไม่ควรถูกบันทึก" }] },
    });
    expect(res.ok()).toBeTruthy();
    const data = await storedContent("starter");
    expect(data).toHaveProperty("hero");
    expect(data).not.toHaveProperty("promotions");
  });

  test("อัปโหลดรูปหน้าแรก รูปขึ้นบนหน้าเว็บ", async ({ page, request }) => {
    await enterDemoAdmin(page, URL.starter);
    await page.locator(".adm-field", { hasText: "รูปหน้าแรก" }).locator('input[type="file"]').setInputFiles(TEST_IMAGE);
    const preview = page.locator(".adm-field", { hasText: "รูปหน้าแรก" }).locator(".adm-image img");
    await expect(preview).toHaveAttribute("src", /\/clinic-media\/starter\//);
    await saveAdmin(page);

    const src = await preview.getAttribute("src");
    expect((await request.get(src!)).status()).toBe(200);
    await page.goto(URL.starter);
    await expect(page.locator(".hero-image")).toHaveAttribute("src", src!);
  });
});

test.describe("Standard", () => {
  test("เพิ่มโปรโมชัน แสดงทั้งหน้าแรกและหน้า /line", async ({ page }) => {
    await enterDemoAdmin(page, URL.standard);
    await openTab(page, "โปรโมชัน");
    await page.getByRole("button", { name: "+ เพิ่มโปรโมชัน" }).click();
    const item = page.locator(".adm-list-item[data-open]");
    await item.getByLabel("ชื่อโปร").fill("โปรทดสอบ e2e");
    await item.getByLabel("ราคาปกติ (บาท)").fill("9,999");
    await item.getByLabel("ราคาโปร (บาท)").fill("4,999");
    await saveAdmin(page);

    await page.goto(URL.standard);
    await expect(page.locator("#promotions")).toContainText("โปรทดสอบ e2e");
    // แชท LINE ตัวอย่าง: กดเมนูโปรโมชันแล้วบอทตอบด้วยโปรล่าสุด
    await page.goto(`${URL.standard}/line`);
    await page.getByRole("button", { name: "โปรโมชัน" }).click();
    await expect(page.getByRole("region", { name: /ตัวอย่างแชท LINE OA/ })).toContainText("โปรทดสอบ e2e");
  });
});

test.describe("Premium", () => {
  test("เพิ่มหน้าบริการใหม่ ได้หน้า /services/<slug>", async ({ page }) => {
    await enterDemoAdmin(page, URL.premium);
    await openTab(page, "บริการ");
    await page.getByRole("button", { name: "+ เพิ่มบริการ (หน้าใหม่)" }).click();
    const item = page.locator(".adm-list-item[data-open]").last();
    await item.getByLabel("ชื่อบริการ").fill("เลเซอร์ทดสอบ");
    await item.getByLabel("ชื่อภาษาอังกฤษ").fill("E2E Laser");
    await expect(item.getByLabel("ลิงก์หน้า (slug)")).toHaveValue("e2e-laser");
    await saveAdmin(page);

    const res = await page.goto(`${URL.premium}/services/e2e-laser`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("เลเซอร์ทดสอบ");
    await page.goto(`${URL.premium}/services`);
    await expect(page.locator("main")).toContainText("เลเซอร์ทดสอบ");
  });

  test("slug ซ้ำบันทึกไม่ได้", async ({ page }) => {
    await enterDemoAdmin(page, URL.premium);
    await openTab(page, "บริการ");
    await page.getByRole("button", { name: "+ เพิ่มบริการ (หน้าใหม่)" }).click();
    const item = page.locator(".adm-list-item[data-open]").last();
    await item.getByLabel("ชื่อบริการ").fill("ซ้ำ");
    const firstSlug = await page.evaluate(async () => {
      const r = await fetch("/services");
      const html = await r.text();
      return html.match(/href="\/services\/([a-z0-9-]+)"/)?.[1] ?? "";
    });
    await item.getByLabel("ลิงก์หน้า (slug)").fill(firstSlug);
    await page.locator(".adm-savebar").getByRole("button", { name: "บันทึก", exact: true }).click();
    await expect(page.locator(".adm-toast[data-error]")).toBeVisible();
    expect(await storedContent("premium")).toBeNull();
  });

  test("บทความใส่รูปแทรกได้ (อัปโหลดเข้า S3)", async ({ page }) => {
    await enterDemoAdmin(page, URL.premium);
    await openTab(page, "บทความ");
    await page.locator(".adm-list-title").first().click();
    const article = page.locator(".adm-list-item[data-open]").first();
    const slug = await article.getByLabel("ลิงก์หน้า (slug)").inputValue();

    await article.getByRole("button", { name: "+ รูป" }).click();
    const block = article.locator(".adm-list-item[data-open]").last();
    await block.locator('input[type="file"]').setInputFiles(TEST_IMAGE);
    await expect(block.locator(".adm-image img")).toHaveAttribute("src", /\/clinic-media\/premium\//);
    await block.getByLabel("คำบรรยายใต้รูป").fill("รูปจากเทสต์ e2e");
    await saveAdmin(page);

    await page.goto(`${URL.premium}/articles/${slug}`);
    const figure = page.locator("figure", { hasText: "รูปจากเทสต์ e2e" });
    await expect(figure.locator("img")).toHaveAttribute("src", /\/clinic-media\/premium\//);
  });

  test("เมนูมีเมนูย่อย และเพิ่มเมนูย่อยจากหลังบ้านได้", async ({ page }) => {
    await page.goto(URL.premium);
    const services = page.locator(".sk-nav-item", { hasText: "บริการ" }).first();
    await services.getByRole("button", { name: /เมนูย่อย/ }).click();
    await expect(services.locator(".sk-sub")).toBeVisible();

    await enterDemoAdmin(page, URL.premium);
    await openTab(page, "เมนู");
    await page.locator(".adm-list-title", { hasText: "บริการ" }).first().click();
    const menu = page.locator(".adm-list-item[data-open]").first();
    await menu.getByRole("button", { name: "+ เพิ่มเมนูย่อย" }).click();
    const sub = menu.locator(".adm-list-item[data-open]").last();
    await sub.getByLabel("ชื่อเมนูย่อย").fill("เมนูย่อย e2e");
    await sub.getByRole("textbox", { name: "ลิงก์" }).fill("/promotions");
    await saveAdmin(page);

    await page.goto(URL.premium);
    await expect(page.locator(".sk-sub a", { hasText: "เมนูย่อย e2e" })).toHaveAttribute("href", "/promotions");
  });
});
