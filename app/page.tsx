import Image from "next/image";
import type { CSSProperties } from "react";
import { site, showcase, packages, domainRows, maPlans, steps } from "./content";

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <a href="#top" className="brand">{site.brand}</a>
          <nav className="nav" aria-label="เมนูหลัก">
            <a href="#showcase">ผลงาน</a>
            <a href="#packages">แพ็กเกจ</a>
            <a href="#addons">โดเมนและ MA</a>
            <a href="#process">ขั้นตอน</a>
            <a href="#contact" className="btn btn-primary">ขอใบเสนอราคา</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="top" className="container hero">
          <div className="hero-copy">
            <p className="eyebrow">เว็บไซต์สำหรับคลินิกเสริมความงามโดยเฉพาะ</p>
            <h1>Landing Page ที่เปลี่ยนคนเข้าเว็บ ให้เป็นคิวนัดในคลินิก</h1>
            <p className="lead">
              ออกแบบให้ดูน่าเชื่อถือ โหลดเร็วบนมือถือ และพาลูกค้าไปที่ปุ่ม LINE
              หรือฟอร์มจองคิวได้ในไม่กี่วินาที เริ่มต้น 9,900 บาท
            </p>
            <div className="actions">
              <a href="#packages" className="btn btn-primary">ดูแพ็กเกจและราคา</a>
              <a href="#showcase" className="btn btn-outline">ดูผลงาน</a>
            </div>
          </div>
          {/* เปลี่ยนเป็น <Image> ภาพหน้าจอผลงานเด่นของคุณ */}
          <div className="hero-visual" aria-hidden="true">
            <div className="mock" style={{ "--tint": "#EAD9E0", "--tone": "#7A2E55" } as CSSProperties}>
              <span className="bar w30" />
              <span className="block w85" />
              <span className="block w60" />
              <span className="pill" />
            </div>
            <p>[ใส่ภาพหน้าจอผลงานเด่นของคุณตรงนี้]</p>
          </div>
        </section>

        <section id="showcase" className="band">
          <div className="container section">
            <div className="section-head">
              <h2>ผลงานที่ผ่านมา</h2>
              <p>ตัวอย่างเว็บคลินิกที่เราออกแบบ แต่ละงานปรับโทนสีและลำดับเนื้อหาตามกลุ่มลูกค้าของคลินิกนั้น</p>
            </div>
            <div className="grid grid-3">
              {showcase.map((item) => (
                <article key={item.name} className="work">
                  {item.image ? (
                    <div className="work-thumb">
                      <Image src={item.image} alt={`หน้าเว็บ ${item.name}`} fill sizes="(max-width: 700px) 100vw, 380px" />
                    </div>
                  ) : (
                    <div
                      className="mock work-thumb"
                      aria-hidden="true"
                      style={{ "--tint": item.tint, "--tone": item.tone } as CSSProperties}
                    >
                      <span className="bar w30" />
                      <span className="block w85" />
                      <span className="block w60" />
                      <span className="pill" />
                    </div>
                  )}
                  <h3>{item.name}</h3>
                  <p className="muted small">{item.category}</p>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-link">
                    ดูเว็บจริง
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="container section">
          <div className="section-head">
            <h2>แพ็กเกจและราคา</h2>
            <p>ราคาค่าออกแบบและพัฒนาเว็บ จ่ายครั้งเดียว ไม่รวมโดเมน โฮสติ้ง และค่าดูแลรายเดือน</p>
          </div>
          <div className="grid grid-3">
            {packages.map((pkg) => (
              <div key={pkg.name} className={pkg.featured ? "card card-featured" : "card"}>
                <div>
                  <div className="card-title">
                    <h3>{pkg.name}</h3>
                    {pkg.featured && <span className="badge">ยอดนิยม</span>}
                  </div>
                  <p className="card-for small">{pkg.forWho}</p>
                </div>
                <p className="price">
                  {pkg.price} <span>บาท</span>
                </p>
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
          <p className="muted small">
            มัดจำ 50% ก่อนเริ่มงาน ส่วนที่เหลือชำระก่อนขึ้นเว็บจริง งานเพิ่มนอกแพ็กเกจ: section ละ 1,500 บาท หน้าละ 3,000 บาท
          </p>
        </section>

        <section id="addons" className="band">
          <div className="container section grid grid-2">
            <div className="addon">
              <h2>โดเมนและโฮสติ้ง</h2>
              <p className="muted">คิดแยกรายปี จดโดเมนในชื่อคลินิกของคุณเอง ย้ายออกได้ทุกเมื่อ</p>
              <dl className="rows">
                {domainRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
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
          <ol className="grid grid-4 steps">
            {steps.map((step) => (
              <li key={step.title}>
                <strong>{step.title}</strong>
                <span className="muted">{step.detail}</span>
              </li>
            ))}
          </ol>
          <p className="muted small note">
            เนื้อหาโฆษณาและภาพรีวิวต้องเป็นไปตามเกณฑ์ของกรมสนับสนุนบริการสุขภาพ (สบส.)
            คลินิกเป็นผู้รับผิดชอบการขออนุมัติโฆษณา
          </p>
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

      <footer className="container footer">
        <span>{site.brand}</span>
        <span>
          {site.email} · {site.facebook}
        </span>
      </footer>
    </>
  );
}
