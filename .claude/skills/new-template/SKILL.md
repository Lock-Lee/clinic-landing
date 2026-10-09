---
name: new-template
description: ทำแม่แบบเว็บคลินิกใหม่หรือเดโมใหม่ใน monorepo นี้ (เช่นจากลิงก์อ้างอิงที่ลูกค้าส่งมา) ให้ครบทั้งหน้าเว็บ หลังบ้าน /admin สิทธิ์ตามแพ็กเกจ การต่อเข้า admin กลาง และเทสต์ e2e ใช้เมื่อถูกขอให้ "ทำเดโมใหม่", "ทำเว็บแบบ <ลิงก์>", "เพิ่มแม่แบบ", "เพิ่ม apps/..."
---

# ทำแม่แบบ/เดโมใหม่

อ่าน `docs/architecture.md` และ `docs/business.md` ก่อน แม่แบบที่มีอยู่คือแบบอย่าง:

| แบบ | แพ็ก | คัดลอกจาก |
| --- | --- | --- |
| หน้าเดียว เทมเพลต 5-6 section | Starter | `apps/clinic-starter-demo` (เล็กสุด อ่านง่ายสุด) |
| หน้าเดียวเต็ม โปร รีวิว แชท LINE | Standard | `apps/clinic-demo` |
| หลายหน้า บริการ/บทความ/เมนูย่อย | Premium | `apps/clinic-full-demo` |

ลูกค้าส่งลิงก์อ้างอิงมา: เปิดดูด้วย browser จดว่ามีหน้าอะไร section อะไร แล้วเลือกแม่แบบที่ใกล้สุด เว็บคลินิกหลายหน้าส่วนใหญ่คือ Premium

## 1. คัดลอกและตั้งค่า

1. `cp -R apps/<แม่แบบ> apps/<ชื่อใหม่>` แล้วลบ `.next` `node_modules` `.turbo` ในโฟลเดอร์ใหม่
2. `package.json`: `name`, พอร์ตใน `dev`/`start` (พอร์ตถัดไปที่ว่าง ดูตารางใน architecture.md), คง `exports` (`./content`, `./admin-editor`)
3. root `package.json`: เพิ่ม `dev:<ชื่อ>` / `.claude/launch.json`: เพิ่ม config
4. `bun install`

## 2. เนื้อหาและหน้าตา

- ข้อมูลอยู่ที่ `app/content.ts` ที่เดียว สีใน `:root` ของ `app/globals.css` ฟอนต์ใน `app/layout.tsx` (ต้องมี subset `thai`)
- **ข้อมูลสมมติเท่านั้น** ห้ามใช้ชื่อ โลโก้ ข้อความ รูป หรือชื่อแพทย์ของคลินิกจริง
- คงไว้: แถบเดโม, `robots: noindex`, "ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล", ช่องยินยอม PDPA ในฟอร์ม, `<AdminFab />`
- เนื้อหาการแพทย์เป็นข้อมูลทั่วไป ไม่อ้างผลเกินจริง ไม่มีภาพก่อน-หลัง

## 3. หลังบ้าน (ต้องมีทุกแม่แบบ)

- `content.ts`: `SITE_ID = process.env.CLINIC_ID ?? "<id ใหม่>"`, `editableDefaults`, `EditableContent`
- key ใน `editableDefaults` ต้องเป็นชื่อใน `PLAN_SECTIONS` (`packages/db/src/plans.ts`) ถ้าต้องมี key ใหม่ ใช้ skill `add-editable-section`
- หน้าที่อ่านเนื้อหา: `export const dynamic = "force-dynamic"` + `await getContent(SITE_ID, editableDefaults)`
- `app/api/admin/route.ts`: `createContentRoute(SITE_ID, PLAN_SECTIONS.<แพ็ก>)` / `app/api/admin/upload/route.ts`: `createUploadRoute`
- `app/admin/editor.tsx`: `AdminEditor({ initial, defaults })` ใช้ `@repo/ui/admin` เท่านั้น id ของแท็บ = key ของเนื้อหา ห้าม hard-code `/api/...` (endpoint มาจาก context เพื่อให้ admin กลางใช้ editor นี้ได้)
- ใช้ class `adm-*` จาก `admin.css` ถ้าต้องมีสไตล์ใหม่ที่ใช้ได้ทั่วไป ใส่ใน `packages/ui/src/admin/admin.css` ไม่ใช่ globals.css ของแอป (admin กลางไม่โหลด CSS ของแอป)

## 4. ต่อเข้า admin กลาง

- `apps/admin/package.json`: เพิ่ม workspace ใหม่ใน dependencies / `next.config.mjs`: เพิ่มใน `transpilePackages`
- `apps/admin/lib/templates.ts`: เพิ่มแม่แบบ (Editor, defaults, ชื่อไทย)
- `bun install`

## 5. ตรวจ (ห้ามข้าม)

1. `bun run typecheck` ผ่านทุก workspace
2. รัน dev เฉพาะแอปนั้น **ห้าม build ระหว่าง dev เปิดอยู่** curl ทุก route ได้ 200, slug ที่ไม่มีได้ 404
3. เพิ่มเทสต์ใน `e2e/tests/` (แก้แล้วหน้าเว็บเปลี่ยน, API ไม่บันทึกส่วนที่แพ็กไม่มีสิทธิ์, หน้าใหม่ใน `mobile.spec.ts`) แล้ว `bun run test:e2e` ผ่านทั้งหมด
4. อัปเดตตารางแอปใน `docs/architecture.md` และ README
