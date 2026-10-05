import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Placeholder } from "@repo/ui/site";
import { clinic, services, promotions } from "../../content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  return { title: s?.name ?? "บริการ", description: s?.summary };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  const promo = promotions.find((p) => p.name.includes(s.name.split(" ")[0]));

  return (
    <main>
      <PageHero
        eyebrow="Program"
        title={s.name}
        lead={s.summary}
        crumbs={[
          { href: "/", label: "หน้าแรก" },
          { href: "/services", label: "บริการ" },
        ]}
      />
      <div className="sk-container sk-section sk-split service-detail">
        <Placeholder label={s.name} ratio="4 / 3" />
        <div className="sk-prose">
          <dl className="facts">
            <div><dt>ราคาเริ่มต้น</dt><dd>{s.priceFrom} บาท</dd></div>
            <div><dt>ระยะเวลา</dt><dd>{s.duration}</dd></div>
          </dl>
          <h2>จุดเด่น</h2>
          <ul>
            {s.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          {promo && (
            <p className="promo-note">
              โปรตอนนี้: {promo.name} เหลือ <strong>{promo.now} บาท</strong> ({promo.note})
            </p>
          )}
          <div className="sk-actions">
            <a href={clinic.lineUrl} className="sk-btn sk-btn-primary">จองคิวผ่าน LINE</a>
            <Link href="/services" className="sk-btn sk-btn-outline">บริการอื่น</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
