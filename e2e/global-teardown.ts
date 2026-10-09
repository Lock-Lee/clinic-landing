import { closeDb } from "@repo/db/auth";
import globalSetup from "./global-setup";

// คืนสถานะเดิมหลังรันเสร็จ (แพ็กเกจที่เทสต์เปลี่ยน, เนื้อหาที่เทสต์แก้) แล้วปิด connection
export default async function globalTeardown() {
  await globalSetup();
  await closeDb();
}
