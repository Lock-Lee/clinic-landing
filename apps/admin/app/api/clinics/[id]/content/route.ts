import { DbUnavailableError, resetContent, saveContent } from "@repo/db";
import { allowedKeys, clinicAccess } from "@/lib/session";

const MAX_BYTES = 4_000_000;
type Ctx = { params: Promise<{ id: string }> };

const fail = (e: unknown) =>
  Response.json({ error: e instanceof DbUnavailableError ? e.message : "บันทึกไม่สำเร็จ" }, { status: 503 });

// บันทึกเนื้อหา: เก็บเฉพาะ key ที่แพ็กของคลินิกแก้ได้ key อื่นคงค่าเดิม
export async function PUT(req: Request, { params }: Ctx) {
  const access = await clinicAccess(req, (await params).id);
  if ("error" in access) return Response.json({ error: access.error }, { status: access.status });

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BYTES) return tooLarge();
  const text = await req.text();
  if (Buffer.byteLength(text) > MAX_BYTES) return tooLarge();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return Response.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return Response.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });

  try {
    await saveContent(access.clinic.id, data, allowedKeys(access.clinic));
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

// คืนค่าเริ่มต้น: staff ล้างทั้งแถว, คลินิกล้างเฉพาะส่วนที่แพ็กแก้ได้
export async function DELETE(req: Request, { params }: Ctx) {
  const access = await clinicAccess(req, (await params).id);
  if ("error" in access) return Response.json({ error: access.error }, { status: access.status });
  try {
    if (access.user.role === "staff") await resetContent(access.clinic.id);
    else await saveContent(access.clinic.id, {}, allowedKeys(access.clinic));
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}

const tooLarge = () => Response.json({ error: "ข้อมูลใหญ่เกินไป ลองใช้รูปที่เล็กลง" }, { status: 413 });
