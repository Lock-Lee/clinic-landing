import type { Metadata } from "next";
import { PageHero, DemoForm, Placeholder } from "@repo/ui/site";
import { clinic, services } from "../content";

export const metadata: Metadata = { title: "ติดต่อเรา" };

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="จองปรึกษาแพทย์ฟรี" lead="กรอกข้อมูล ทีมงานจะติดต่อกลับเพื่อยืนยันวันและเวลา" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section contact-grid">
        <DemoForm
          fields={[
            { name: "name", label: "ชื่อ-นามสกุล", required: true },
            { name: "phone", label: "เบอร์โทร", type: "tel", required: true },
            { name: "service", label: "บริการที่สนใจ", type: "select", options: services.map((s) => s.name) },
            { name: "date", label: "วันที่สะดวก", type: "date" },
            { name: "note", label: "รายละเอียดเพิ่มเติม", type: "textarea" },
          ]}
          consent="ยินยอมให้คลินิกเก็บและใช้ข้อมูลเพื่อติดต่อนัดหมาย ตามนโยบายความเป็นส่วนตัว (PDPA)"
          submitLabel="ส่งคำขอนัดหมาย"
          doneText="ได้รับคำขอนัดหมายแล้ว ทีมงานจะติดต่อกลับภายในวันทำการ"
        />
        <aside className="contact-aside">
          <h2>{clinic.name}</h2>
          <p>{clinic.address}</p>
          <p>{clinic.hours}</p>
          <p>โทร {clinic.phone} · LINE {clinic.lineId}</p>
          <Placeholder label="แผนที่ Google Maps" ratio="4 / 3" />
        </aside>
      </div>
    </main>
  );
}
