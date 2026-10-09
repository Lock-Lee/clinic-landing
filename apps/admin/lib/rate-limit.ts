// จำกัดการลองรหัสผ่านผิด เก็บในหน่วยความจำ (รีสตาร์ตแล้วหาย ขึ้นหลายเครื่องต้องย้ายไป DB/Redis)
const WINDOW_MS = 5 * 60_000;

const g = globalThis as unknown as { __loginFails?: Map<string, number[]> };
const fails = (g.__loginFails ??= new Map<string, number[]>());

const recent = (key: string) => (fails.get(key) ?? []).filter((t) => Date.now() - t < WINDOW_MS);

/** ต่ออีเมลผิดได้ 5 ครั้ง ต่อ IP 20 ครั้ง ใน 5 นาที */
export const isLimited = (ip: string, email: string) => recent(`ip:${ip}`).length >= 20 || recent(`email:${email}`).length >= 5;

export function recordFail(ip: string, email: string) {
  for (const k of [`ip:${ip}`, `email:${email}`]) fails.set(k, [...recent(k), Date.now()]);
}

export const clearFails = (email: string) => fails.delete(`email:${email}`);
