import { ChromeBlob } from "@/components/fx/chrome-blob";
import { Cursor } from "@/components/fx/cursor";
import { Projects } from "@/components/fx/projects";
import { RiseIn } from "@/components/fx/rise-in";
import { ScrollText } from "@/components/fx/scroll-text";
import { SplitWords, splitWords } from "@/components/fx/split-words";
import { VelocityMarquee } from "@/components/fx/velocity-marquee";
import { BorderBeam } from "@/components/ui/border-beam";
import { Timeline } from "@/components/ui/timeline";
import { LineChatMock } from "@repo/ui/line-chat";
import { site, hero, statement, marqueeWords, showcase, heroImages, packages, domainRows, maPlans, steps, faqs, lineTiers, lineAddon, lineDemo } from "./content";
import Motion from "./motion";

// Schema.org ให้ Google และ AI เข้าใจว่าเว็บนี้ขายบริการอะไร ราคาเท่าไร และตอบคำถามอะไรได้
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfessionalService",
      "@id": `${site.url}/#business`,
      name: site.brand,
      url: site.url,
      email: site.email,
      telephone: site.phone,
      areaServed: "TH",
      description: "รับออกแบบเว็บไซต์และ Landing Page สำหรับคลินิกเสริมความงาม",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "แพ็กเกจทำเว็บคลินิกความงาม",
        itemListElement: packages.map((pkg) => ({
          "@type": "Offer",
          name: `แพ็กเกจ ${pkg.name}`,
          description: pkg.features.join(", "),
          price: pkg.price.replace(/,/g, ""),
          priceCurrency: "THB",
        })),
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Motion />
      <Cursor />
      {/* หน้าจอโหลดสั้นๆ แบบ fahrunstudio.com เป็น CSS ล้วน ไม่บังการคลิก */}
      <div className="fx-preloader" aria-hidden="true">
        <span className="fx-preloader-brand">{site.brand}</span>
        <span className="fx-preloader-count" />
        <span className="fx-preloader-bar" />
      </div>
      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="brand">{site.brand}</a>
          <nav className="nav" aria-label="เมนูหลัก">
            <a href="#showcase">ผลงาน</a>
            <a href="#packages">แพ็กเกจ</a>
            <a href="#line">LINE OA</a>
            <a href="#addons">โดเมนและ MA</a>
            <a href="#process">ขั้นตอน</a>
            <a href="#faq">คำถาม</a>
            <a href="#contact" className="btn btn-primary">ขอใบเสนอราคา</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="top" className="fx-hero">
          <ChromeBlob className="fx-hero-canvas" />
          <div className="container fx-hero-inner">
            <div className="fx-hero-intro">
              <p>{hero.intro}</p>
              <p className="fx-hero-sign">
                <em>{hero.eyebrow}</em>
                <span>{hero.startPrice}</span>
              </p>
            </div>
            <div className="fx-hero-main">
              <p className="fx-hero-eyebrow">Crafted for beauty clinics</p>
              <h1 className="fx-hero-title">
                <SplitWords text={hero.titleLines[0]} />
                <br />
                <span className="fx-hero-gradient">
                  <SplitWords text={hero.titleLines[1]} start={splitWords(hero.titleLines[0]).length} />
                </span>
              </h1>
              <div className="fx-hero-actions">
                <a href="#packages" className="fx-pill fx-pill-light">
                  ดูแพ็กเกจและราคา <span aria-hidden="true">↗</span>
                </a>
                <a href="#showcase" className="fx-pill">
                  ดูผลงาน
                </a>
              </div>
            </div>
            <a href="#about" className="fx-hero-scroll">
              เลื่อนลง
            </a>
          </div>
        </section>

        <div className="fx-dark">
          <VelocityMarquee words={marqueeWords} images={heroImages} />

          <section id="about" className="container fx-statement">
            <span className="fx-label">เกี่ยวกับเรา</span>
            <ScrollText text={statement} />
          </section>

          <section id="showcase" className="container section">
            <div className="section-head">
              <span className="fx-label">Selected Works</span>
              <h2>
                ผลงานที่ผ่านมา <em className="fx-serif">Featured</em>
              </h2>
              <p>ตัวอย่างเว็บคลินิกที่เราออกแบบ แต่ละงานปรับโทนสีและลำดับเนื้อหาตามกลุ่มลูกค้าของคลินิกนั้น</p>
            </div>
            <Projects projects={showcase} />
          </section>
        </div>

        <section id="packages" className="container section">
          <div className="section-head">
            <h2>แพ็กเกจและราคา</h2>
            <p>Starter และ Standard เป็น Landing Page หน้าเดียว Premium เป็นเว็บไซต์หลายหน้า ราคาค่าออกแบบและพัฒนาจ่ายครั้งเดียว ไม่รวมโดเมน โฮสติ้ง และค่าดูแลรายเดือน</p>
          </div>
          <div className="grid grid-3">
            {packages.map((pkg) => (
              <div key={pkg.name} className={pkg.featured ? "card card-featured relative" : "card"}>
                {pkg.featured && <BorderBeam size={120} duration={10} colorFrom="var(--accent-soft)" colorTo="var(--accent)" borderWidth={2} />}
                <div>
                  <div className="card-title">
                    <h3>{pkg.name}</h3>
                    {pkg.featured && <span className="badge">ยอดนิยม</span>}
                  </div>
                  <p className="card-type">{pkg.type}</p>
                  <p className="card-for small">{pkg.forWho}</p>
                </div>
                <p className="price">
                  {pkg.price} <span>บาท</span>
                </p>
                <p className="card-summary">{pkg.summary}</p>
                <a href={pkg.demoUrl} target="_blank" rel="noopener" className="card-demo">
                  ดูเว็บตัวอย่าง {pkg.name} ↗
                </a>
                <a href={`${pkg.demoUrl}/admin`} target="_blank" rel="noopener" className="card-demo">
                  {pkg.name === "Starter" ? "ลองหลังบ้าน (ส่วนเสริม)" : "ลองแก้เว็บเองจากหลังบ้าน"} ↗
                </a>
                <ul>
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <a href="#contact" className={pkg.featured ? "btn btn-light" : "btn btn-outline"}>
                  เลือก {pkg.name}
                </a>
              </div>
            ))}
          </div>
          <ul className="terms muted small">
            <li>มัดจำ 50% ก่อนเริ่มงาน ส่วนที่เหลือชำระก่อนขึ้นเว็บจริง</li>
            <li>แก้ไขงานเกินจำนวนรอบในแพ็กเกจ คิดเป็นงาน CR (Change Request) คิดราคาตามเนื้องานจริง แจ้งราคาให้ยืนยันก่อนเริ่มทุกครั้ง</li>
            <li>งานเพิ่มนอกแพ็กเกจ: section ละ 1,500 บาท หน้าละ 3,000 บาท ระบบหลังบ้านสำหรับ Starter 3,900 บาท</li>
          </ul>
        </section>

        <section id="line" className="container section line-section">
          <div className="line-copy">
            <div className="section-head">
              <h2>เชื่อมเว็บกับ LINE OA ของคลินิก</h2>
              <p>ลูกค้าคลินิกส่วนใหญ่จองคิวผ่าน LINE เราตั้งค่า LINE OA และ Rich Menu ให้เข้ากับเว็บ ลองกดเมนูในโทรศัพท์ด้านข้างดูได้เลย</p>
            </div>
            <dl className="rows">
              {lineTiers.map((t) => (
                <div key={t.name}>
                  <dt>
                    <strong>{t.name}</strong>
                    <span className="muted small">{t.detail}</span>
                  </dt>
                </div>
              ))}
              <div>
                <dt>
                  <strong>บริการเสริม</strong>
                  <span className="muted small">{lineAddon.label}</span>
                </dt>
                <dd>{lineAddon.price}</dd>
              </div>
            </dl>
            <p className="muted small">
              บัญชี LINE OA เป็นชื่อคลินิก เราเป็นแอดมินร่วม ค่าส่งข้อความเกินโควตาฟรีคลินิกจ่ายกับ LINE โดยตรง
            </p>
          </div>
          <LineChatMock {...lineDemo} />
        </section>

        <section id="addons" className="band">
          <div className="container section grid grid-2">
            <div className="addon">
              <h2>โดเมนและโฮสติ้ง</h2>
              <p className="muted">คิดตามราคาจริงของผู้ให้บริการ จดในชื่อคลินิกของคุณเอง ย้ายออกได้ทุกเมื่อ</p>
              <dl className="rows">
                {domainRows.map((row) => (
                  <div key={row.label}>
                    <dt>
                      <strong>{row.label}</strong>
                      <span className="muted small">{row.detail}</span>
                    </dt>
                    <dd>{row.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="addon">
              <h2>ดูแลเว็บรายเดือน (MA)</h2>
              <p className="muted">เริ่มนับหลังหมดช่วงดูแลฟรี จ่ายรายปีลด 2 เดือน</p>
              <dl className="rows">
                {maPlans.map((plan) => (
                  <div key={plan.name}>
                    <dt>
                      <strong>{plan.name}</strong>
                      <span className="muted small">{plan.detail}</span>
                    </dt>
                    <dd>{plan.price}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="process" className="container section">
          <h2>ขั้นตอนการทำงาน</h2>
          <Timeline
            titleClassName="md:text-2xl"
            data={steps.map((step) => ({
              title: step.title,
              content: <p className="text-lg text-muted-foreground">{step.detail}</p>,
            }))}
          />
          <p className="muted small note">
            เนื้อหาโฆษณาและภาพรีวิวต้องเป็นไปตามเกณฑ์ของกรมสนับสนุนบริการสุขภาพ (สบส.)
            คลินิกเป็นผู้รับผิดชอบการขออนุมัติโฆษณา
          </p>
        </section>

        <section id="faq" className="band">
          <div className="container section">
            <div className="section-head">
              <h2>คำถามที่พบบ่อย</h2>
              <p>รวมคำถามที่คลินิกถามบ่อยก่อนเริ่มทำเว็บ</p>
            </div>
            <div className="faq-list">
              {faqs.map((f) => (
                <details key={f.q} className="faq">
                  <summary>{f.q}</summary>
                  <p className="muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container contact-inner">
            <div>
              <h2>ปรึกษาฟรี รับใบเสนอราคาใน 1 วัน</h2>
              <p>บอกชื่อคลินิกและแพ็กเกจที่สนใจ เราจะส่งรายละเอียดกลับทาง LINE</p>
            </div>
            <div className="contact-actions">
              <a href={site.lineUrl} className="btn btn-light">LINE: {site.lineId}</a>
              <a href={site.phoneHref} className="btn btn-outline-light">โทร {site.phone}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="fx-footer">
        <div className="container">
          <div className="footer">
            <span>{site.brand}</span>
            <span>
              {site.email} · {site.facebook}
            </span>
          </div>
          <RiseIn className="fx-footer-mark">
            <span aria-hidden="true">{site.brand}</span>
          </RiseIn>
        </div>
      </footer>

      <a href={site.lineUrl} className="line-float" aria-label={`ทัก LINE ${site.lineId}`}>
        LINE
      </a>
    </>
  );
}
