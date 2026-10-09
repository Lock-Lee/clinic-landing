import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@repo/ui/site";
import { getContent } from "@repo/db";
import { SITE_ID, editableDefaults, groups } from "../../content";

export const metadata: Metadata = { title: "บริการ", description: "บริการศัลยกรรมและผิวพรรณทั้งหมดของคลินิก" };
// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";


export default async function ServicesPage() {
  const { services } = await getContent(SITE_ID, editableDefaults);
  return (
    <main>
      <PageHero eyebrow="Services" title="บริการทั้งหมด" lead="เลือกบริการเพื่ออ่านรายละเอียด ขั้นตอน และราคาเริ่มต้น" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      {groups.map((g, i) => (
        <section key={g.id} id={g.id} className={i % 2 ? "sk-band" : undefined}>
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
