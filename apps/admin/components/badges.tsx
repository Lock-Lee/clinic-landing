import type { ManagedUser } from "@repo/db/users";

export function UserStatus({ user }: { user: Pick<ManagedUser, "disabled" | "mustChangePassword"> }) {
  if (user.disabled) return <span className="ca-badge" data-status="off">ปิดอยู่</span>;
  if (user.mustChangePassword) return <span className="ca-badge" data-status="wait">รอเปลี่ยนรหัส</span>;
  return <span className="ca-badge" data-status="on">ใช้งาน</span>;
}

export const RoleBadge = ({ role }: { role: string }) =>
  role === "staff" ? <span className="ca-badge" data-role="staff">ทีมงาน</span> : <span className="ca-badge">คลินิก</span>;
