import type { Metadata } from "next";
import { PageHero } from "@repo/ui/site";
import { reviews } from "../content";

export const metadata: Metadata = { title: "รีวิว" };

export default function ReviewsPage() {
  return (
    <main>
      <PageHero eyebrow="Reviews" title="รีวิวจากผู้ใช้บริการ" lead="ความประทับใจจากลูกค้า ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-3">
          {reviews.map((r) => (
            <figure key={r.name} className="sk-card review">
              <span className="sk-tag">{r.service}</span>
              <blockquote>“{r.text}”</blockquote>
              <figcaption className="sk-muted sk-small">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
