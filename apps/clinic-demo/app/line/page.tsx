import type { Metadata } from "next";
import { LineChatMock } from "@repo/ui/line-chat";
import { clinic, lineOa } from "../content";

export const metadata: Metadata = { title: `LINE OA | ${clinic.name}` };

const features = [
  { title: "ข้อความต้อนรับ", detail: "ทักทายทันทีที่ลูกค้าเพิ่มเพื่อน พร้อมบอกว่ากดเมนูไหนทำอะไรได้" },
  { title: "Rich Menu 6 ช่อง", detail: "จองคิว โปรโมชัน บริการ รีวิว แผนที่ และคุยกับแอดมิน เปลี่ยนรูปตามโปรแต่ละเดือนได้" },
  { title: "ตอบอัตโนมัติ", detail: "ตอบคำถามที่ถามบ่อย เช่น ราคา เวลาเปิด ที่จอดรถ แอดมินไม่ต้องพิมพ์ซ้ำ" },
  { title: "แจ้งเตือนการจอง", detail: "ลูกค้าจองจากเว็บหรือใน LINE ทีมงานคลินิกได้แจ้งเตือนเข้า LINE ทันที" },
];

export default function LinePage() {
  return (
    <>
      <div className="demo-bar">เว็บไซต์ตัวอย่าง ชื่อคลินิก แพทย์ รีวิว และราคาทั้งหมดเป็นข้อมูลสมมติ</div>
      <header className="header">
        <div className="container header-inner">
          <a href="/" className="brand">
            {clinic.name}
            <small>{clinic.nameTh}</small>
          </a>
          <nav className="nav" aria-label="เมนูหลัก">
            <a href="/">กลับหน้าเว็บคลินิก</a>
          </nav>
        </div>
      </header>

      <main className="container section line-page">
        <div className="line-copy">
          <div className="section-head">
            <p className="eyebrow">ตัวอย่าง LINE OA</p>
            <h1>LINE ของคลินิก ที่จองคิวได้ในไม่กี่แตะ</h1>
            <p className="lead">ลองกดเมนูด้านล่างของแชทดูได้เลย บอทจะตอบเหมือนลูกค้าใช้งานจริง</p>
          </div>
          <div className="grid grid-2">
            {features.map((f) => (
              <div key={f.title} className="service">
                <h3>{f.title}</h3>
                <p className="muted">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <LineChatMock {...lineOa} />
      </main>
    </>
  );
}
