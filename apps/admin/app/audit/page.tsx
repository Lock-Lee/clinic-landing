import type { Metadata } from "next";
import { listAudit } from "@repo/db/users";
import { requireStaff } from "@/lib/session";
import { StaffNav } from "@/components/staff-nav";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "บันทึกการใช้งาน" };

const ACTIONS: Record<string, string> = {
  "user.create": "สร้างผู้ใช้",
  "user.update": "แก้ไขผู้ใช้",
  "user.disable": "ปิดบัญชี",
  "user.enable": "เปิดบัญชี",
  "user.reset_password": "รีเซ็ตรหัสผ่าน",
  "user.change_password": "เปลี่ยนรหัสผ่าน",
  "user.delete": "ลบผู้ใช้",
  "clinic.create": "เพิ่มคลินิก",
  "clinic.update": "แก้ไขข้อมูลคลินิก",
  "clinic.disable": "ปิดใช้งานคลินิก",
  "clinic.enable": "เปิดใช้งานคลินิก",
};

const time = new Intl.DateTimeFormat("th-TH", { timeZone: "Asia/Bangkok", dateStyle: "medium", timeStyle: "short" });

export default async function AuditPage() {
  const user = await requireStaff();
  const entries = await listAudit(100).catch(() => null);

  return (
    <div className="adm">
      <StaffNav user={user} current="audit" />
      <main className="adm-main">
        <h1 className="ca-h1">บันทึกการใช้งาน</h1>
        <p className="adm-muted">100 รายการล่าสุด</p>
        {entries === null && <div className="adm-card adm-error">เชื่อมต่อฐานข้อมูลไม่ได้ ลองใหม่อีกครั้ง</div>}
        {entries?.length === 0 && <div className="adm-card adm-muted">ยังไม่มีรายการ</div>}
        {!!entries?.length && (
          <ol className="adm-card ca-log">
            {entries.map((e) => (
              <li key={e.id} className="ca-log-row" data-action={e.action}>
                <time dateTime={e.created_at.toISOString()} className="adm-muted">{time.format(e.created_at)}</time>
                <span className="ca-log-what">
                  <strong>{ACTIONS[e.action] ?? e.action}</strong> <span className="ca-log-target">{e.target}</span>
                </span>
                <span className="adm-muted ca-log-actor">โดย {e.actor}</span>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
