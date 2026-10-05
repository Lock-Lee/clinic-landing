import Link from "next/link";
import { SectionHead, Placeholder, FaqList, FaqJsonLd } from "@repo/ui/site";
import { clinic, slides, services, promotions, reasons, reviews, branches, articles, faqs } from "./content";
import { CampaignSlider } from "./slider";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": branches.map((b) => ({
    "@type": "MedicalClinic",
    name: `${clinic.name} ${b.name}`,
    telephone: b.phone,
    address: { "@type": "PostalAddress", streetAddress: b.address, addressCountry: "TH" },
  })),
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CampaignSlider slides={slides} />

      <section className="sk-container sk-section">
        <div className="sk-section-head-row">
          <SectionHead eyebrow="Programs" title="โปรแกรมยอดนิยม" />
          <Link href="/services" className="sk-link">ดูบริการทั้งหมด →</Link>
        </div>
        <div className="sk-grid sk-grid-4">
          {services.filter((s) => s.featured).map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="sk-card">
              <Placeholder label={s.name} ratio="1 / 1" />
              <h3>{s.name}</h3>
              <p className="sk-muted sk-small">{s.summary}</p>
              <span className="sk-link">ดูเพิ่มเติม ›</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <div className="sk-section-head-row">
            <SectionHead eyebrow="Promotions" title="โปรโมชันพิเศษ" />
            <Link href="/promotions" className="sk-link">ดูโปรทั้งหมด →</Link>
          </div>
          <div className="sk-grid sk-grid-4">
            {promotions.map((p) => (
              <article key={p.name} className="sk-card promo">
                <h3>{p.name}</h3>
                <p className="promo-price"><s>{p.before}</s> <strong>{p.now}</strong> บาท</p>
                <p className="sk-muted sk-small">{p.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sk-container sk-section">
        <div className="sk-section-head-row">
          <SectionHead eyebrow="Reviews" title="เสียงจากผู้ใช้บริการ" />
          <Link href="/reviews" className="sk-link">อ่านรีวิวทั้งหมด →</Link>
        </div>
        <div className="sk-grid sk-grid-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.name} className="sk-card review">
              <span className="stars" aria-label="5 ดาว">★★★★★</span>
              <blockquote>“{r.text}”</blockquote>
              <figcaption className="sk-muted sk-small">{r.name} · {r.service} · {r.branch}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead eyebrow="Why us" title={`ทำไมต้อง ${clinic.name}?`} />
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

      <section className="sk-container sk-section sk-split">
        <Placeholder label="ภาพผู้ก่อตั้งคลินิก" ratio="4 / 3" />
        <div className="sk-section-head">
          <p className="sk-eyebrow">About</p>
          <h2>เกี่ยวกับเรา</h2>
          <p className="sk-muted">
            {clinic.name} ก่อตั้งโดย {clinic.founder} ดูแลทุกปัญหาผิวและรูปหน้าด้วยแพทย์ผู้มีประสบการณ์ ในบรรยากาศมินิมอลที่อบอุ่น
          </p>
          <Link href="/about" className="sk-link">อ่านต่อ →</Link>
        </div>
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead eyebrow="Branches" title="ติดต่อเรา 2 สาขา" />
          <div className="sk-grid sk-grid-2">
            {branches.map((b) => (
              <div key={b.name} className="sk-card">
                <h3>{b.name}</h3>
                <p className="sk-muted">{b.address}</p>
                <p>โทร {b.phone}</p>
                <p className="sk-small">{b.hours}</p>
              </div>
            ))}
          </div>
          <div className="sk-actions">
            <a href={clinic.lineUrl} className="sk-btn sk-btn-primary">จองคิวผ่าน LINE</a>
            <a href={clinic.messengerUrl} className="sk-btn sk-btn-outline">Messenger</a>
          </div>
        </div>
      </section>

      <section className="sk-container sk-section">
        <SectionHead eyebrow="Articles" title="บทความ" />
        <div className="sk-grid sk-grid-3">
          {articles.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="sk-card">
              <h3>{a.title}</h3>
              <p className="sk-muted sk-small">{a.excerpt}</p>
            </Link>
          ))}
        </div>
        <SectionHead title="คำถามที่พบบ่อย" />
        <FaqList items={faqs} />
        <FaqJsonLd items={faqs} />
      </section>
    </main>
  );
}
