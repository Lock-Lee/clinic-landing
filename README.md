# Clinic Web (Turborepo + bun)

monorepo สำหรับเว็บขายบริการทำเว็บคลินิกความงาม

| โฟลเดอร์ | คืออะไร | พอร์ต |
| --- | --- | --- |
| `apps/landing` | เว็บขายบริการทำเว็บไซต์และ Landing Page คลินิก | 3000 |
| `apps/clinic-starter-demo` | เว็บตัวอย่างแพ็กเกจ Starter | 3002 |
| `apps/clinic-demo` | เว็บตัวอย่างแพ็กเกจ Standard | 3001 |
| `apps/clinic-full-demo` | เว็บตัวอย่างแพ็กเกจ Premium | 3003 |
| `apps/admin` | admin กลาง ให้คลินิก login แก้เว็บตัวเอง | 3010 |
| `packages/db` | Postgres, ที่เก็บรูป, login, สิทธิ์ตามแพ็กเกจ | - |
| `packages/ui` | ของที่ใช้ร่วมกัน: แอนิเมชัน, แชท LINE จำลอง, ชุดเว็บหลายหน้า (`@repo/ui/site`) | - |
| `packages/typescript-config` | tsconfig กลาง | - |

เอกสาร: [docs/architecture.md](docs/architecture.md) (โครงสร้างและกติกา) · [docs/business.md](docs/business.md) (แพ็กเกจ ราคา เงื่อนไข)

## เริ่มใช้งาน
```bash
bun install
bun run db:up          # Postgres + ที่เก็บรูป (SeaweedFS) ใน Docker ต้องเปิด Docker/OrbStack ก่อน
bun run db:seed        # คลินิกตัวอย่าง + บัญชีทดสอบของ admin กลาง (ดูรหัสใน packages/db/seed.ts)
bun run dev            # รันทุกแอป
bun run dev:landing    # -> http://localhost:3000
bun run dev:starter    # -> http://localhost:3002
bun run dev:standard   # -> http://localhost:3001
bun run dev:premium    # -> http://localhost:3003
bun run dev:admin      # admin กลาง -> http://localhost:3010
bun run build
bun run typecheck
bun run test:e2e       # Playwright (ต้องเปิด Docker, ครั้งแรก: cd e2e && bunx playwright install chromium)
```

## แก้เนื้อหา
- Landing: ข้อมูลทั้งหมดอยู่ใน `apps/landing/app/content.ts`
  - `site` ชื่อแบรนด์, LINE, เบอร์โทร, อีเมล และ `url` (เปลี่ยนเป็นโดเมนจริงก่อนขึ้นเว็บ ใช้ทำ canonical, sitemap, Schema)
  - `showcase` ผลงาน: วางภาพหน้าจอไว้ใน `apps/landing/public/showcase/` แล้วใส่ path ใน `image` (ไม่ใส่จะแสดงกรอบสีจำลอง)
  - `packages`, `domainRows`, `maPlans`, `faqs` ราคา รายละเอียด และคำถามที่พบบ่อย

## Deploy
import repo ที่ vercel.com แล้วตั้ง Root Directory เป็นโฟลเดอร์แอป (หนึ่งโปรเจกต์ต่อหนึ่งแอป) แล้วแก้ `demoUrl` ใน `apps/landing/app/content.ts` เป็นโดเมนของเดโม
