# โครงสร้างโปรเจกต์

Turborepo + bun workspaces + Next.js 15 (App Router) ทุกแอปเป็น static/SSG ไม่มี backend

## แอป

| แอป | คืออะไร | พอร์ต | คำสั่ง |
| --- | --- | --- | --- |
| `apps/landing` | เว็บขายบริการของเรา | 3000 | `bun run dev:landing` |
| `apps/clinic-demo` | เดโม Landing Page หน้าเดียว (Lumière) + `/line` แชท LINE OA | 3001 | `bun run dev:demo` |
| `apps/agency-demo` | เดโมเว็บเอเจนซีหลายหน้า (Nova Studio) | 3002 | `bun run dev:agency` |
| `apps/clinic-full-demo` | เดโมเว็บคลินิกหลายหน้า บริการ 11 หน้า บทความ (Atelier Belle) | 3003 | `bun run dev:full` |
| `apps/clinic-branch-demo` | เดโมเว็บคลินิก 2 สาขา สไลด์ สมาชิก (Glow Lab) | 3004 | `bun run dev:branch` |

`bun run dev` รันทุกแอปพร้อมกัน, `bun run build`, `bun run typecheck`

## แพ็กเกจที่ใช้ร่วมกัน (`packages/ui`)

| import | ใช้ทำอะไร |
| --- | --- |
| `@repo/ui/motion` + `motion.css` | `<Motion selector>` แอนิเมชันเลื่อนขึ้นเมื่อเลื่อนหน้าจอ |
| `@repo/ui/line-chat` + `line-chat.css` | `<LineChatMock>` แชท LINE OA + Rich Menu จำลอง กดได้ |
| `@repo/ui/site` + `site.css` | ชุดเว็บหลายหน้า: `SiteHeader` (เมนูมือถือ), `SiteFooter`, `PageHero`, `SectionHead`, `Placeholder`, `FaqList`, `FaqJsonLd`, `DemoForm`, `DemoBar`, `LineFloat`, `RouteMotion` |

`site.css` ใช้ class `sk-*` และสีจาก token ใน `:root` ของแต่ละแอป: `--ground --surface --ink --muted --line --accent --accent-dark --accent-soft --dark --on-dark --radius` และฟอนต์ `--font-display --font-body`

แอปที่ import `@repo/ui` ต้องมี `transpilePackages: ["@repo/ui"]` ใน `next.config.mjs`

## Tailwind + shadcn (`landing`, `clinic-demo`, `agency-demo`)

`clinic-full-demo` และ `clinic-branch-demo` ยังเป็น CSS ธรรมดา

- Tailwind v4 (`postcss.config.mjs` + `@import "tailwindcss"` ใน `app/globals.css`), โครง shadcn: `components.json`, `components/ui/`, `lib/utils.ts` (`cn`)
- เพิ่ม component แบบ shadcn ได้ด้วย `bunx shadcn@latest add <ชื่อ>` ในโฟลเดอร์แอปนั้น
- token ของ shadcn (`bg-background`, `text-muted-foreground`, `bg-primary` ฯลฯ) ผูกกับสีของเว็บใน `@theme inline` ของ `globals.css`
- **กติกา layer:** CSS ที่ไม่อยู่ใน layer จะชนะ utility ของ Tailwind เสมอ จึงต้องให้ CSS เดิมอยู่ใน `@layer base`
  - CSS จาก `@repo/ui` (`site.css`, `motion.css`, `line-chat.css`) import ใน `globals.css` ด้วย `layer(base)` ไม่ใช่ใน `layout.tsx`
  - CSS ของเว็บเองใน `landing` และ `clinic-demo` ห่อด้วย `@layer base { ... }` ทั้งก้อน
- ไฟล์ใน `components/ui/` ของทั้ง 3 แอปเป็นชุดเดียวกัน ถ้าแก้ตัวหนึ่งให้คัดลอกไปอีกสองแอปด้วย
- แอนิเมชันใช้แพ็กเกจ `motion` (`import ... from "motion/react"`) ตัวเดียว
- component ใน `components/ui/` (ชุดเดียวกับบน 21st.dev แต่ 21st.dev ต้อง login จึงดึงจาก registry สาธารณะของผู้สร้าง แล้วปรับสีให้เข้าธีม):

| ไฟล์ | ที่มา | ใช้ที่ |
| --- | --- | --- |
| `hero-3.tsx` (`AnimatedMarqueeHero`) | 21st.dev (ผู้ใช้วาง prompt มา) | hero หน้าแรกของ landing, clinic-demo, agency-demo (ภาพที่ `heroImages`) |
| `number-ticker.tsx` | Magic UI | ตัวเลข: agency หน้าแรก, clinic-demo แถบใต้ hero |
| `bento-grid.tsx` | Aceternity UI | บริการ: agency `/services`, clinic-demo |
| `focus-cards.tsx` | Aceternity UI | ผลงาน: agency `/projects`, landing `#showcase` (การ์ดเป็นลิงก์, มือถือแสดงชื่อตลอด) |
| `timeline.tsx` | Aceternity UI | agency `/about`, landing ขั้นตอนการทำงาน (`titleClassName` ปรับขนาดหัวข้อ) |
| `border-beam.tsx` | Magic UI | agency ฟอร์มติดต่อ, landing การ์ด Standard, clinic-demo การ์ดโปร (มีกล่องนอก overflow-hidden กันล้นจอ) |

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
