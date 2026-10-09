import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Placeholder } from "@repo/ui/site";
import { getContent } from "@repo/db";
import { SITE_ID, articleBlocks, editableDefaults } from "../../../content";

type Props = { params: Promise<{ slug: string }> };

// ไม่ทำ generateStaticParams เพราะเพิ่ม/ลบบทความได้จากหลังบ้าน slug ที่ไม่มีจะได้ 404
// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = await getContent(SITE_ID, editableDefaults);
  const a = articles.find((x) => x.slug === slug);
  if (!a) return { title: "บทความ" };
  // ไม่มีคำโปรย ใช้ย่อหน้าแรกแทน
  const blocks = articleBlocks(a);
  const firstText = blocks.flatMap((b) => (b.type === "text" && b.text.trim() ? [b.text.trim()] : []))[0];
  const description = a.excerpt || firstText?.slice(0, 160);
  // รูปแชร์: รูปปก ถ้าไม่มีใช้รูปแรกในเนื้อหา
  const ogImage = a.image || blocks.flatMap((b) => (b.type === "image" && b.src ? [b.src] : []))[0];
  return { title: a.title, description, openGraph: ogImage ? { title: a.title, description, images: [ogImage] } : undefined };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const { clinic, articles } = await getContent(SITE_ID, editableDefaults);
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();
  const blocks = articleBlocks(a);
  const images = [a.image, ...blocks.map((b) => (b.type === "image" ? b.src : undefined))].filter((x): x is string => !!x);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.date,
    ...(images.length ? { image: images } : {}),
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
          {a.image ? (
            <img src={a.image} alt="" className="cover" style={{ aspectRatio: "16 / 9" }} />
          ) : (
            <Placeholder label="ภาพประกอบบทความ" ratio="16 / 9" />
          )}
          {blocks.map((b, i) => {
            if (b.type === "heading") return b.text.trim() ? <h2 key={i}>{b.text}</h2> : null;
            if (b.type === "image")
              return b.src ? (
                <figure key={i} className="article-figure">
                  <img src={b.src} alt={b.alt ?? b.caption ?? ""} loading="lazy" decoding="async" />
                  {b.caption?.trim() && <figcaption>{b.caption}</figcaption>}
                </figure>
              ) : null;
            // ย่อหน้า: บรรทัดว่างแยกเป็นย่อหน้าใหม่ ขึ้นบรรทัดเดียวคงไว้ในย่อหน้าเดิม
            return b.text
              .split(/\n\s*\n/)
              .filter((t) => t.trim())
              .map((t, j) => (
                <p key={`${i}-${j}`} className="article-text">
                  {t.trim()}
                </p>
              ));
          })}
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
