import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Placeholder } from "@repo/ui/site";
import { articles } from "../content";

export const metadata: Metadata = { title: "บทความ" };

export default function ArticlesPage() {
  return (
    <main>
      <PageHero eyebrow="Articles" title="บทความ" lead="ความรู้เรื่องศัลยกรรมและการดูแลผิว เขียนโดยทีมแพทย์" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-2">
          {articles.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="sk-card">
              <Placeholder label="ภาพบทความ" ratio="16 / 9" />
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
