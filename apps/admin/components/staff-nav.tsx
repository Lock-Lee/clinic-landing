import type { User } from "@repo/db/auth";
import { logoutAction } from "@/app/actions";

const LINKS = [
  { id: "clinics", href: "/", label: "คลินิก" },
  { id: "users", href: "/users", label: "ผู้ใช้" },
  { id: "audit", href: "/audit", label: "บันทึกการใช้งาน" },
] as const;

/** แถบบนของหน้าจัดการ (ทีมงานเท่านั้น) */
export function StaffNav({ user, current }: { user: User; current?: (typeof LINKS)[number]["id"] }) {
  return (
    <header className="ca-nav">
      <div className="ca-nav-inner">
        <div className="ca-nav-who">
          <span className="adm-eyebrow">หลังบ้านคลินิก · ทีมงาน</span>
          <strong>{user.name}</strong>
          <span className="adm-muted">{user.email}</span>
        </div>
        <div className="ca-nav-tools">
          <a href="/account/password" className="adm-btn adm-btn-ghost">เปลี่ยนรหัสผ่าน</a>
          <form action={logoutAction} className="ca-inline">
            <button type="submit" className="adm-btn adm-btn-outline">ออกจากระบบ</button>
          </form>
        </div>
        <nav className="ca-nav-links" aria-label="เมนูทีมงาน">
          {LINKS.map((l) => (
            <a key={l.id} href={l.href} aria-current={current === l.id ? "page" : undefined}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
