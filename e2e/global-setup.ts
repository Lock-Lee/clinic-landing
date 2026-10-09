import { sql } from "@repo/db";
import { upsertClinic, upsertUser } from "@repo/db/auth";
import { clinics, users } from "@repo/db/seed-data";
import { cleanupE2eData } from "./fixtures/cleanup";

// เริ่มจากสถานะเดียวกันทุกครั้ง: seed คลินิก/บัญชีทดสอบ แพ็กเกจตามค่าเดิม เนื้อหาเป็นค่าเริ่มต้น ไม่มีบัญชี/คลินิกที่เทสต์สร้างค้าง
export default async function globalSetup() {
  try {
    await sql`SELECT 1`;
  } catch {
    throw new Error("เชื่อมต่อ Postgres ไม่ได้ เปิด Docker แล้วรัน bun run db:up ก่อน");
  }
  await cleanupE2eData();
  for (const c of clinics) await upsertClinic(c);
  for (const u of users) await upsertUser(u);
  await sql`DELETE FROM site_content`;
}
