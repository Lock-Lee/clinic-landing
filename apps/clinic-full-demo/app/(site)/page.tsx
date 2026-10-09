import Link from "next/link";
import { getContent } from "@repo/db";
import { SectionHead, Placeholder, FaqList, FaqJsonLd } from "@repo/ui/site";
import { SITE_ID, editableDefaults, groups, homeFaqs } from "../content";

// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";

export default async function Home() {
  const { clinic, hero, services, articles } = await getContent(SITE_ID, editableDefaults);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: clinic.name,
    url: clinic.url,
    telephone: clinic.phone,
    address: { "@type": "PostalAddress", streetAddress: clinic.address, addressCountry: "TH" },
    availableService: services.map((s) => ({ "@type": "MedicalProcedure", name: s.name, alternateName: s.en })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hero">
        <div className="sk-container hero-inner">
          <div className="sk-rise hero-copy">
            <p className="sk-eyebrow">{clinic.tagline}</p>
            <h1>{hero.title}</h1>
            <p className="sk-lead">{hero.lead}</p>
            <div className="sk-actions">
              <Link href="/contact" className="sk-btn sk-btn-primary">จองปรึกษาฟรี</Link>
              <Link href="/services" className="sk-btn sk-btn-outline">ดูบริการทั้งหมด</Link>
            </div>
          </div>
          {hero.image ? (
            <img src={hero.image} alt="" className="hero-image" />
          ) : (
            <Placeholder label="ภาพแพทย์หรือแบรนด์แอมบาสเดอร์" ratio="4 / 5" />
          )}
        </div>
      </section>

      <section className="sk-container sk-section">
        <SectionHead eyebrow="Our Philosophy" title="Atelier ห้องทำงานของศิลปิน" lead="ชื่อคลินิกมาจากแนวคิดว่าความงามแต่ละคนต้องถูกออกแบบอย่างประณีต ไม่ใช่สูตรเดียวใช้กับทุกคน" />
        <div className="sk-grid sk-grid-2">
          {groups.map((g) => (
            <div key={g.id} className="sk-card group-card">
              <p className="sk-eyebrow">{g.en}</p>
              <h3>{g.name}</h3>
              <p className="sk-muted">{g.detail}</p>
              <ul className="group-links">
                {services.filter((s) => s.group === g.id).map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>{s.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="note sk-muted">
          หัตถการทั่วไปให้บริการที่คลินิก ส่วนการผ่าตัดดำเนินการในโรงพยาบาลตามมาตรฐาน
        </p>
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <div className="sk-section-head-row">
            <SectionHead eyebrow="Articles" title="บทความล่าสุด" />
            <Link href="/articles" className="sk-link">อ่านทั้งหมด →</Link>
          </div>
          <div className="sk-grid sk-grid-3">
            {articles.slice(0, 3).map((a) => (
              <Link key={a.slug} href={`/articles/${a.slug}`} className="sk-card">
                {a.image ? <img src={a.image} alt="" className="cover" style={{ aspectRatio: "16 / 10" }} /> : <Placeholder label="ภาพบทความ" ratio="16 / 10" />}
                <span className="sk-tag">{a.category}</span>
                <h3>{a.title}</h3>
                <p className="sk-muted sk-small">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sk-container sk-section">
        <SectionHead eyebrow="FAQ" title="คำถามที่พบบ่อย" />
        <FaqList items={homeFaqs} />
        <FaqJsonLd items={homeFaqs} />
      </section>
    </main>
  );
}
