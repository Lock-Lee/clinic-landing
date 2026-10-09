# โครงสร้างโปรเจกต์

Turborepo + bun workspaces + Next.js 15 (App Router) หน้า landing เป็น static ส่วนเดโมทั้ง 3 ตัวและ admin กลางใช้ Postgres + ที่เก็บรูป S3 ใน Docker

## แอป

| แอป | คืออะไร | พอร์ต | คำสั่ง |
| --- | --- | --- | --- |
| `apps/landing` | เว็บขายบริการของเรา | 3000 | `bun run dev:landing` |
| `apps/clinic-starter-demo` | เว็บตัวอย่างแพ็กเกจ Starter: หน้าเดียว 6 section (Mira Skin) | 3002 | `bun run dev:starter` |
| `apps/clinic-demo` | เว็บตัวอย่างแพ็กเกจ Standard: หน้าเดียวเต็ม + `/line` แชท LINE OA (Lumière) | 3001 | `bun run dev:standard` |
| `apps/clinic-full-demo` | เว็บตัวอย่างแพ็กเกจ Premium: หลายหน้า บริการแยก บทความ เมนูย่อยแก้ได้ (Atelier Belle) | 3003 | `bun run dev:premium` |
| `apps/admin` | admin กลาง: คลินิก login แก้เว็บตัวเองตามสิทธิ์แพ็กเกจ | 3010 | `bun run dev:admin` |

`bun run build`, `bun run typecheck`

การ์ดแพ็กเกจในหน้า landing ลิงก์ไปเดโมทั้ง 3 ตัวผ่าน `demoUrl` ใน `apps/landing/app/content.ts` (ตอนนี้เป็น localhost ต้องเปลี่ยนเป็นโดเมนจริงหลัง deploy)

`agency-demo`, `clinic-branch-demo`, `clinic-explore-demo` ลบออกเมื่อ 2026-10-09 (สองตัวแรกดูได้ใน git history)

## หลังบ้าน: Postgres + ที่เก็บรูป + admin กลาง

- Docker: `docker-compose.yml` ที่ root (`bun run db:up` / `db:down`, ต้องเปิด OrbStack/Docker ก่อน) ค่าเชื่อมต่อทั้งหมดใน `.env.example` ไม่ตั้งก็ใช้ค่าในนั้น
  - `db` Postgres 17 พอร์ต 5432 (user/pass/db = `clinic`) schema ใน `packages/db/init.sql` (สำเนาใน `src/schema.ts` แก้คู่กัน)
  - `s3` SeaweedFS (S3 API) พอร์ต 8333 bucket `clinic-media` อ่านแบบสาธารณะ สิทธิ์ใน `docker/s3.json` / `s3-init` สร้าง bucket ตอนเปิด
  - เลือก SeaweedFS เพราะ MinIO เลิกแจก Docker image ฟรีแล้ว (ดึงไม่ได้เมื่อ ต.ค. 2026) โค้ดใช้ S3 API ล้วน ย้ายไป MinIO / Cloudflare R2 / AWS S3 ได้ด้วยการเปลี่ยน `S3_*` ใน env
- `bun run db:seed` (`packages/db/seed.ts`) สร้างคลินิก 3 รายและบัญชีทดสอบ (รหัสอยู่ในไฟล์นั้น ใช้กับเดโมเท่านั้น)
- `packages/db` (`@repo/db`)
  - `.`: `getContent(site, defaults)` (ฐานข้อมูลไม่เปิดคืนค่าเริ่มต้น), `saveContent(site, data, allowedKeys?)`, `resetContent`, `sql`
  - `./route`: `createContentRoute(site)` PUT/DELETE สำหรับ `/api/admin` ของเว็บเดโม
  - `./storage`: `uploadImage`, `createUploadRoute(authorize)` รับ multipart `file` คืน `{ url }` (JPG/PNG/WebP/GIF ไม่เกิน 5 MB)
  - `./auth`: ผู้ใช้ (`staff` เห็นทุกคลินิก / `clinic` เห็นเฉพาะใน `clinic_members`), รหัสผ่าน scrypt, session token เก็บแบบ hash ในตาราง `sessions`
  - `./plans`: สิทธิ์ตามแพ็กเกจ `PLAN_SECTIONS` Starter = clinic hero services / Standard + promotions reviews / Premium + articles nav (ชื่อตรงกับ key ใน `editableDefaults` และ id แท็บในหลังบ้าน)
- `@repo/ui/admin` + `admin.css` (class `adm-*`): `AdminShell`, `useDraft`, `TextField`, `ImageField` (ย่อรูปแล้วอัปโหลดเข้า S3), `ListEditor`, `Toggle`, `AdminFab`, `AdminHostProvider` (admin กลางส่ง endpoint, uploadEndpoint, ลิงก์ดูเว็บ, แท็บที่แพ็กแก้ได้ ลงไปให้ editor โดยไม่ต้องแก้ editor)
- แต่ละเดโม: `content.ts` มี `SITE_ID`, `editableDefaults`, `EditableContent` / `app/admin/` (page + editor) / `app/api/admin/route.ts` + `upload/route.ts` / หน้าที่อ่านเนื้อหาใช้ `force-dynamic` / package.json `exports` ให้ admin กลางดึง `./content` และ `./admin-editor`
- **`/admin` ในเว็บเดโมไม่มี login จริง** ไว้ให้ลูกค้าลองเล่น ทุกคนแก้และเห็นชุดเดียวกัน
- `apps/admin` (พอร์ต 3010 `bun run dev:admin`): admin กลาง login จริง คลินิกแก้ได้เฉพาะเว็บตัวเอง ตามสิทธิ์แพ็กเกจ (ตรวจทั้งหน้าและ API) แต่ละเว็บคลินิกใช้โดเมนของตัวเองได้ (`clinics.domain`) เว็บคลินิกแค่อ่านเนื้อหาจากฐานข้อมูลกลาง
  - ทีมงาน (staff): `/` คลินิกทั้งหมด + เพิ่มคลินิก, `/clinics/[id]/settings` ชื่อ แพ็กเกจ แม่แบบ ลิงก์ โดเมน ปิด/เปิด, `/users` + `/users/[id]` สร้างผู้ใช้ (รหัสชั่วคราวแสดงครั้งเดียว) แก้ รีเซ็ตรหัส ปิด/เปิด ลบ, `/audit` บันทึกการใช้งาน
  - ทุกคน: `/account/password` เปลี่ยนรหัส บัญชีที่ได้รหัสชั่วคราวถูกบังคับมาหน้านี้ก่อน
  - ฟังก์ชันอยู่ใน `@repo/db/users` (ทุกการแก้บันทึก `audit_log`) แม่แบบของคลินิก = `clinics.template ?? clinics.id` (`apps/admin/lib/templates.ts`)
  - เปิดคลินิกลูกค้าใหม่จาก command line: `bun run clinic:new` (skill `new-clinic`) รหัสชั่วคราวเขียนลง `.onboarding/<id>.txt`
- เว็บคลินิกจริงที่ใช้แม่แบบเดโม: ตั้ง `CLINIC_ID` ตอน deploy (`SITE_ID = process.env.CLINIC_ID ?? "<แม่แบบ>"`)

## เทสต์ e2e (`e2e/`)

- Playwright รันกับ dev server ที่เปิดอยู่ (ไม่มีก็สั่งเปิดเอง ไม่ build) ต้องเปิด Docker ก่อน: `bun run test:e2e` / ครั้งแรก `cd e2e && bunx playwright install chromium`
- รันทีละเทสต์ (`workers: 1`) เพราะทุกเว็บใช้ฐานข้อมูลเดียวกัน ก่อนและหลังรัน seed ใหม่และล้าง `site_content` ทุกเทสต์ล้างเนื้อหาที่ตัวเองแก้ (`fixtures/db.ts`)
- บัญชีทดสอบอ่านจาก `packages/db/seed-data.ts` ที่เดียวกับ `db:seed`
- `landing.spec.ts` ราคา/ลิงก์, `demo-admin.spec.ts` หลังบ้านเดโม 3 แพ็ก (แก้ อัปโหลดรูป หน้าบริการใหม่ slug ซ้ำ รูปในบทความ เมนูย่อย สิทธิ์ API), `central-admin.spec.ts` login สิทธิ์คลินิก สิทธิ์แพ็กเกจ API, `user-management.spec.ts` สร้าง/รีเซ็ต/ปิด/ลบผู้ใช้ คลินิกใหม่ บังคับเปลี่ยนรหัส, `mobile.spec.ts` 375px ไม่เลื่อนแนวนอน
- ผู้ใช้ `%@e2e.test` และคลินิก `e2e-%` ถูกลบอัตโนมัติ (`fixtures/cleanup.ts`) `audit_log` ไม่ถูกล้าง
- แก้ข้อความปุ่ม/label ในหลังบ้านแล้วต้องแก้เทสต์ตามด้วย

## งานดีไซน์ (skill `impeccable`)

- `.claude/skills/impeccable` (v4.3.1, Apache-2.0 จาก pbakaus/impeccable) บริบทของโปรเจกต์อยู่ใน `PRODUCT.md` ที่ root (ฟอนต์ไทย, 375px, เกณฑ์ สบส., class ที่เทสต์อ้าง)
- **ไม่รัน `scripts/impeccable`** (ตัวเปิดคำสั่งดาวน์โหลด binary จาก GitHub มารัน) ใช้ทางเลือกสำรองที่ skill รองรับ คืออ่าน PRODUCT.md ตรงๆ ไม่เปิด design hook

## แพ็กเกจที่ใช้ร่วมกัน (`packages/ui`)

| import | ใช้ทำอะไร |
| --- | --- |
| `@repo/ui/motion` + `motion.css` | `<Motion selector>` แอนิเมชันเลื่อนขึ้นเมื่อเลื่อนหน้าจอ |
| `@repo/ui/line-chat` + `line-chat.css` | `<LineChatMock>` แชท LINE OA + Rich Menu จำลอง กดได้ |
| `@repo/ui/site` + `site.css` | ชุดเว็บหลายหน้า: `SiteHeader` (เมนูมือถือ), `SiteFooter`, `PageHero`, `SectionHead`, `Placeholder`, `FaqList`, `FaqJsonLd`, `DemoForm`, `DemoBar`, `LineFloat`, `RouteMotion` |

`site.css` ใช้ class `sk-*` และสีจาก token ใน `:root` ของแต่ละแอป: `--ground --surface --ink --muted --line --accent --accent-dark --accent-soft --dark --on-dark --radius` และฟอนต์ `--font-display --font-body`

แอปที่ import `@repo/ui` ต้องมี `transpilePackages: ["@repo/ui"]` ใน `next.config.mjs`

## Tailwind + shadcn

`clinic-full-demo` เป็น CSS ธรรมดา และ `clinic-starter-demo` ใช้ Tailwind แต่ไม่มี component

- Tailwind v4 (`postcss.config.mjs` + `@import "tailwindcss"` ใน `app/globals.css`), โครง shadcn: `components.json`, `components/ui/`, `lib/utils.ts` (`cn`)
- เพิ่ม component แบบ shadcn ได้ด้วย `bunx shadcn@latest add <ชื่อ>` ในโฟลเดอร์แอปนั้น
- token ของ shadcn (`bg-background`, `text-muted-foreground`, `bg-primary` ฯลฯ) ผูกกับสีของเว็บใน `@theme inline` ของ `globals.css`
- **กติกา layer:** CSS ที่ไม่อยู่ใน layer จะชนะ utility ของ Tailwind เสมอ จึงต้องให้ CSS เดิมอยู่ใน `@layer base`
  - CSS จาก `@repo/ui` (`site.css`, `motion.css`, `line-chat.css`) import ใน `globals.css` ด้วย `layer(base)` ไม่ใช่ใน `layout.tsx`
  - CSS ของเว็บเองห่อด้วย `@layer base { ... }` ทั้งก้อน
- แอนิเมชันใช้แพ็กเกจ `motion` (`import ... from "motion/react"`) ตัวเดียว
- component ใน `components/ui/` (ชุดเดียวกับบน 21st.dev แต่ 21st.dev ต้อง login จึงดึงจาก registry สาธารณะของผู้สร้าง แล้วปรับสีให้เข้าธีม):

| ไฟล์ | ที่มา | ใช้ที่ |
| --- | --- | --- |
| `hero-3.tsx` (`AnimatedMarqueeHero`) | 21st.dev (ผู้ใช้วาง prompt มา) | ยังไม่ได้ใช้ |
| `number-ticker.tsx` | Magic UI | ยังไม่ได้ใช้ |
| `bento-grid.tsx` | Aceternity UI | ยังไม่ได้ใช้ |
| `focus-cards.tsx` | Aceternity UI | ยังไม่ได้ใช้ |
| `timeline.tsx` | Aceternity UI | ขั้นตอนการทำงาน (`titleClassName` ปรับขนาดหัวข้อ) |
| `border-beam.tsx` | Magic UI | การ์ด Standard (มีกล่องนอก overflow-hidden กันล้นจอ) |

- `landing` มีเอฟเฟกต์ของตัวเองใน `components/fx/` (เลียนแบบแอนิเมชันของ fahrunstudio.com) CSS อยู่ท้าย `globals.css` ใช้ class `fx-*`:

| ไฟล์ | ทำอะไร |
| --- | --- |
| `chrome-blob.tsx` | วัตถุโครเมียมเหลว 3D ใน hero วาดด้วย WebGL ล้วน หยุดเมื่อพ้นจอ ไม่มี WebGL ใช้แสงไล่สีแทน |
| `cursor.tsx` | ลูกบอลตามเมาส์ ใส่ `data-cursor="ข้อความ"` ให้กลายเป็นวงกลมมีข้อความ (เฉพาะเครื่องที่มีเมาส์) |
| `split-words.tsx` | ตัดคำไทยด้วย `Intl.Segmenter` ให้หัวข้อ hero ลอยขึ้นทีละคำ (CSS ล้วน) |
| `scroll-text.tsx` | ข้อความสว่างทีละตัวตามการเลื่อน (`statement`) |
| `velocity-marquee.tsx` | แถบตัวอักษรวิ่ง (`marqueeWords` + `heroImages`) เร็วขึ้นตามความเร็วการเลื่อน |
| `projects.tsx` | ผลงาน `#showcase` กรอบภาพขยายเมื่อเลื่อนถึง ภาพซูมออกตามการเลื่อน |
| `rise-in.tsx` | ชื่อแบรนด์ใหญ่ท้ายเว็บโผล่ขึ้นจากใต้เส้น |

  preloader เป็น CSS ล้วน (`.fx-preloader` ใน `page.tsx`) ทุกเอฟเฟกต์ปิดตัวเองเมื่อผู้ใช้ตั้ง prefers-reduced-motion
- ภาพทั้งหมดเป็น Unsplash ใน `content.ts` (`heroImages`, `image` ของ projects/services)
- เช็กแอนิเมชันที่เริ่มเมื่อเลื่อนถึง (ตัวเลข, timeline, reveal) ต้องเปิดหน้าเว็บให้มองเห็นจริง แท็บที่ซ่อนอยู่จะไม่รัน requestAnimationFrame/IntersectionObserver
- แอปอื่นยังเป็น CSS ธรรมดา ถ้าจะใช้ component จาก shadcn/21st.dev ในแอปอื่น ให้ตั้งค่าแบบเดียวกันก่อน

## กติกา

- เนื้อหาของแต่ละแอปอยู่ใน `app/content.ts` ไฟล์เดียว หน้าเว็บดึงจากตรงนั้น
- เว็บเดโมตั้ง `robots: noindex` และมีแถบ `DemoBar` บอกว่าเป็นข้อมูลสมมติ
- **อย่ารัน `build` ตอน dev server ยังเปิดอยู่** ทั้งสองใช้โฟลเดอร์ `.next` เดียวกัน build จะเขียนทับแล้วเว็บ dev ขึ้น Internal Server Error แก้โดยปิด dev, ลบ `apps/<app>/.next`, เปิดใหม่
- รันคำสั่งจาก root ของ repo ไม่ใช่จาก root แบบ Next.js เดิม
- `AGENTS.md` ถูก `turbo` สร้างและเติมเองอัตโนมัติ

## Deploy

Vercel หนึ่งโปรเจกต์ต่อหนึ่งแอป ตั้ง Root Directory เป็น `apps/<ชื่อแอป>` ก่อนขึ้นจริงต้องเปลี่ยน `url` ใน `content.ts` เป็นโดเมนจริง
