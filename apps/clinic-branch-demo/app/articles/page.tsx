import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Placeholder } from "@repo/ui/site";
import { articles } from "../content";

export const metadata: Metadata = { title: "บทความ" };

export default function ArticlesPage() {
  return (
    <main>
      <PageHero eyebrow="Articles" title="บทความ" lead="ไขข้อข้องใจเรื่องผิวและหัตถการความงาม" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-3">
          {articles.map((a) => (
            <Link key={a.slug} href={`/articles/${a.slug}`} className="sk-card">
              <Placeholder label="ภาพบทความ" ratio="16 / 10" />
              <time className="sk-small sk-muted" dateTime={a.date}>{a.date}</time>
              <h3>{a.title}</h3>
              <p className="sk-muted sk-small">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
