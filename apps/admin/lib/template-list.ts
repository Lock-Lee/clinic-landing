// รายชื่อแม่แบบเว็บ (ไม่ import editor ใช้ใน client component ได้) ต้องตรงกับ TEMPLATES ใน templates.ts
export const TEMPLATE_OPTIONS = [
  { id: "starter", label: "หน้าเดียว (Starter)" },
  { id: "standard", label: "หน้าเดียวเต็ม (Standard)" },
  { id: "premium", label: "หลายหน้า (Premium)" },
] as const;

export type TemplateId = (typeof TEMPLATE_OPTIONS)[number]["id"];

export const isTemplateId = (v: string): v is TemplateId => TEMPLATE_OPTIONS.some((t) => t.id === v);

export const templateLabel = (id: string | null | undefined) => TEMPLATE_OPTIONS.find((t) => t.id === id)?.label ?? id ?? "-";
