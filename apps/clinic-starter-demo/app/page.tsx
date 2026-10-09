import { getContent } from "@repo/db";
import { AdminFab } from "@repo/ui/admin";
import { SITE_ID, editableDefaults, reasons, reviews, faqs } from "./content";

// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";

export default async function Home() {
  const { clinic, hero, services } = await getContent(SITE_ID, editableDefaults);

  // Schema.org ของคลินิก + คำถามที่พบบ่อย (SEO พื้นฐาน)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        name: clinic.name,
        url: clinic.url,
        telephone: clinic.phone,
        address: { "@type": "PostalAddress", streetAddress: clinic.address, addressCountry: "TH" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="demo-bar">ตัวอย่างแพ็กเกจ Starter · ข้อมูลทั้งหมดเป็นข้อมูลสมมติ</div>

      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="brand">
            {clinic.name}
            <small>{clinic.nameTh}</small>
          </a>
          <a href={clinic.lineUrl} className="btn btn-primary">จองคิว</a>
        </div>
      </header>

      <main>
        <section id="top" className="container hero">
          <div className="hero-copy">
            <p className="eyebrow">{clinic.tagline}</p>
            <h1>{hero.title}</h1>
            <p className="lead">{hero.lead}</p>
            <div className="actions">
              <a href={clinic.lineUrl} className="btn btn-primary">ทัก LINE</a>
              <a href={clinic.phoneHref} className="btn btn-outline">โทร {clinic.phone}</a>
            </div>
          </div>
          {hero.image && <img src={hero.image} alt="" className="hero-image" />}
        </section>

        <section id="services" className="band">
          <div className="container section">
            <div className="section-head">
              <p className="eyebrow">บริการ</p>
              <h2>บริการและราคา</h2>
            </div>
            <div className="grid grid-4">
              {services.map((s, i) => (
                <article key={i} className="service">
                  <h3>{s.name}</h3>
                  <p className="muted small">{s.detail}</p>
                  <p className="service-price">{s.price} บาท</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container section">
          <div className="section-head">
            <p className="eyebrow">ทำไมต้อง {clinic.name}</p>
            <h2>ดูแลโดยแพทย์ ราคาชัดเจน</h2>
          </div>
          <div className="grid grid-3">
            {reasons.map((r) => (
              <div key={r.title} className="reason">
                <h3>{r.title}</h3>
                <p className="muted">{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="reviews" className="band">
          <div className="container section">
            <div className="section-head">
              <p className="eyebrow">รีวิว</p>
              <h2>เสียงจากลูกค้า</h2>
            </div>
            <div className="grid grid-3">
              {reviews.map((r) => (
                <figure key={r.name} className="review">
                  <blockquote>“{r.text}”</blockquote>
                  <figcaption>
                    <strong>{r.name}</strong> · <span className="muted">{r.service}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="container section">
          <div className="section-head">
            <p className="eyebrow">คำถามที่พบบ่อย</p>
            <h2>ก่อนมาคลินิก</h2>
          </div>
          <div className="faq-list">
            {faqs.map((f) => (
              <details key={f.q} className="faq">
                <summary>{f.q}</summary>
                <p className="muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="band">
          <div className="container section contact-grid">
            <div className="contact-info">
              <p className="eyebrow">ติดต่อ</p>
              <h2>{clinic.nameTh}</h2>
              <p>{clinic.address}</p>
              <p>{clinic.hours}</p>
              <div className="actions">
                <a href={clinic.lineUrl} className="btn btn-primary">ทัก LINE {clinic.lineId}</a>
                <a href={clinic.phoneHref} className="btn btn-outline">โทร</a>
                <a href={clinic.mapUrl} className="btn btn-outline">แผนที่</a>
              </div>
            </div>
            {/* เปลี่ยนเป็น iframe Google Maps ของคลินิก */}
            <div className="map" aria-hidden="true">[แผนที่ Google Maps]</div>
          </div>
        </section>
      </main>

      <footer className="container footer">
        <span>
          © {clinic.name} · {clinic.license}
        </span>
        <span>ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล</span>
      </footer>

      <AdminFab />
    </>
  );
}
