import Link from "next/link";
import type { NavLink } from "./header";

// บล็อกที่ใช้ซ้ำในเว็บเดโมหลายหน้า (server component ทั้งหมด)

export function DemoBar({ text = "เว็บไซต์ตัวอย่าง ชื่อ บุคคล รีวิว และราคาทั้งหมดเป็นข้อมูลสมมติ" }: { text?: string }) {
  return <div className="sk-demo-bar">{text}</div>;
}

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: NavLink[];
}) {
  return (
    <section className="sk-page-hero">
      <div className="sk-container">
        {crumbs && (
          <nav className="sk-crumbs" aria-label="breadcrumb">
            {crumbs.map((c) => (
              <span key={c.href}>
                <Link href={c.href}>{c.label}</Link> /{" "}
              </span>
            ))}
            <span aria-current="page">{title}</span>
          </nav>
        )}
        {eyebrow && <p className="sk-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="sk-lead">{lead}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="sk-section-head">
      {eyebrow && <p className="sk-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {lead && <p className="sk-muted">{lead}</p>}
    </div>
  );
}

// กล่องภาพจำลอง ใช้แทนรูปจริงในเดโม
export function Placeholder({ label, ratio = "4 / 3", tone }: { label: string; ratio?: string; tone?: string }) {
  return (
    <div className="sk-ph" style={{ aspectRatio: ratio, background: tone }} aria-hidden="true">
      <span>[{label}]</span>
    </div>
  );
}

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="sk-faq-list">
      {items.map((f) => (
        <details key={f.q} className="sk-faq">
          <summary>{f.q}</summary>
          <p className="sk-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function SiteFooter({
  brand,
  about,
  columns,
  note,
}: {
  brand: string;
  about: string;
  columns: { title: string; links: NavLink[] }[];
  note: string;
}) {
  return (
    <footer className="sk-footer">
      <div className="sk-container sk-footer-grid">
        <div>
          <p className="sk-footer-brand">{brand}</p>
          <p className="sk-muted">{about}</p>
        </div>
        {columns.map((c) => (
          <div key={c.title}>
            <p className="sk-footer-title">{c.title}</p>
            <ul>
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="sk-container sk-footer-note">{note}</div>
    </footer>
  );
}

export function LineFloat({ href, label = "ทัก LINE" }: { href: string; label?: string }) {
  return (
    <a href={href} className="sk-line-float" aria-label={label}>
      LINE
    </a>
  );
}
