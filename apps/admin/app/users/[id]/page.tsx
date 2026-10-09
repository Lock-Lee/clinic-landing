import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getUser, listAllClinics } from "@repo/db/users";
import { requireStaff } from "@/lib/session";
import { RoleBadge, UserStatus } from "@/components/badges";
import { ActionButton, UserForm } from "@/components/manage-forms";
import { StaffNav } from "@/components/staff-nav";
import { deleteUserAction, resetPasswordAction, setUserDisabledAction, updateUserAction } from "../../manage-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "แก้ไขผู้ใช้" };

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireStaff();
  const id = Number((await params).id);
  const user = Number.isInteger(id) ? await getUser(id) : null;
  if (!user) notFound();
  const clinics = await listAllClinics();
  const self = user.id === me.id;
  const fields = { id: String(user.id), email: user.email };

  return (
    <div className="adm">
      <StaffNav user={me} current="users" />
      <main className="adm-main">
        <a href="/users" className="adm-link">← ผู้ใช้ทั้งหมด</a>
        <div className="ca-user">
          <h1 className="ca-h1">{user.name}</h1>
          <span className="adm-muted ca-domain">{user.email}</span>
        </div>
        <div className="ca-badges">
          <RoleBadge role={user.role} />
          <UserStatus user={user} />
        </div>

        <div className="adm-card">
          <h2 className="ca-h2">ข้อมูลบัญชี</h2>
          <UserForm
            action={updateUserAction}
            clinics={clinics.map((c) => ({ id: c.id, name: c.name }))}
            user={{ id: user.id, email: user.email, name: user.name, role: user.role, clinics: user.clinics }}
            self={self}
          />
        </div>

        {self ? (
          <div className="adm-card">
            <p className="adm-muted">นี่คือบัญชีของคุณ ปิดหรือลบบัญชีตัวเองไม่ได้</p>
            <a href="/account/password" className="adm-btn adm-btn-outline ca-self-start">เปลี่ยนรหัสผ่าน</a>
          </div>
        ) : (
          <>
            <div className="adm-card">
              <h2 className="ca-h2">รีเซ็ตรหัสผ่าน</h2>
              <p className="adm-muted">สร้างรหัสชั่วคราวใหม่ ผู้ใช้จะหลุดจากระบบทุกเครื่องและต้องเปลี่ยนรหัสตอนเข้าครั้งถัดไป</p>
              <ActionButton
                action={resetPasswordAction}
                fields={fields}
                label="รีเซ็ตรหัสผ่าน"
                confirm={`รีเซ็ตรหัสผ่านของ ${user.email}? ผู้ใช้จะหลุดจากระบบทุกเครื่อง`}
              />
            </div>

            <div className="adm-card">
              <h2 className="ca-h2">{user.disabled ? "เปิดบัญชี" : "ปิดบัญชี"}</h2>
              <p className="adm-muted">
                {user.disabled ? "บัญชีนี้ถูกปิดอยู่ เข้าสู่ระบบไม่ได้" : "ปิดแล้วผู้ใช้เข้าสู่ระบบไม่ได้และหลุดจากระบบทุกเครื่อง เปิดกลับได้ภายหลัง"}
              </p>
              <ActionButton
                key={String(user.disabled)}
                action={setUserDisabledAction}
                fields={{ ...fields, disabled: user.disabled ? "0" : "1" }}
                label={user.disabled ? "เปิดบัญชี" : "ปิดบัญชี"}
                confirm={user.disabled ? `เปิดบัญชี ${user.email}?` : `ปิดบัญชี ${user.email}?`}
                danger={!user.disabled}
              />
            </div>

            <div className="adm-card">
              <h2 className="ca-h2">ลบบัญชี</h2>
              <p className="adm-muted">ลบถาวร กู้คืนไม่ได้ ถ้าแค่ไม่ให้ใช้ชั่วคราวให้ปิดบัญชีแทน</p>
              <ActionButton
                action={deleteUserAction}
                fields={fields}
                label="ลบบัญชี"
                confirm={`ลบบัญชี ${user.email} ถาวร?`}
                danger
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
