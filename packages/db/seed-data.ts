// คลินิกและบัญชีทดสอบของเดโม ใช้ทั้ง seed.ts และเทสต์ e2e (e2e/)
// บัญชีทดสอบสำหรับเดโมเท่านั้น ห้ามใช้รหัสนี้กับระบบจริง
export const clinics = [
  { id: "starter", name: "Mira Skin", package: "Starter", domain: "mira-skin.example", site_url: "http://localhost:3002" },
  { id: "standard", name: "Lumière Clinic", package: "Standard", domain: "lumiere.example", site_url: "http://localhost:3001" },
  { id: "premium", name: "Atelier Belle Clinic", package: "Premium", domain: "atelierbelle.example", site_url: "http://localhost:3003" },
];

export const users = [
  { email: "staff@demo.test", name: "ทีมงาน (เห็นทุกคลินิก)", role: "staff" as const, password: "staff-demo-2026" },
  { email: "mira@demo.test", name: "แอดมิน Mira Skin", role: "clinic" as const, password: "mira-demo-2026", clinics: ["starter"] },
  { email: "lumiere@demo.test", name: "แอดมิน Lumière", role: "clinic" as const, password: "lumiere-demo-2026", clinics: ["standard"] },
  { email: "belle@demo.test", name: "แอดมิน Atelier Belle", role: "clinic" as const, password: "belle-demo-2026", clinics: ["premium"] },
];
