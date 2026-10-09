// ข้อมูลตั้งต้นของ admin กลาง: bun run db:seed (รันซ้ำได้ อัปเดตทับของเดิม)
import { closeDb, upsertClinic, upsertUser } from "./src/auth";
import { clinics, users } from "./seed-data";

for (const c of clinics) await upsertClinic(c);
for (const u of users) await upsertUser(u);
console.log(`seed: ${clinics.length} คลินิก, ${users.length} ผู้ใช้`);
await closeDb();
