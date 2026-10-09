import { sql } from "@repo/db";

// ลบบัญชี/คลินิกที่เทสต์สร้าง (อีเมล @e2e.test, รหัสคลินิก e2e-*) พร้อมเนื้อหาของคลินิกนั้น
export async function cleanupE2eData() {
  await sql`DELETE FROM users WHERE email LIKE '%@e2e.test'`;
  await sql`DELETE FROM site_content WHERE site LIKE 'e2e-%'`;
  await sql`DELETE FROM clinics WHERE id LIKE 'e2e-%'`;
}
