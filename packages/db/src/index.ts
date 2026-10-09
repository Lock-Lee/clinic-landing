import postgres from "postgres";
import { SCHEMA } from "./schema";

// เนื้อหาที่แก้จากหลังบ้านเดโม เก็บใน Postgres (docker-compose.yml ที่ root)
// ฐานข้อมูลไม่เปิด เว็บยังขึ้นได้ด้วยค่าเริ่มต้นจาก content.ts แต่บันทึกจากหลังบ้านไม่ได้

const url = process.env.DATABASE_URL ?? "postgres://clinic:clinic@localhost:5432/clinic";

// เก็บ client ไว้ใน globalThis กัน dev server สร้าง connection ใหม่ทุกครั้งที่ hot reload
const g = globalThis as unknown as { __clinicSql?: postgres.Sql; __clinicTable?: Promise<unknown> };
export const sql = (g.__clinicSql ??= postgres(url, { max: 3, connect_timeout: 3, idle_timeout: 20, onnotice: () => {} }));

// สร้างตารางเองถ้ายังไม่มี (เผื่อ volume เก่าที่ไม่ได้รัน init.sql) ใช้ schema เดียวกับ init.sql
export const ready = () =>
  (g.__clinicTable ??= sql.unsafe(SCHEMA).catch((e) => {
    g.__clinicTable = undefined;
    throw e;
  }));

export class DbUnavailableError extends Error {
  constructor() {
    super("เชื่อมต่อฐานข้อมูลไม่ได้ เปิดด้วย docker compose up -d");
  }
}

/** เนื้อหาของเว็บ: ค่าที่แก้ไว้ทับค่าเริ่มต้นทีละ key บนสุด ฐานข้อมูลไม่เปิดก็คืนค่าเริ่มต้น */
export async function getContent<T extends object>(site: string, defaults: T): Promise<T> {
  try {
    await ready();
    const rows = await sql<{ data: Partial<T> }[]>`SELECT data FROM site_content WHERE site = ${site}`;
    return rows[0] ? { ...defaults, ...rows[0].data } : defaults;
  } catch (e) {
    console.warn(`[db] ใช้ค่าเริ่มต้นของ ${site}:`, (e as Error).message);
    return defaults;
  }
}

/** บันทึกเนื้อหา ถ้าให้ allowedKeys จะบันทึกเฉพาะ key เหล่านั้น key อื่นคงค่าเดิมในฐานข้อมูล (สิทธิ์ตามแพ็กเกจ) */
export async function saveContent(site: string, data: object, allowedKeys?: string[]): Promise<void> {
  try {
    await ready();
    if (allowedKeys) {
      const rows = await sql<{ data: Record<string, unknown> }[]>`SELECT data FROM site_content WHERE site = ${site}`;
      const kept = rows[0]?.data ?? {};
      const picked = Object.fromEntries(Object.entries(data).filter(([k]) => allowedKeys.includes(k)));
      data = { ...Object.fromEntries(Object.entries(kept).filter(([k]) => !allowedKeys.includes(k))), ...picked };
    }
    await sql`
      INSERT INTO site_content (site, data, updated_at) VALUES (${site}, ${sql.json(data as postgres.JSONValue)}, now())
      ON CONFLICT (site) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
  } catch {
    throw new DbUnavailableError();
  }
}

export async function resetContent(site: string): Promise<void> {
  try {
    await ready();
    await sql`DELETE FROM site_content WHERE site = ${site}`;
  } catch {
    throw new DbUnavailableError();
  }
}
