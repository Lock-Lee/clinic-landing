import type { Metadata } from "next";
import { MIN_PASSWORD } from "@repo/db/users";
import { requireUser } from "@/lib/session";
import { logoutAction } from "../../actions";
import { PasswordForm } from "./form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "เปลี่ยนรหัสผ่าน" };

export default async function PasswordPage() {
  const user = await requireUser({ allowMustChange: true });
  const forced = !!user.mustChangePassword;

  return (
    <div className="adm adm-login">
      <div className="adm-login-card">
        {!forced && <a href="/" className="adm-link">← กลับ</a>}
        <p className="adm-eyebrow">หลังบ้านคลินิก</p>
        <h1>เปลี่ยนรหัสผ่าน</h1>
        <p className="adm-muted ca-domain">{user.email}</p>
        {forced && (
          <p className="ca-notice" role="status">
            บัญชีนี้ใช้รหัสผ่านชั่วคราวอยู่ กรุณาตั้งรหัสผ่านใหม่ก่อนเริ่มใช้งาน
          </p>
        )}
        <PasswordForm minLength={MIN_PASSWORD} />
        <p className="adm-muted ca-small">เปลี่ยนแล้วเครื่องอื่นที่เข้าบัญชีนี้ไว้จะหลุดจากระบบ</p>
        {forced && (
          <form action={logoutAction} className="ca-inline">
            <button type="submit" className="adm-btn adm-btn-ghost">ออกจากระบบ</button>
          </form>
        )}
      </div>
    </div>
  );
}
