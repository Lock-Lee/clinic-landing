import { createUploadRoute } from "@repo/db/storage";
import { clinicAccess } from "@/lib/session";

// อัปโหลดรูปเก็บใต้โฟลเดอร์ id คลินิก เฉพาะผู้ที่มีสิทธิ์ในคลินิกนี้
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = createUploadRoute(async (r) => {
    const access = await clinicAccess(r, id);
    return "error" in access ? null : access.clinic.id;
  });
  return route.POST(req);
}
