import { randomInt } from "node:crypto";
import { hashPassword, verifyPassword, type Role, type User } from "./auth";
import { ready, sql } from "./index";
import { isPlan } from "./plans";

// จัดการผู้ใช้/คลินิกใน admin กลาง (ทีมงาน staff เท่านั้น ตรวจสิทธิ์ที่ฝั่งแอปก่อนเรียก)
// ทุกฟังก์ชันที่แก้ข้อมูลรับ actor เพื่อบันทึก audit_log

export type ManagedUser = User & { disabled: boolean; mustChangePassword: boolean; clinics: string[]; createdAt: Date };
export type ManagedClinic = {
  id: string;
  name: string;
  package: string;
  domain: string | null;
  site_url: string;
  template: string | null;
  disabled: boolean;
};
export type AuditEntry = { id: number; actor: string; action: string; target: string; detail: unknown; created_at: Date };

export class ManageError extends Error {}

// รหัสชั่วคราว 12 ตัว ตัดตัวที่อ่านสับสน (0 O 1 l I)
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export function tempPassword(length = 12): string {
  return Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
}

export const MIN_PASSWORD = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLINIC_ID_RE = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export async function audit(actor: User, action: string, target: string, detail?: object) {
  await sql`
    INSERT INTO audit_log (actor_id, actor, action, target, detail)
    VALUES (${actor.id}, ${actor.email}, ${action}, ${target}, ${detail ? sql.json(detail as never) : null})
  `;
}

export async function listAudit(limit = 100): Promise<AuditEntry[]> {
  await ready();
  return sql<AuditEntry[]>`SELECT id, actor, action, target, detail, created_at FROM audit_log ORDER BY id DESC LIMIT ${limit}`;
}

// ---------- ผู้ใช้ ----------

export async function listUsers(): Promise<ManagedUser[]> {
  await ready();
  const rows = await sql<(User & { disabled_at: Date | null; must_change_password: boolean; clinics: string[] | null; created_at: Date })[]>`
    SELECT u.id, u.email, u.name, u.role, u.disabled_at, u.must_change_password, u.created_at,
      array_remove(array_agg(m.clinic_id ORDER BY m.clinic_id), NULL) AS clinics
    FROM users u LEFT JOIN clinic_members m ON m.user_id = u.id
    GROUP BY u.id ORDER BY u.role DESC, u.created_at, u.id
  `;
  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    name: r.name,
    role: r.role,
    disabled: !!r.disabled_at,
    mustChangePassword: r.must_change_password,
    clinics: r.clinics ?? [],
    createdAt: r.created_at,
  }));
}

export async function getUser(id: number): Promise<ManagedUser | null> {
  return (await listUsers()).find((u) => u.id === id) ?? null;
}

function checkUserInput(input: { email?: string; name: string; role: Role; clinics: string[] }) {
  if (input.email !== undefined && !EMAIL_RE.test(input.email)) throw new ManageError("รูปแบบอีเมลไม่ถูกต้อง");
  if (!input.name.trim()) throw new ManageError("กรุณาใส่ชื่อ");
  if (input.role !== "staff" && input.role !== "clinic") throw new ManageError("บทบาทไม่ถูกต้อง");
  if (input.role === "clinic" && input.clinics.length === 0) throw new ManageError("บัญชีคลินิกต้องเลือกอย่างน้อย 1 คลินิก");
}

async function setMemberships(userId: number, role: Role, clinics: string[]) {
  await sql`DELETE FROM clinic_members WHERE user_id = ${userId}`;
  if (role !== "clinic") return;
  for (const c of clinics) await sql`INSERT INTO clinic_members (user_id, clinic_id) VALUES (${userId}, ${c}) ON CONFLICT DO NOTHING`;
}

/** สร้างบัญชีใหม่ คืนรหัสชั่วคราว (แสดงครั้งเดียว ผู้ใช้ต้องเปลี่ยนตอนเข้าครั้งแรก) */
export async function createUser(
  actor: User,
  input: { email: string; name: string; role: Role; clinics: string[] },
): Promise<{ id: number; password: string }> {
  await ready();
  const email = input.email.trim().toLowerCase();
  checkUserInput({ ...input, email });
  const exists = await sql`SELECT 1 FROM users WHERE email = ${email}`;
  if (exists.length) throw new ManageError("อีเมลนี้มีบัญชีอยู่แล้ว");

  const password = tempPassword();
  const [row] = await sql<{ id: number }[]>`
    INSERT INTO users (email, name, role, password_hash, must_change_password)
    VALUES (${email}, ${input.name.trim()}, ${input.role}, ${await hashPassword(password)}, true)
    RETURNING id
  `;
  await setMemberships(row!.id, input.role, input.clinics);
  await audit(actor, "user.create", email, { role: input.role, clinics: input.clinics });
  return { id: row!.id, password };
}

export async function updateUser(actor: User, id: number, input: { name: string; role: Role; clinics: string[] }) {
  await ready();
  checkUserInput(input);
  if (id === actor.id && input.role !== actor.role) throw new ManageError("เปลี่ยนบทบาทของตัวเองไม่ได้");
  const [u] = await sql<{ email: string }[]>`UPDATE users SET name = ${input.name.trim()}, role = ${input.role} WHERE id = ${id} RETURNING email`;
  if (!u) throw new ManageError("ไม่พบผู้ใช้");
  await setMemberships(id, input.role, input.clinics);
  await audit(actor, "user.update", u.email, { role: input.role, clinics: input.clinics });
}

/** ปิด/เปิดบัญชี ปิดแล้ว session ทั้งหมดของบัญชีนั้นหลุด */
export async function setUserDisabled(actor: User, id: number, disabled: boolean) {
  await ready();
  if (id === actor.id) throw new ManageError("ปิดบัญชีของตัวเองไม่ได้");
  const [u] = await sql<{ email: string }[]>`
    UPDATE users SET disabled_at = ${disabled ? sql`now()` : null} WHERE id = ${id} RETURNING email
  `;
  if (!u) throw new ManageError("ไม่พบผู้ใช้");
  if (disabled) await sql`DELETE FROM sessions WHERE user_id = ${id}`;
  await audit(actor, disabled ? "user.disable" : "user.enable", u.email);
}

/** ตั้งรหัสชั่วคราวใหม่ ให้ผู้ใช้เปลี่ยนตอนเข้าครั้งถัดไป session เดิมหลุดทั้งหมด */
export async function resetUserPassword(actor: User, id: number): Promise<string> {
  await ready();
  const password = tempPassword();
  const [u] = await sql<{ email: string }[]>`
    UPDATE users SET password_hash = ${await hashPassword(password)}, must_change_password = true WHERE id = ${id} RETURNING email
  `;
  if (!u) throw new ManageError("ไม่พบผู้ใช้");
  await sql`DELETE FROM sessions WHERE user_id = ${id}`;
  await audit(actor, "user.reset_password", u.email);
  return password;
}

export async function deleteUser(actor: User, id: number) {
  await ready();
  if (id === actor.id) throw new ManageError("ลบบัญชีของตัวเองไม่ได้");
  const [u] = await sql<{ email: string }[]>`DELETE FROM users WHERE id = ${id} RETURNING email`;
  if (!u) throw new ManageError("ไม่พบผู้ใช้");
  await audit(actor, "user.delete", u.email);
}

/** ผู้ใช้เปลี่ยนรหัสตัวเอง (ต้องใส่รหัสเดิม) session อื่นของบัญชีนี้หลุด ยกเว้น session ปัจจุบัน */
export async function changeOwnPassword(user: User, current: string, next: string, keepTokenHash?: string) {
  await ready();
  if (next.length < MIN_PASSWORD) throw new ManageError(`รหัสผ่านใหม่ต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัว`);
  if (next === current) throw new ManageError("รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสเดิม");
  const [row] = await sql<{ password_hash: string }[]>`SELECT password_hash FROM users WHERE id = ${user.id}`;
  if (!row || !(await verifyPassword(current, row.password_hash))) throw new ManageError("รหัสผ่านเดิมไม่ถูกต้อง");
  await sql`UPDATE users SET password_hash = ${await hashPassword(next)}, must_change_password = false WHERE id = ${user.id}`;
  await sql`DELETE FROM sessions WHERE user_id = ${user.id} AND token_hash <> ${keepTokenHash ?? ""}`;
  await audit(user, "user.change_password", user.email);
}

// ---------- คลินิก ----------

export async function listAllClinics(): Promise<ManagedClinic[]> {
  await ready();
  const rows = await sql<(Omit<ManagedClinic, "disabled"> & { disabled_at: Date | null })[]>`
    SELECT id, name, package, domain, site_url, template, disabled_at FROM clinics ORDER BY created_at, id
  `;
  return rows.map(({ disabled_at, ...c }) => ({ ...c, disabled: !!disabled_at }));
}

function checkClinicInput(c: { name: string; package: string; site_url: string; template: string | null }) {
  if (!c.name.trim()) throw new ManageError("กรุณาใส่ชื่อคลินิก");
  if (!isPlan(c.package)) throw new ManageError("แพ็กเกจไม่ถูกต้อง");
  if (!/^https?:\/\/\S+$/.test(c.site_url)) throw new ManageError("ลิงก์เว็บต้องขึ้นต้นด้วย http:// หรือ https://");
  if (!c.template) throw new ManageError("กรุณาเลือกแม่แบบเว็บ");
}

export async function createClinic(
  actor: User,
  c: { id: string; name: string; package: string; domain: string | null; site_url: string; template: string },
) {
  await ready();
  if (!CLINIC_ID_RE.test(c.id)) throw new ManageError("รหัสคลินิกใช้ได้เฉพาะ a-z 0-9 และขีด - (2-40 ตัว)");
  checkClinicInput(c);
  const exists = await sql`SELECT 1 FROM clinics WHERE id = ${c.id}`;
  if (exists.length) throw new ManageError("รหัสคลินิกนี้มีอยู่แล้ว");
  await sql`
    INSERT INTO clinics (id, name, package, domain, site_url, template)
    VALUES (${c.id}, ${c.name.trim()}, ${c.package}, ${c.domain || null}, ${c.site_url}, ${c.template})
  `;
  await audit(actor, "clinic.create", c.id, { package: c.package, template: c.template });
}

export async function updateClinic(
  actor: User,
  id: string,
  c: { name: string; package: string; domain: string | null; site_url: string; template: string | null },
) {
  await ready();
  checkClinicInput(c);
  const [row] = await sql<{ id: string }[]>`
    UPDATE clinics SET name = ${c.name.trim()}, package = ${c.package}, domain = ${c.domain || null},
      site_url = ${c.site_url}, template = ${c.template} WHERE id = ${id} RETURNING id
  `;
  if (!row) throw new ManageError("ไม่พบคลินิก");
  await audit(actor, "clinic.update", id, { package: c.package, template: c.template, domain: c.domain });
}

/** ปิดคลินิก: บัญชีคลินิกเข้าแก้ไม่ได้ (เว็บคลินิกยังแสดงตามเดิม) */
export async function setClinicDisabled(actor: User, id: string, disabled: boolean) {
  await ready();
  const [row] = await sql<{ id: string }[]>`
    UPDATE clinics SET disabled_at = ${disabled ? sql`now()` : null} WHERE id = ${id} RETURNING id
  `;
  if (!row) throw new ManageError("ไม่พบคลินิก");
  await audit(actor, disabled ? "clinic.disable" : "clinic.enable", id);
}
