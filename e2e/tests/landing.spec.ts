import { expect, test } from "../fixtures/db";
import { URL } from "../fixtures/helpers";

// หน้าขาย: ราคา 3 แพ็ก และลิงก์ไปเว็บตัวอย่าง/หลังบ้านของแต่ละแพ็ก
test("การ์ดแพ็กเกจแสดงราคาและลิงก์เว็บตัวอย่าง", async ({ page }) => {
  await page.goto(URL.landing);
  const cards = page.locator("#packages .card");
  await expect(cards).toHaveCount(3);

  const expected = [
    { name: "Starter", price: "12,000", demo: URL.starter },
    { name: "Standard", price: "22,000", demo: URL.standard },
    { name: "Premium", price: "42,000", demo: URL.premium },
  ];
  for (const [i, pkg] of expected.entries()) {
    const card = cards.nth(i);
    await expect(card.locator("h3")).toHaveText(pkg.name);
    await expect(card.locator(".price")).toContainText(pkg.price);
    await expect(card.locator(".card-summary")).not.toBeEmpty();
    const links = card.locator("a.card-demo");
    await expect(links.nth(0)).toHaveAttribute("href", pkg.demo);
    await expect(links.nth(1)).toHaveAttribute("href", `${pkg.demo}/admin`);
  }
});

test("FAQ ราคาตรงกับการ์ด", async ({ page }) => {
  await page.goto(URL.landing);
  const faq = page.locator("#faq");
  await expect(faq).toContainText("Standard 22,000 บาท");
  await expect(faq).toContainText("Premium 42,000 บาท");
});
