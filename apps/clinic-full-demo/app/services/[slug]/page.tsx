import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Placeholder, FaqList, FaqJsonLd, SectionHead } from "@repo/ui/site";
import { clinic, groups, services } from "../../content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s ? `${s.name} (${s.en})` : "บริการ", description: s?.summary };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const group = groups.find((g) => g.id === s.group)!;
  const related = services.filter((x) => x.group === s.group && x.slug !== s.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: s.name,
    alternateName: s.en,
    description: s.summary,
    howPerformed: s.steps.join(" → "),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={s.en}
        title={s.name}
        lead={s.summary}
        crumbs={[
          { href: "/", label: "หน้าแรก" },
          { href: "/services", label: group.name },
        ]}
      />
      <div className="sk-container sk-section service-layout">
        <div className="sk-prose">
          <Placeholder label={`ภาพประกอบ ${s.name}`} ratio="16 / 9" />
          <h2>เหมาะกับใคร</h2>
          <ul>
            {s.suitable.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h2>ขั้นตอน</h2>
          <ol className="steps">
            {s.steps.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ol>
          <h2>หลังทำ</h2>
          <p>{s.recovery}</p>
          <SectionHead title="คำถามที่พบบ่อย" />
          <FaqList items={s.faqs} />
          <FaqJsonLd items={s.faqs} />
        </div>
        <aside className="booking-box">
          <p className="sk-muted sk-small">ราคาเริ่มต้น</p>
          <p className="price-big">{s.priceFrom} บาท</p>
          <p className="sk-small sk-muted">ราคาจริงขึ้นกับการประเมินของแพทย์</p>
          <Link href="/contact" className="sk-btn sk-btn-primary">จองปรึกษาฟรี</Link>
          <a href={clinic.lineUrl} className="sk-btn sk-btn-outline">ถามผ่าน LINE</a>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="sk-band">
          <div className="sk-container sk-section">
            <SectionHead title={`บริการอื่นใน${group.name}`} />
            <div className="sk-grid sk-grid-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/services/${r.slug}`} className="sk-card">
                  <h3>{r.name}</h3>
                  <p className="sk-muted sk-small">{r.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
