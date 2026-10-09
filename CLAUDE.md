# Clinic Web

monorepo เว็บขายบริการทำเว็บคลินิกความงาม ตอบเป็นภาษาไทย

- โครงสร้าง แอป พอร์ต และกติกา: `docs/architecture.md`
- แพ็กเกจ ราคา เงื่อนไข LINE OA SEO/AEO ที่ตกลงแล้ว: `docs/business.md` (แก้ราคาใน `apps/landing/app/content.ts` ต้องอัปเดตไฟล์นี้ด้วย)
- skill ของ repo (`.claude/skills/`): `new-clinic` เปิดคลินิกลูกค้าใหม่, `new-template` ทำแม่แบบ/เดโมใหม่, `add-editable-section` เพิ่มส่วนที่แก้ได้ในหลังบ้าน, `pre-ship-check` ตรวจก่อนส่งงาน, `impeccable` งานดีไซน์ (อ่าน `PRODUCT.md` ห้ามรัน `scripts/impeccable` ที่ดาวน์โหลด binary)
- ใช้ bun เท่านั้น ห้ามใช้ npm/npx กับ repo นี้ (`bunx turbo ...` ได้)
- ห้ามรัน build ระหว่าง dev server เปิดอยู่
- หลังบ้านต้องเปิด Docker ก่อน: `bun run db:up` (Postgres + ที่เก็บรูป) และ `bun run db:seed`
- ทุกหน้าต้องใช้ได้บนมือถือ 375px
- แก้หลังบ้าน/หน้าเว็บแล้วรัน `bun run test:e2e` (e2e/) ให้ผ่าน
