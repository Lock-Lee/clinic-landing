# Clinic Web (Turborepo + bun)

monorepo สำหรับเว็บขายบริการทำเว็บคลินิกความงาม และเว็บเดโมคลินิกไว้โชว์ลูกค้า

| โฟลเดอร์ | คืออะไร | พอร์ต |
| --- | --- | --- |
| `apps/landing` | เว็บขายบริการทำเว็บไซต์และ Landing Page คลินิก | 3000 |
| `apps/clinic-demo` | เดโม Landing Page หน้าเดียว + `/line` ตัวอย่างแชท LINE OA | 3001 |
| `apps/agency-demo` | เดโมเว็บเอเจนซีหลายหน้า | 3002 |
| `apps/clinic-full-demo` | เดโมเว็บคลินิกหลายหน้า (บริการ 11 หน้า บทความ) | 3003 |
| `apps/clinic-branch-demo` | เดโมเว็บคลินิก 2 สาขา (สไลด์ โปร สมาชิก) | 3004 |
| `packages/ui` | ของที่ใช้ร่วมกัน: แอนิเมชัน, แชท LINE จำลอง, ชุดเว็บหลายหน้า (`@repo/ui/site`) | - |
| `packages/typescript-config` | tsconfig กลาง | - |

เอกสาร: [docs/architecture.md](docs/architecture.md) (โครงสร้างและกติกา) · [docs/business.md](docs/business.md) (แพ็กเกจ ราคา เงื่อนไข) · ทำเดโมใหม่ใช้ skill `.claude/skills/new-clinic-demo`

แต่ละแอปมีคำสั่ง `bun run dev:<landing|demo|agency|full|branch>`

## เริ่มใช้งาน
```bash
bun install
bun run dev            # รันทุกแอป
bun run dev:landing    # เฉพาะ landing  -> http://localhost:3000
bun run dev:demo       # เฉพาะ demo     -> http://localhost:3001
bun run build          # build ทุกแอป
bun run typecheck
```

## แก้เนื้อหา
- Landing: ข้อมูลทั้งหมดอยู่ใน `apps/landing/app/content.ts`
  - `site` ชื่อแบรนด์, LINE, เบอร์โทร, อีเมล และ `url` (เปลี่ยนเป็นโดเมนจริงก่อนขึ้นเว็บ ใช้ทำ canonical, sitemap, Schema)
  - `showcase` ผลงาน: วางภาพหน้าจอไว้ใน `apps/landing/public/showcase/` แล้วใส่ path ใน `image` (ไม่ใส่จะแสดงกรอบสีจำลอง)
  - `packages`, `domainRows`, `maPlans`, `faqs` ราคา รายละเอียด และคำถามที่พบบ่อย
- Demo: `apps/clinic-demo/app/content.ts` (ชื่อคลินิก, บริการ, โปรโมชัน, แพทย์, รีวิว, FAQ) สีอยู่บนสุดของ `apps/clinic-demo/app/globals.css`

## ทำเดโมคลินิกใหม่
คัดลอก `apps/clinic-demo` เป็นโฟลเดอร์ใหม่ เปลี่ยน `name` และพอร์ตใน `package.json` แล้วแก้ `content.ts` กับสี จากนั้นรัน `bun install`

## Deploy
import repo ที่ vercel.com แล้วตั้ง Root Directory เป็น `apps/landing` หรือ `apps/clinic-demo` (หนึ่งโปรเจกต์ต่อหนึ่งแอป)
