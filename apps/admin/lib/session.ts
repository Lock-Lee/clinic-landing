import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getClinicFor, getSessionUser, hashToken, type Clinic, type User } from "@repo/db/auth";
import { isPlan, PLAN_SECTIONS } from "@repo/db/plans";

// cookie เก็บ token ของ session (ฝั่ง DB เก็บแค่ hash)
export const COOKIE = "clinic_admin";
export const PASSWORD_PATH = "/account/password";
const MUST_CHANGE = "กรุณาเปลี่ยนรหัสผ่านก่อนใช้งาน";

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  return getSessionUser(token);
}

/** hash ของ token ใน cookie ปัจจุบัน (ใช้คง session นี้ไว้ตอนเปลี่ยนรหัส) */
export async function currentTokenHash(): Promise<string | undefined> {
  const token = (await cookies()).get(COOKIE)?.value;
  return token ? hashToken(token) : undefined;
}

/** ใช้ในหน้า: ยังไม่ login ไป /login, ต้องเปลี่ยนรหัสก่อนไป /account/password */
export async function requireUser(opts: { allowMustChange?: boolean } = {}): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  if (user.mustChangePassword && !opts.allowMustChange) redirect(PASSWORD_PATH);
  return user;
}

/** หน้าจัดการของทีมงาน: คนอื่นเห็นเป็น 404 */
export async function requireStaff(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "staff") notFound();
  return user;
}

/** ใช้ใน server action จัดการผู้ใช้/คลินิก: เช็กซ้ำฝั่ง server ทุกครั้ง ไม่ใช่ staff คืน null */
export async function staffActor(): Promise<User | null> {
  const user = await currentUser();
  return user && user.role === "staff" && !user.mustChangePassword ? user : null;
}

/** key ที่แพ็กของคลินิกนี้แก้ได้ แพ็กไม่รู้จัก = แก้ไม่ได้เลย */
export const allowedKeys = (clinic: Clinic) => (isPlan(clinic.package) ? PLAN_SECTIONS[clinic.package] : []);

type Access = { user: User; clinic: Clinic } | { error: string; status: number };

/** ใช้ใน route handler: เช็ก session + สิทธิ์ในคลินิกฝั่ง server ทุกครั้ง */
export async function clinicAccess(req: Request, clinicId: string): Promise<Access> {
  // กันเรียกข้ามเว็บ (cookie sameSite=lax กันอยู่แล้ว เช็กซ้ำอีกชั้น)
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) return { error: "ไม่มีสิทธิ์", status: 403 };
  const user = await currentUser();
  if (!user) return { error: "กรุณาเข้าสู่ระบบใหม่", status: 401 };
  if (user.mustChangePassword) return { error: MUST_CHANGE, status: 403 };
  const clinic = await getClinicFor(user, clinicId).catch(() => null);
  if (!clinic) return { error: "ไม่มีสิทธิ์แก้เว็บนี้", status: 403 };
  return { user, clinic };
}
