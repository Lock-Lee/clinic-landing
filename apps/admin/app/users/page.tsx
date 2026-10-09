import type { Metadata } from "next";
import { listAllClinics, listUsers } from "@repo/db/users";
import { requireStaff } from "@/lib/session";
import { RoleBadge, UserStatus } from "@/components/badges";
import { UserForm } from "@/components/manage-forms";
import { StaffNav } from "@/components/staff-nav";
import { createUserAction } from "../manage-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ผู้ใช้" };

export default async function UsersPage() {
  const me = await requireStaff();
  const [users, clinics] = await Promise.all([listUsers(), listAllClinics()]).catch(() => [null, null] as const);
  const clinicName = (id: string) => clinics?.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="adm">
      <StaffNav user={me} current="users" />
      <main className="adm-main">
        <h1 className="ca-h1">ผู้ใช้</h1>

        {!users || !clinics ? (
          <div className="adm-card adm-error">เชื่อมต่อฐานข้อมูลไม่ได้ ลองใหม่อีกครั้ง</div>
        ) : (
          <>
            <details className="ca-add">
              <summary className="adm-btn adm-btn-primary">+ เพิ่มผู้ใช้</summary>
              <div className="adm-card">
                <p className="adm-muted">ระบบสร้างรหัสผ่านชั่วคราวให้ ผู้ใช้ต้องเปลี่ยนรหัสตอนเข้าครั้งแรก</p>
                <UserForm action={createUserAction} clinics={clinics.map((c) => ({ id: c.id, name: c.name }))} />
              </div>
            </details>

            <ul className="ca-rows">
              {users.map((u) => (
                <li key={u.id} className="adm-card ca-row">
                  <div className="ca-row-main">
                    <a href={`/users/${u.id}`} className="ca-row-title">
                      {u.name}
                      {u.id === me.id && <span className="adm-muted"> (คุณ)</span>}
                    </a>
                    <span className="adm-muted ca-domain">{u.email}</span>
                    <div className="ca-badges">
                      <RoleBadge role={u.role} />
                      <UserStatus user={u} />
                    </div>
                    {u.role === "clinic" && (
                      <span className="adm-muted ca-row-clinics">
                        {u.clinics.length ? u.clinics.map(clinicName).join(", ") : "ยังไม่มีคลินิก"}
                      </span>
                    )}
                  </div>
                  <a href={`/users/${u.id}`} className="adm-btn adm-btn-outline">แก้ไข</a>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
