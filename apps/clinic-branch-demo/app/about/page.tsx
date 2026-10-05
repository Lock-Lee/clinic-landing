import type { Metadata } from "next";
import { PageHero, SectionHead, Placeholder } from "@repo/ui/site";
import { clinic, reasons } from "../content";

export const metadata: Metadata = { title: "เกี่ยวกับเรา" };

export default function AboutPage() {
  return (
    <main>
      <PageHero eyebrow="About" title={`เกี่ยวกับ ${clinic.name}`} crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <section className="sk-container sk-section sk-split">
        <Placeholder label="ภาพผู้ก่อตั้ง" ratio="4 / 5" />
        <div className="sk-prose">
          <h2>ก่อตั้งโดย {clinic.founder}</h2>
          <p>
            {clinic.name} ดูแลทุกปัญหาความงามและผิวพรรณด้วยบริการครบวงจร เช่น โบท็อกซ์ ฟิลเลอร์ ยกกระชับ ดริปวิตามิน
            และโปรแกรมสลายไขมันเฉพาะจุด โดยแพทย์ผู้มีประสบการณ์ พร้อมผลิตภัณฑ์ที่ปลอดภัยและได้มาตรฐาน
          </p>
          <p>เรามุ่งมั่นมอบบริการที่ใส่ใจในทุกขั้นตอน ให้ผลลัพธ์ที่คุณประทับใจในราคาที่คุ้มค่า</p>
        </div>
      </section>
      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead title="สิ่งที่เราให้ความสำคัญ" />
          <div className="sk-grid sk-grid-3">
            {reasons.map((r) => (
              <div key={r.title} className="reason">
                <h3>{r.title}</h3>
                <p className="sk-muted">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
