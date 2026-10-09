import { createUploadRoute } from "@repo/db/storage";
import { SITE_ID } from "../../../content";

// หลังบ้านตัวอย่างไม่มี login จริง อัปโหลดได้ทุกคน เก็บรูปไว้ใต้โฟลเดอร์ของเว็บนี้
export const { POST } = createUploadRoute(async () => SITE_ID);
