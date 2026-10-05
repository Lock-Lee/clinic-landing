import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@repo/ui/site";
import { groups, services } from "../content";

export const metadata: Metadata = { title: "บริการ", description: "บริการศัลยกรรมและผิวพรรณทั้งหมดของคลินิก" };

export default function ServicesPage() {
  return (
    <main>
      <PageHero eyebrow="Services" title="บริการทั้งหมด" lead="เลือกบริการเพื่ออ่านรายละเอียด ขั้นตอน และราคาเริ่มต้น" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      {groups.map((g, i) => (
        <section key={g.id} className={i % 2 ? "sk-band" : undefined}>
          <div className="sk-container sk-section">
            <SectionHead eyebrow={g.en} title={g.name} lead={g.detail} />
            <div className="sk-grid sk-grid-3">
              {services.filter((s) => s.group === g.id).map((s) => (
                <Link key={s.slug} href={`/services/${s.slug}`} className="sk-card">
                  <p className="sk-eyebrow">{s.en}</p>
                  <h3>{s.name}</h3>
                  <p className="sk-muted sk-small">{s.summary}</p>
                  <p className="price">เริ่มต้น {s.priceFrom} บาท</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
