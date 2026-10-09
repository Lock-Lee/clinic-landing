import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Placeholder } from "@repo/ui/site";
import { getContent } from "@repo/db";
import { SITE_ID, editableDefaults } from "../../content";

export const metadata: Metadata = { title: "บทความ" };
// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";


export default async function ArticlesPage() {
  const { articles } = await getContent(SITE_ID, editableDefaults);
  return (
    <main>
      <PageHero eyebrow="Articles" title="บทความ" lead="ความรู้เรื่องศัลยกรรมและการดูแลผิว เขียนโดยทีมแพทย์" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-2">
          {articles.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="sk-card">
              {a.image ? <img src={a.image} alt="" className="cover" style={{ aspectRatio: "16 / 9" }} /> : <Placeholder label="ภาพบทความ" ratio="16 / 9" />}
              <div className="article-meta sk-small sk-muted">
                <span className="sk-tag">{a.category}</span>
                <time dateTime={a.date}>{a.date}</time>
              </div>
              <h3>{a.title}</h3>
              <p className="sk-muted">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
