import { redirect } from "next/navigation";
import { listClinics, type User } from "@repo/db/auth";
import { listAllClinics } from "@repo/db/users";
import { requireUser } from "@/lib/session";
import { templateLabel } from "@/lib/template-list";
import { ClinicForm } from "@/components/manage-forms";
import { StaffNav } from "@/components/staff-nav";
import { logoutAction } from "./actions";
import { createClinicAction } from "./manage-actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();
  return user.role === "staff" ? <StaffHome user={user} /> : <ClinicHome user={user} />;
}

/** ทีมงาน: คลินิกทั้งหมด (รวมที่ปิดอยู่) + เพิ่ม/แก้ข้อมูลคลินิก */
async function StaffHome({ user }: { user: User }) {
  const clinics = await listAllClinics().catch(() => null);
  return (
    <div className="adm">
      <StaffNav user={user} current="clinics" />
      <main className="adm-main">
        <h1 className="ca-h1">คลินิกทั้งหมด</h1>

        <ClinicForm action={createClinicAction} summary="+ เพิ่มคลินิก" />

        {clinics === null && <div className="adm-card adm-error">เชื่อมต่อฐานข้อมูลไม่ได้ ลองใหม่อีกครั้ง</div>}

        <div className="ca-list">
          {clinics?.map((c) => (
            <div key={c.id} className="adm-card ca-card" data-disabled={c.disabled || undefined}>
              <div className="ca-badges">
                <span className="ca-badge" data-plan={c.package}>แพ็กเกจ {c.package}</span>
                {c.disabled && <span className="ca-badge" data-status="off">ปิดใช้งาน</span>}
              </div>
              <h2>{c.name}</h2>
              <div className="ca-meta">
                <span className="adm-muted">รหัส {c.id} · แม่แบบ {templateLabel(c.template ?? c.id)}</span>
                {c.domain && <span className="adm-muted ca-domain">{c.domain}</span>}
              </div>
              <div className="ca-actions">
                <a href={`/clinics/${c.id}`} className="adm-btn adm-btn-primary">แก้ไขเว็บ</a>
                <a href={c.site_url} target="_blank" rel="noopener" className="adm-btn adm-btn-outline">ดูเว็บ ↗</a>
                <a href={`/clinics/${c.id}/settings`} className="adm-btn adm-btn-outline">แก้ไขข้อมูลคลินิก</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/** บัญชีคลินิก: มีเว็บเดียวเข้าหน้าแก้ไขเลย */
async function ClinicHome({ user }: { user: User }) {
  const clinics = await listClinics(user).catch(() => null);
  if (clinics?.length === 1) redirect(`/clinics/${clinics[0]!.id}`);

  return (
    <div className="adm">
      <main className="adm-main">
        <div className="ca-top">
          <div className="ca-user">
            <p className="adm-eyebrow">หลังบ้านคลินิก</p>
            <strong>{user.name}</strong>
            <span className="adm-muted">{user.email}</span>
          </div>
          <div className="ca-actions">
            <a href="/account/password" className="adm-btn adm-btn-ghost">เปลี่ยนรหัสผ่าน</a>
            <form action={logoutAction} className="ca-inline">
              <button type="submit" className="adm-btn adm-btn-outline">ออกจากระบบ</button>
            </form>
          </div>
        </div>

        <h1 className="ca-h1">คลินิกทั้งหมด</h1>

        {clinics === null && <div className="adm-card adm-error">เชื่อมต่อฐานข้อมูลไม่ได้ ลองใหม่อีกครั้ง</div>}
        {clinics?.length === 0 && <div className="adm-card adm-muted">บัญชีนี้ยังไม่มีคลินิก ติดต่อทีมงาน</div>}

        <div className="ca-list">
          {clinics?.map((c) => (
            <div key={c.id} className="adm-card ca-card">
              <div className="ca-badges">
                <span className="ca-badge" data-plan={c.package}>แพ็กเกจ {c.package}</span>
              </div>
              <h2>{c.name}</h2>
              {c.domain && <span className="adm-muted ca-domain">{c.domain}</span>}
              <div className="ca-actions">
                <a href={`/clinics/${c.id}`} className="adm-btn adm-btn-primary">แก้ไขเว็บ</a>
                <a href={c.site_url} target="_blank" rel="noopener" className="adm-btn adm-btn-outline">ดูเว็บ ↗</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
