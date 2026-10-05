import type { Metadata } from "next";
import { PageHero, SectionHead, DemoForm } from "@repo/ui/site";
import { tiers, branches } from "../content";

export const metadata: Metadata = { title: "Glow Member" };

export default function MemberPage() {
  return (
    <main>
      <PageHero eyebrow="Membership" title="Glow Member" lead="สมัครฟรี สะสมแต้มทุกการใช้บริการ แลกเป็นส่วนลดได้ทั้ง 2 สาขา" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <section className="sk-container sk-section">
        <SectionHead title="ระดับสมาชิก" />
        <div className="sk-grid sk-grid-3">
          {tiers.map((t, i) => (
            <div key={t.name} className={`sk-card tier tier-${i}`}>
              <h3>{t.name}</h3>
              <p className="sk-small sk-muted">{t.condition}</p>
              <ul>
                {t.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead title="สมัครสมาชิก" lead="กรอกข้อมูลแล้วยืนยันตัวตนที่เคาน์เตอร์ในการมาครั้งถัดไป" />
          <DemoForm
            fields={[
              { name: "name", label: "ชื่อ-นามสกุล", required: true },
              { name: "phone", label: "เบอร์โทร", type: "tel", required: true },
              { name: "birthday", label: "วันเกิด", type: "date" },
              { name: "branch", label: "สาขาหลัก", type: "select", options: branches.map((b) => b.name) },
            ]}
            consent="ยินยอมให้คลินิกเก็บข้อมูลเพื่อบริการสมาชิกและส่งสิทธิพิเศษ ตามนโยบายความเป็นส่วนตัว (PDPA)"
            submitLabel="สมัครสมาชิก"
            doneText="สมัครสมาชิกเรียบร้อย"
          />
        </div>
      </section>
    </main>
  );
}
