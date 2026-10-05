# Clinic Web

monorepo เว็บขายบริการทำเว็บคลินิกความงาม + เว็บเดโม ตอบเป็นภาษาไทย

- โครงสร้าง แอป พอร์ต และกติกา: `docs/architecture.md`
- แพ็กเกจ ราคา เงื่อนไข LINE OA SEO/AEO ที่ตกลงแล้ว: `docs/business.md` (แก้ราคาใน `apps/landing/app/content.ts` ต้องอัปเดตไฟล์นี้ด้วย)
- ทำเดโมใหม่: skill `new-clinic-demo`
- ใช้ bun เท่านั้น ห้ามใช้ npm/npx กับ repo นี้ (`bunx turbo ...` ได้)
- ห้ามรัน build ระหว่าง dev server เปิดอยู่
- ทุกหน้าต้องใช้ได้บนมือถือ 375px
