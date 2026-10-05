import type { Metadata } from "next";
import { PageHero, Placeholder } from "@repo/ui/site";
import { clinic, branches } from "../content";

export const metadata: Metadata = { title: "ติดต่อเรา" };

export default function ContactPage() {
  return (
    <main>
      <PageHero eyebrow="Contact" title="ติดต่อเรา" lead="จองคิวผ่าน LINE หรือ Messenger แล้วเลือกสาขาที่สะดวก" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-actions">
          <a href={clinic.lineUrl} className="sk-btn sk-btn-primary">LINE {clinic.lineId}</a>
          <a href={clinic.messengerUrl} className="sk-btn sk-btn-outline">Messenger</a>
        </div>
        <div className="sk-grid sk-grid-2">
          {branches.map((b) => (
            <div key={b.name} className="sk-card">
              <Placeholder label={`แผนที่ ${b.name}`} ratio="16 / 9" />
              <h3>{b.name}</h3>
              <p className="sk-muted">{b.address}</p>
              <p>โทร {b.phone}</p>
              <p className="sk-small">{b.hours}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
