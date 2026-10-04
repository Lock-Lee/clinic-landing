# Landing Page รับทำเว็บคลินิกความงาม (Next.js)

## เริ่มใช้งาน
```bash
npm install
npm run dev
```
เปิด http://localhost:3000

## จุดที่ต้องแก้
ข้อมูลทั้งหมดอยู่ใน `app/content.ts`
- `site` ชื่อแบรนด์, LINE, เบอร์โทร, อีเมล
- `showcase` ผลงาน: ใส่ชื่อคลินิก ลิงก์ และวางภาพหน้าจอไว้ใน `public/showcase/` แล้วใส่ path ใน `image`
  (ถ้าไม่ใส่ `image` จะแสดงกรอบสีจำลองแทน)
- `packages`, `domainRows`, `maPlans` ราคาและรายละเอียด

สีและฟอนต์แก้ได้ที่ตัวแปรบนสุดของ `app/globals.css`

## Deploy
อัปขึ้น GitHub แล้ว import ที่ vercel.com หรือ `npm run build && npm start` บนเซิร์ฟเวอร์ของคุณ
