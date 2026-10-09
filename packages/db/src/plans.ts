// สิทธิ์ตามแพ็กเกจ: แต่ละแพ็กแก้ส่วนไหนของเว็บได้ (key ใน editableDefaults = id ของแท็บในหลังบ้าน)
// ใช้ทั้งฝั่งหลังบ้าน (ซ่อน/ล็อกแท็บ) และฝั่ง server (บันทึกได้เฉพาะ key ที่แพ็กมีสิทธิ์)
// ไม่ import อะไรจาก server ไฟล์นี้ใช้ใน client component ได้

export const PLANS = ["Starter", "Standard", "Premium"] as const;
export type Plan = (typeof PLANS)[number];

const STARTER = ["clinic", "hero", "services"];
const STANDARD = [...STARTER, "promotions", "reviews"];
const PREMIUM = [...STANDARD, "articles", "nav"];

export const PLAN_SECTIONS: Record<Plan, string[]> = {
  Starter: STARTER, // Starter + ส่วนเสริมหลังบ้าน
  Standard: STANDARD,
  Premium: PREMIUM,
};

export const isPlan = (v: string): v is Plan => (PLANS as readonly string[]).includes(v);

/** แพ็กต่ำสุดที่ใช้ส่วนนี้ได้ ใช้ทำข้อความ "อัปเกรดเป็น ..." */
export function minPlanFor(section: string): Plan | null {
  return PLANS.find((p) => PLAN_SECTIONS[p].includes(section)) ?? null;
}

export function canEditSection(plan: string, section: string): boolean {
  return isPlan(plan) && PLAN_SECTIONS[plan].includes(section);
}
