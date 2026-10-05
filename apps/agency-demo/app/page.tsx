import Link from "next/link";
import { SectionHead, Placeholder } from "@repo/ui/site";
import { AnimatedMarqueeHero } from "@/components/ui/hero-3";
import { NumberTicker } from "@/components/ui/number-ticker";
import { studio, clients, stats, services, projects, reviews, heroImages } from "./content";

export default function Home() {
  return (
    <main>
      <AnimatedMarqueeHero
        tagline={`${studio.tagline} · ${studio.city}`}
        title={
          <>
            ออกแบบแบรนด์และเว็บไซต์
            <br />
            <span className="text-primary">ให้คลินิกถูกจดจำ</span>
          </>
        }
        description={`${studio.about} ตั้งแต่ตัวตนแบรนด์ เว็บไซต์ ไปจนถึง LINE OA ที่ปิดการจองได้จริง`}
        ctaText="คุยโปรเจกต์"
        ctaHref="/contact"
        secondary={{ text: "ดูผลงาน", href: "/projects" }}
        images={heroImages}
      />

      <div className="marquee" aria-label="ลูกค้าของเรา">
        <div className="marquee-track">
          {[...clients, ...clients].map((c, i) => (
            <span key={i} aria-hidden={i >= clients.length}>{c}</span>
          ))}
        </div>
      </div>

      <section className="sk-container sk-section">
        <dl className="sk-grid sk-grid-4 stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dd>
                <NumberTicker value={s.value} decimalPlaces={s.decimals} />
                {s.suffix}
              </dd>
              <dt className="sk-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead eyebrow="บริการ" title="ทำครบในทีมเดียว" lead="แต่ละบริการเลือกแยกได้ หรือรวมเป็นแพ็กเกจตามเป้าหมายของคลินิก" />
          <div className="sk-grid sk-grid-4">
            {services.map((s, i) => (
              <Link key={s.slug} href={`/services#${s.slug}`} className="sk-card service">
                <span className="num">0{i + 1}</span>
                <h3>{s.name}</h3>
                <p className="sk-muted sk-small">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sk-container sk-section">
        <div className="sk-section-head-row">
          <SectionHead eyebrow="ผลงานเด่น" title="Featured Projects" />
          <Link href="/projects" className="sk-link">ดูผลงานทั้งหมด →</Link>
        </div>
        <div className="sk-grid sk-grid-3">
          {projects.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="sk-card project">
              <Placeholder label={`ภาพผลงาน ${p.client}`} tone={p.tone} />
              <span className="sk-tag">{p.industry}</span>
              <h3>{p.name}</h3>
              <p className="sk-muted sk-small">{p.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead eyebrow="รีวิว" title="ลูกค้าพูดถึงเรา" />
          <div className="sk-grid sk-grid-3">
            {reviews.map((r) => (
              <figure key={r.by} className="sk-card review">
                <blockquote>“{r.text}”</blockquote>
                <figcaption className="sk-muted sk-small">{r.by}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="sk-container sk-section cta">
        <h2>มีโปรเจกต์อยู่ในใจ?</h2>
        <p className="sk-lead">เล่าเป้าหมายของคลินิกให้เราฟัง เราจะส่งแนวทางและใบเสนอราคากลับภายใน 2 วันทำการ</p>
        <div className="sk-actions">
          <Link href="/contact" className="sk-btn sk-btn-primary">เริ่มคุยกัน</Link>
        </div>
      </section>
    </main>
  );
}
