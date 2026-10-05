import { Motion } from "@repo/ui/motion";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { clinic, stats, heroImages, services, promotions, reasons, doctors, reviews, faqs } from "./content";

// บริการ 6 รายการ: กว้าง 2-1 / 1-2 / 2-1 บนจอใหญ่
const BENTO_SPAN = ["md:col-span-2", "", "", "md:col-span-2", "md:col-span-2", ""];

const REVEAL_SELECTOR = [".section-head", ".grid > *", ".faq-list > *", ".contact-grid > *"].join(",");

// Schema.org ของคลินิก + คำถามที่พบบ่อย (SEO / AEO)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalClinic",
      "@id": `${clinic.url}/#clinic`,
      name: clinic.name,
      url: clinic.url,
      telephone: clinic.phone,
      address: { "@type": "PostalAddress", streetAddress: clinic.address, addressCountry: "TH" },
      openingHours: "Mo-Su 11:00-20:00",
      availableService: services.map((s) => ({ "@type": "MedicalProcedure", name: s.name, description: s.detail })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Motion selector={REVEAL_SELECTOR} />

      <div className="demo-bar">เว็บไซต์ตัวอย่าง ชื่อคลินิก แพทย์ รีวิว และราคาทั้งหมดเป็นข้อมูลสมมติ</div>

      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="brand">
            {clinic.name}
            <small>{clinic.nameTh}</small>
          </a>
          <nav className="nav" aria-label="เมนูหลัก">
            <a href="#services">บริการ</a>
            <a href="#promotions">โปรโมชัน</a>
            <a href="#doctors">แพทย์</a>
            <a href="#reviews">รีวิว</a>
            <a href="#contact">ติดต่อ</a>
            <a href="/line">LINE OA</a>
            <a href={clinic.lineUrl} className="btn btn-primary">จองคิว</a>
          </nav>
        </div>
      </header>

      <main>
        <div id="top">
          <AnimatedMarqueeHero
            tagline={clinic.tagline}
            title={
              <>
                ผิวสวยแบบเป็นธรรมชาติ
                <br />
                <span className="text-primary">ในแบบที่เป็นคุณ</span>
              </>
            }
            description="ปรึกษาแพทย์ฟรี วางแผนการดูแลให้เหมาะกับผิวและงบของคุณ ทุกหัตถการทำโดยแพทย์ที่มีใบอนุญาต"
            ctaText="จองคิวผ่าน LINE"
            ctaHref={clinic.lineUrl}
            secondary={{ text: "ดูโปรโมชันเดือนนี้", href: "#promotions" }}
            images={heroImages}
          />
        </div>

        <section className="band stats-band" aria-label="ตัวเลขของคลินิก">
          <dl className="container stats">
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>
                  <NumberTicker value={s.value} decimalPlaces={s.decimals} />
                  {s.suffix}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="services" className="container section">
          <div className="section-head">
            <p className="eyebrow">บริการของเรา</p>
            <h2>ดูแลครบทั้งผิวและรูปหน้า</h2>
          </div>
          <BentoGrid>
            {services.map((s, i) => (
              <BentoGridItem
                key={s.name}
                className={BENTO_SPAN[i % BENTO_SPAN.length]}
                header={
                  <div className="relative min-h-32 flex-1 overflow-hidden rounded-lg">
                    <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                  </div>
                }
                title={<span className="text-lg">{s.name}</span>}
                description={
                  <>
                    <p>{s.detail}</p>
                    <p className="mt-1 font-semibold text-primary">{s.price} บาท</p>
                  </>
                }
              />
            ))}
          </BentoGrid>
        </section>

        <section id="promotions" className="container section">
          <div className="section-head">
            <p className="eyebrow">โปรโมชันเดือนนี้</p>
            <h2>ราคาพิเศษ จำนวนจำกัด</h2>
          </div>
          <div className="grid grid-3">
            {promotions.map((p) => (
              <article key={p.name} className="promo relative">
                <BorderBeam size={90} duration={9} delay={promotions.indexOf(p) * 3} />
                <h3>{p.name}</h3>
                <p className="promo-price">
                  <s>{p.before}</s> <strong>{p.now}</strong> บาท
                </p>
                <p className="muted small">{p.note}</p>
                <a href={clinic.lineUrl} className="btn btn-outline">จองโปรนี้</a>
              </article>
            ))}
          </div>
        </section>

        <section className="dark">
          <div className="container section">
            <div className="section-head">
              <p className="eyebrow">ทำไมต้อง {clinic.name}</p>
              <h2>ความงามที่เริ่มจากความปลอดภัย</h2>
            </div>
            <div className="grid grid-4">
              {reasons.map((r) => (
                <div key={r.title} className="reason">
                  <h3>{r.title}</h3>
                  <p>{r.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="doctors" className="container section">
          <div className="section-head">
            <p className="eyebrow">ทีมแพทย์</p>
            <h2>แพทย์ประจำคลินิก</h2>
          </div>
          <div className="grid grid-2">
            {doctors.map((d) => (
              <article key={d.name} className="doctor">
                <div className="doctor-photo" aria-hidden="true">[ภาพแพทย์]</div>
                <div>
                  <h3>{d.name}</h3>
                  <p className="muted">{d.role}</p>
                  <p className="small">ใบอนุญาตเลขที่ {d.license}</p>
                  <p className="small">เชี่ยวชาญ: {d.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="reviews" className="band">
          <div className="container section">
            <div className="section-head">
              <p className="eyebrow">เสียงจากลูกค้า</p>
              <h2>รีวิวจากผู้ใช้บริการจริง</h2>
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
              <p className="eyebrow">ติดต่อและเดินทาง</p>
              <h2>{clinic.nameTh}</h2>
              <p>{clinic.address}</p>
              <p>{clinic.hours}</p>
              <p>
                โทร <a href={clinic.phoneHref}>{clinic.phone}</a> · LINE {clinic.lineId}
              </p>
              <div className="actions">
                <a href={clinic.lineUrl} className="btn btn-primary">จองคิวผ่าน LINE</a>
                <a href={clinic.mapUrl} className="btn btn-outline">เปิด Google Maps</a>
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

      <a href={clinic.lineUrl} className="line-float" aria-label="จองคิวผ่าน LINE">
        LINE
      </a>
    </>
  );
}
