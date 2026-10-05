import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Placeholder } from "@repo/ui/site";
import { clinic, articles } from "../../content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  return { title: a?.title ?? "บทความ", description: a?.excerpt };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.date,
    publisher: { "@type": "MedicalClinic", name: clinic.name },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={a.category}
        title={a.title}
        lead={a.excerpt}
        crumbs={[
          { href: "/", label: "หน้าแรก" },
          { href: "/articles", label: "บทความ" },
        ]}
      />
      <article className="sk-container sk-section">
        <div className="sk-prose">
          <p className="sk-muted sk-small">
            เผยแพร่ <time dateTime={a.date}>{a.date}</time>
          </p>
          <Placeholder label="ภาพประกอบบทความ" ratio="16 / 9" />
          {a.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="sk-muted sk-small">บทความนี้เป็นข้อมูลทั่วไป ไม่ใช่คำแนะนำทางการแพทย์ ควรปรึกษาแพทย์ก่อนตัดสินใจ</p>
          <div className="sk-actions">
            <Link href="/contact" className="sk-btn sk-btn-primary">ปรึกษาแพทย์ฟรี</Link>
            <Link href="/articles" className="sk-btn sk-btn-outline">บทความอื่น</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
