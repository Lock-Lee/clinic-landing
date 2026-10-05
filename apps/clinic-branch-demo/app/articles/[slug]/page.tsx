import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@repo/ui/site";
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

  return (
    <main>
      <PageHero
        title={a.title}
        lead={a.excerpt}
        crumbs={[
          { href: "/", label: "หน้าแรก" },
          { href: "/articles", label: "บทความ" },
        ]}
      />
      <article className="sk-container sk-section">
        <div className="sk-prose">
          <time className="sk-muted sk-small" dateTime={a.date}>{a.date}</time>
          {a.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="sk-muted sk-small">บทความนี้เป็นข้อมูลทั่วไป ควรปรึกษาแพทย์ก่อนตัดสินใจ</p>
          <div className="sk-actions">
            <a href={clinic.lineUrl} className="sk-btn sk-btn-primary">ปรึกษาผ่าน LINE</a>
            <Link href="/articles" className="sk-btn sk-btn-outline">บทความอื่น</Link>
          </div>
        </div>
      </article>
    </main>
  );
}
