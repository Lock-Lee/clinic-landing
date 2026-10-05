import type { Metadata } from "next";
import { PageHero } from "@repo/ui/site";
import { clinic } from "../content";

export const metadata: Metadata = { title: "นโยบายคลินิก" };

// ตัวอย่างหัวข้อนโยบาย เวลาทำเว็บจริงต้องใช้ข้อความที่คลินิกและที่ปรึกษากฎหมายรับรองแล้ว
export default function PolicyPage() {
  return (
    <main>
      <PageHero eyebrow="Policy" title="นโยบายคลินิก" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-prose">
          <h2>การนัดหมายและการเลื่อนนัด</h2>
          <p>กรุณาแจ้งเลื่อนนัดล่วงหน้าอย่างน้อย 24 ชั่วโมงผ่าน LINE {clinic.lineId}</p>
          <h2>โปรโมชันและคอร์ส</h2>
          <ul>
            <li>โปรโมชันมีระยะเวลาและเงื่อนไขตามที่ระบุ</li>
            <li>คอร์สที่ซื้อแล้วใช้ได้ภายในระยะเวลาที่กำหนด</li>
          </ul>
          <h2>ความเป็นส่วนตัวของข้อมูล (PDPA)</h2>
          <p>คลินิกเก็บข้อมูลเท่าที่จำเป็นต่อการให้บริการและนัดหมาย และจะไม่เปิดเผยต่อบุคคลภายนอกโดยไม่ได้รับความยินยอม</p>
          <p className="sk-muted sk-small">ข้อความในหน้านี้เป็นตัวอย่างโครงหัวข้อเท่านั้น</p>
        </div>
      </div>
    </main>
  );
}
