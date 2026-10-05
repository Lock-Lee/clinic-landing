import type { Metadata } from "next";
import { PageHero } from "@repo/ui/site";
import { reviews } from "../content";

export const metadata: Metadata = { title: "รีวิวลูกค้า" };

export default function ReviewsPage() {
  return (
    <main>
      <PageHero eyebrow="Reviews" title="รีวิวลูกค้า" lead="ความประทับใจจากผู้ใช้บริการทั้ง 2 สาขา ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-3">
          {reviews.map((r) => (
            <figure key={r.name} className="sk-card review">
              <span className="stars" aria-label="5 ดาว">★★★★★</span>
              <blockquote>“{r.text}”</blockquote>
              <figcaption className="sk-muted sk-small">{r.name} · {r.service} · {r.branch}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  );
}
