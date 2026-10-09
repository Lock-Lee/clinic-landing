// เปิดคลินิกใหม่ใน admin กลาง: สร้างคลินิก + บัญชีแอดมินคลินิก (รหัสชั่วคราว ต้องเปลี่ยนตอนเข้าครั้งแรก)
// bun packages/db/scripts/new-clinic.ts --id lumiere --name "Lumière Clinic" --package Standard --template standard \
//   --site-url https://lumiere.co.th --domain lumiere.co.th --email owner@lumiere.co.th --user-name "คุณเอ"
// รหัสชั่วคราวเขียนลงไฟล์ .onboarding/<id>.txt (ไม่อยู่ใน git) ไม่พิมพ์ออกหน้าจอ ส่งให้คลินิกแล้วลบไฟล์ทิ้ง
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { closeDb, type User } from "../src/auth";
import { sql } from "../src/index";
import { createClinic, createUser, ManageError } from "../src/users";

const { values: a } = parseArgs({
  options: {
    id: { type: "string" },
    name: { type: "string" },
    package: { type: "string" },
    template: { type: "string" },
    "site-url": { type: "string" },
    domain: { type: "string" },
    email: { type: "string" },
    "user-name": { type: "string" },
    actor: { type: "string", default: "staff@demo.test" },
  },
});

const required = ["id", "name", "package", "template", "site-url", "email", "user-name"] as const;
const missing = required.filter((k) => !a[k]);
if (missing.length) {
  console.error(`ขาด: ${missing.map((k) => `--${k}`).join(" ")}`);
  process.exit(1);
}

try {
  // บันทึกการใช้งานในนามบัญชีทีมงาน (--actor)
  const [actor] = await sql<User[]>`SELECT id, email, name, role FROM users WHERE email = ${a.actor!} AND role = 'staff'`;
  if (!actor) throw new ManageError(`ไม่พบบัญชีทีมงาน ${a.actor}`);

  await createClinic(actor, {
    id: a.id!,
    name: a.name!,
    package: a.package!,
    template: a.template!,
    site_url: a["site-url"]!,
    domain: a.domain ?? null,
  });
  const { password } = await createUser(actor, { email: a.email!, name: a["user-name"]!, role: "clinic", clinics: [a.id!] });

  const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../../.onboarding");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${a.id}.txt`);
  writeFileSync(
    file,
    `คลินิก: ${a.name} (${a.id}) แพ็กเกจ ${a.package}\nเข้าระบบ: <URL admin กลาง>/login\nอีเมล: ${a.email}\nรหัสผ่านชั่วคราว: ${password}\nเข้าครั้งแรกระบบจะให้ตั้งรหัสใหม่\n`,
    { mode: 0o600 },
  );
  console.log(`สร้างคลินิก ${a.id} และบัญชี ${a.email} แล้ว รหัสชั่วคราวอยู่ที่ ${path.relative(process.cwd(), file)}`);
} catch (e) {
  console.error(e instanceof ManageError ? e.message : e);
  process.exitCode = 1;
} finally {
  await closeDb();
}
