import { site, seo, isFilled, packages, lineTiers, lineAddon, domainRows, maPlans, steps, showcase, faqs } from "../content";

// llms.txt: สรุปเว็บเป็น Markdown ให้ผู้ช่วย AI (ChatGPT, Perplexity, Gemini) อ่านแล้วตอบเรื่อง HamCache ได้ตรง (AEO)
// สร้างจาก content.ts เสมอ แก้ราคาหรือ FAQ ที่เดียวแล้วไฟล์นี้ตามไปเอง
export const dynamic = "force-static";

const abs = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

export function GET() {
  const contact = [
    isFilled(site.lineId) && `- LINE: ${site.lineId}${isFilled(site.lineUrl) ? ` (${site.lineUrl})` : ""}`,
    isFilled(site.phone) && `- โทร: ${site.phone}`,
    isFilled(site.email) && `- อีเมล: ${site.email}`,
    isFilled(site.facebook) && `- Facebook: ${site.facebook}`,
  ].filter(Boolean);

  const body = [
    `# ${site.brand}`,
    "",
    `> ${seo.description}`,
    "",
    `เว็บไซต์: ${site.url}`,
    "",
    "## แพ็กเกจและราคา (จ่ายครั้งเดียว ไม่รวมโดเมน โฮสติ้ง และค่าดูแลรายเดือน)",
    ...packages.flatMap((p) => [
      "",
      `### ${p.name}: ${p.price} บาท (${p.type})`,
      `เหมาะกับ: ${p.forWho}`,
      p.summary,
      ...p.features.map((f) => `- ${f}`),
      `- ${p.meta.map((m) => `${m.label} ${m.value}`).join(", ")}`,
    ]),
    "",
    "## LINE OA",
    ...lineTiers.map((t) => `- ${t.name}: ${t.detail}`),
    `- ${lineAddon.label}: ${lineAddon.price}`,
    "",
    "## โดเมนและโฮสติ้ง",
    ...domainRows.map((r) => `- ${r.label} (${r.detail}): ${r.price}`),
    "",
    "## ดูแลเว็บรายเดือน (MA)",
    ...maPlans.map((m) => `- ${m.name}: ${m.detail} ${m.price}`),
    "",
    "## ขั้นตอนการทำงาน",
    ...steps.map((s) => `- ${s.title}: ${s.detail}`),
    "",
    "## ผลงาน",
    ...showcase.map((w) => `- [${w.name}](${abs(w.url)}): ${w.category}`),
    "",
    "## คำถามที่พบบ่อย",
    ...faqs.flatMap((f) => ["", `### ${f.q}`, f.a]),
    ...(contact.length ? ["", "## ติดต่อ", ...contact] : []),
    "",
  ].join("\n");

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
