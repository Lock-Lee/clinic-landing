import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@repo/ui/site";
import { promotions } from "../content";

export const metadata: Metadata = { title: "โปรโมชัน" };

export default function PromotionsPage() {
  return (
    <main>
      <PageHero eyebrow="Promotions" title="โปรโมชัน" lead="ทุกโปรต้องผ่านการประเมินจากแพทย์ก่อน และเป็นไปตามเงื่อนไขที่คลินิกกำหนด" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-2">
          {promotions.map((p) => (
            <article key={p.title} className="sk-card promo">
              <span className="sk-tag">ถึง {p.until}</span>
              <h3>{p.title}</h3>
              <p className="sk-muted">{p.detail}</p>
              <p className="price-big">{p.price}</p>
              <Link href="/contact" className="sk-btn sk-btn-primary">จองโปรนี้</Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
