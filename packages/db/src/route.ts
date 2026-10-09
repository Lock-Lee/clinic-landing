import { DbUnavailableError, resetContent, saveContent } from "./index";

const MAX_BYTES = 4_000_000; // รูปเก็บเป็น data URL ใน JSON จำกัดไว้กันฐานข้อมูลบวม

// route handler ของหลังบ้านเดโม ใช้ใน app/api/admin/route.ts:
//   export const { PUT, DELETE } = createContentRoute("standard", PLAN_SECTIONS.Standard);
// allowedKeys = ส่วนที่แพ็กแก้ได้ (@repo/db/plans) key อื่นในคำขอจะไม่ถูกบันทึก
// เดโมนี้ไม่มีระบบ login จริง ใครเข้า /admin ก็แก้ได้ ของจริงต้องเช็กสิทธิ์ก่อนบันทึก
export function createContentRoute(site: string, allowedKeys?: string[]) {
  const fail = (e: unknown) =>
    Response.json({ error: e instanceof DbUnavailableError ? e.message : "บันทึกไม่สำเร็จ" }, { status: 503 });

  return {
    PUT: async (req: Request) => {
      const text = await req.text();
      if (text.length > MAX_BYTES) return Response.json({ error: "ข้อมูลใหญ่เกินไป ลองใช้รูปที่เล็กลง" }, { status: 413 });
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        return Response.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
      }
      if (!data || typeof data !== "object" || Array.isArray(data)) return Response.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
      try {
        await saveContent(site, data, allowedKeys);
        return Response.json({ ok: true });
      } catch (e) {
        return fail(e);
      }
    },
    DELETE: async () => {
      try {
        await resetContent(site);
        return Response.json({ ok: true });
      } catch (e) {
        return fail(e);
      }
    },
  };
}
