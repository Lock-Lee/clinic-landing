import type { Metadata } from "next";
import { PageHero } from "@repo/ui/site";
import { clinic, promotions } from "../content";

export const metadata: Metadata = { title: "โปรโมชัน" };

export default function PromotionsPage() {
  return (
    <main>
      <PageHero eyebrow="Promotions" title="โปรโมชันพิเศษ" lead="ใช้ได้ทั้ง 2 สาขา ยกเว้นที่ระบุ ราคานี้รวมค่าแพทย์แล้ว" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-2">
          {promotions.map((p) => (
            <article key={p.name} className="sk-card promo">
              <h3>{p.name}</h3>
              <p className="promo-price"><s>{p.before}</s> <strong>{p.now}</strong> บาท</p>
              <p className="sk-muted">{p.note}</p>
              <a href={clinic.lineUrl} className="sk-btn sk-btn-primary">จองโปรนี้</a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
