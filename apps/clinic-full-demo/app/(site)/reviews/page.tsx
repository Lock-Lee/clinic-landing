import type { Metadata } from "next";
import { PageHero } from "@repo/ui/site";
import { getContent } from "@repo/db";
import { SITE_ID, editableDefaults } from "../../content";

export const metadata: Metadata = { title: "รีวิว" };
// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";


export default async function ReviewsPage() {
  const { reviews } = await getContent(SITE_ID, editableDefaults);
  return (
    <main>
      <PageHero eyebrow="Reviews" title="รีวิวจากผู้ใช้บริการ" lead="ความประทับใจจากลูกค้า ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล" crumbs={[{ href: "/", label: "หน้าแรก" }]} />
      <div className="sk-container sk-section">
        <div className="sk-grid sk-grid-3">
          {reviews.map((r, i) => (
            <figure key={i} className="sk-card review">
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
