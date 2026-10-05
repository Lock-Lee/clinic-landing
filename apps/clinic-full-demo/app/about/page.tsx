import type { Metadata } from "next";
import { PageHero, SectionHead, Placeholder } from "@repo/ui/site";
import { clinic, doctors } from "../content";

export const metadata: Metadata = { title: "เกี่ยวกับเรา" };

const values = [
  { title: "ประเมินก่อนเสมอ", detail: "ไม่ใช่ทุกการปรึกษาที่คำตอบของแพทย์จะเป็น “ต้องทำ”" },
  { title: "ปลอดภัยเป็นอันดับแรก", detail: "ผ่าตัดในโรงพยาบาล ผลิตภัณฑ์มี อย. ตรวจสอบได้" },
  { title: "เป็นธรรมชาติ", detail: "ออกแบบให้เข้ากับโครงหน้าเดิม ไม่ใช่หน้าตามเทรนด์" },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="About" title={`เกี่ยวกับ ${clinic.name}`} lead="สร้างสรรค์ความงามในอุดมคติ บนพื้นฐานของสุขภาพที่ดีและความเข้าใจในตัวตนของแต่ละคน" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <section className="sk-container sk-section sk-split">
        <div className="sk-prose">
          <h2>ที่มาของชื่อ</h2>
          <p><strong>Atelier</strong> คือห้องทำงานของศิลปิน พื้นที่ที่ผลงานแต่ละชิ้นถูกสร้างอย่างตั้งใจ</p>
          <p><strong>Belle</strong> แปลว่างดงาม เราจึงนิยามตัวเองว่าเป็นคลินิกที่สร้างความงามให้ลูกค้าแต่ละคนอย่างประณีต</p>
        </div>
        <Placeholder label="ภาพบรรยากาศคลินิก" ratio="4 / 3" />
      </section>
      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead title="สิ่งที่เรายึดถือ" />
          <div className="sk-grid sk-grid-3">
            {values.map((v) => (
              <div key={v.title} className="value">
                <h3>{v.title}</h3>
                <p className="sk-muted">{v.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sk-container sk-section">
        <SectionHead eyebrow="Doctors" title="ทีมแพทย์" />
        <div className="sk-grid sk-grid-3">
          {doctors.map((d) => (
            <div key={d.name} className="doctor">
              <Placeholder label="ภาพแพทย์" ratio="3 / 4" />
              <h3>{d.name}</h3>
              <p className="sk-muted">{d.role}</p>
              <p className="sk-small">ใบอนุญาตเลขที่ {d.license}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
