"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { login, logout, SESSION_DAYS } from "@repo/db/auth";
import { changeOwnPassword, ManageError, MIN_PASSWORD } from "@repo/db/users";
import { clearFails, isLimited, recordFail } from "@/lib/rate-limit";
import { COOKIE, currentTokenHash, currentUser } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";

  if (isLimited(ip, email)) return { error: "ลองผิดหลายครั้งเกินไป รอ 5 นาทีแล้วลองใหม่" };
  if (!email || !password) return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };

  let token: string | null;
  try {
    token = await login(email, password);
  } catch {
    return { error: "เชื่อมต่อฐานข้อมูลไม่ได้ ลองใหม่อีกครั้ง" };
  }
  if (!token) {
    recordFail(ip, email);
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }
  clearFails(email);

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  redirect("/");
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await logout(token).catch(() => {});
  jar.delete(COOKIE);
  redirect("/login");
}

export type PasswordState = { error?: string };

/** เปลี่ยนรหัสตัวเอง (รวมถึงรหัสชั่วคราวที่ต้องเปลี่ยนตอนเข้าครั้งแรก) session นี้ยังอยู่ session อื่นหลุด */
export async function changePasswordAction(_prev: PasswordState, form: FormData): Promise<PasswordState> {
  const user = await currentUser();
  if (!user) redirect("/login");
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  const confirm = String(form.get("confirm") ?? "");
  if (!current || !next) return { error: "กรุณากรอกให้ครบ" };
  if (next.length < MIN_PASSWORD) return { error: `รหัสผ่านใหม่ต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัว` };
  if (next !== confirm) return { error: "ยืนยันรหัสผ่านใหม่ไม่ตรงกัน" };
  try {
    await changeOwnPassword(user, current, next, await currentTokenHash());
  } catch (e) {
    return { error: e instanceof ManageError ? e.message : "เปลี่ยนรหัสผ่านไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }
  redirect("/");
}
