import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { ready, sql } from "./index";

// ผู้ใช้ + session ของ admin กลาง (apps/admin) ใช้ฝั่ง server เท่านั้น
const scryptAsync = promisify(scrypt) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export type Role = "staff" | "clinic";
export type User = { id: number; email: string; name: string; role: Role; mustChangePassword?: boolean };
export type Clinic = { id: string; name: string; package: string; domain: string | null; site_url: string; template?: string | null };

export const SESSION_DAYS = 7;

// เก็บเป็น scrypt$<salt hex>$<hash hex>
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, saltHex, hashHex] = stored.split("$");
  if (algo !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return timingSafeEqual(actual, expected);
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
/** hash ของ token ใน cookie (ตามที่เก็บในตาราง sessions) */
export const hashToken = sha256;

/** ตรวจอีเมล + รหัสผ่าน ถูกต้องคืน token ของ session ใหม่ (เก็บใน cookie) ผิดคืน null */
export async function login(email: string, password: string): Promise<string | null> {
  await ready();
  // บัญชีที่ถูกปิดถือว่าไม่มีอยู่
  const rows = await sql<{ id: number; password_hash: string }[]>`
    SELECT id, password_hash FROM users WHERE email = ${email.trim().toLowerCase()} AND disabled_at IS NULL
  `;
  const user = rows[0];
  // ไม่มีผู้ใช้ก็ยัง hash หนึ่งรอบ ให้เวลาตอบใกล้เคียงกัน
  const ok = user ? await verifyPassword(password, user.password_hash) : (await hashPassword(password), false);
  if (!user || !ok) return null;

  const token = randomBytes(32).toString("base64url");
  await sql`
    INSERT INTO sessions (token_hash, user_id, expires_at)
    VALUES (${sha256(token)}, ${user.id}, now() + ${`${SESSION_DAYS} days`}::interval)
  `;
  await sql`DELETE FROM sessions WHERE expires_at < now()`;
  return token;
}

export async function logout(token: string): Promise<void> {
  await ready();
  await sql`DELETE FROM sessions WHERE token_hash = ${sha256(token)}`;
}

export async function getSessionUser(token: string | undefined): Promise<User | null> {
  if (!token) return null;
  try {
    await ready();
    const rows = await sql<(User & { must_change_password: boolean })[]>`
      SELECT u.id, u.email, u.name, u.role, u.must_change_password FROM sessions s JOIN users u ON u.id = s.user_id
      WHERE s.token_hash = ${sha256(token)} AND s.expires_at > now() AND u.disabled_at IS NULL
    `;
    const r = rows[0];
    return r ? { id: r.id, email: r.email, name: r.name, role: r.role, mustChangePassword: r.must_change_password } : null;
  } catch {
    return null;
  }
}

/** คลินิกที่ผู้ใช้นี้แก้ได้: staff เห็นทั้งหมด, clinic เห็นเฉพาะที่เป็นสมาชิกและคลินิกยังไม่ถูกปิด */
export async function listClinics(user: User): Promise<Clinic[]> {
  await ready();
  return user.role === "staff"
    ? sql<Clinic[]>`SELECT id, name, package, domain, site_url, template FROM clinics ORDER BY created_at, id`
    : sql<Clinic[]>`
        SELECT c.id, c.name, c.package, c.domain, c.site_url, c.template FROM clinics c
        JOIN clinic_members m ON m.clinic_id = c.id
        WHERE m.user_id = ${user.id} AND c.disabled_at IS NULL ORDER BY c.created_at, c.id
      `;
}

/** คลินิกที่ผู้ใช้นี้มีสิทธิ์แก้ ไม่มีสิทธิ์หรือไม่มีคลินิกนี้คืน null */
export async function getClinicFor(user: User, clinicId: string): Promise<Clinic | null> {
  const clinics = await listClinics(user);
  return clinics.find((c) => c.id === clinicId) ?? null;
}

// สำหรับ seed: สร้างหรืออัปเดตคลินิกและผู้ใช้
export async function upsertClinic(c: Clinic): Promise<void> {
  await ready();
  await sql`
    INSERT INTO clinics (id, name, package, domain, site_url, template)
    VALUES (${c.id}, ${c.name}, ${c.package}, ${c.domain}, ${c.site_url}, ${c.template ?? c.id})
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, package = EXCLUDED.package, domain = EXCLUDED.domain,
      site_url = EXCLUDED.site_url, template = EXCLUDED.template, disabled_at = NULL
  `;
}

export async function upsertUser(u: { email: string; name: string; role: Role; password: string; clinics?: string[] }): Promise<void> {
  await ready();
  const hash = await hashPassword(u.password);
  const [row] = await sql<{ id: number }[]>`
    INSERT INTO users (email, name, role, password_hash) VALUES (${u.email.toLowerCase()}, ${u.name}, ${u.role}, ${hash})
    ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, password_hash = EXCLUDED.password_hash,
      disabled_at = NULL, must_change_password = false
    RETURNING id
  `;
  if (!row) return;
  await sql`DELETE FROM clinic_members WHERE user_id = ${row.id}`;
  for (const clinicId of u.clinics ?? []) {
    await sql`INSERT INTO clinic_members (user_id, clinic_id) VALUES (${row.id}, ${clinicId}) ON CONFLICT DO NOTHING`;
  }
}

export async function closeDb(): Promise<void> {
  await sql.end({ timeout: 2 });
}
