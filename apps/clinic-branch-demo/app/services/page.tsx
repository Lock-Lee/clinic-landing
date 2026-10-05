import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Placeholder } from "@repo/ui/site";
import { services } from "../content";

export const metadata: Metadata = { title: "บริการของเรา" };

export default function ServicesPage() {
  return (
    <main>
      <PageHero eyebrow="Services" title="บริการของเรา" lead="ทุกบริการประเมินและทำโดยแพทย์ ราคาเริ่มต้นตามด้านล่าง" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-4">
          {services.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="sk-card">
              <Placeholder label={s.name} ratio="1 / 1" />
              <h3>{s.name}</h3>
              <p className="sk-muted sk-small">{s.summary}</p>
              <p className="price">เริ่มต้น {s.priceFrom} บาท</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
