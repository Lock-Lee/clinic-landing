import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead, FaqList, FaqJsonLd } from "@repo/ui/site";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { services, faqs } from "../content";

export const metadata: Metadata = { title: "บริการ" };

// การ์ดที่ 1 และ 4 กว้าง 2 ช่อง เป็นเลย์เอาต์ bento
const SPAN = ["md:col-span-2", "md:col-span-1", "md:col-span-1", "md:col-span-2"];

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Our Services"
        title="บริการของเรา"
        lead="เลือกเฉพาะส่วนที่ต้องการ หรือให้เราดูแลตั้งแต่แบรนด์จนถึงการวัดผล"
        crumbs={[{ href: "/", label: "หน้าแรก" }]}
      />
      <div className="sk-container sk-section">
        <BentoGrid>
          {services.map((s, i) => (
            <BentoGridItem
              key={s.slug}
              className={SPAN[i % SPAN.length]}
              header={
                <div id={s.slug} className="relative min-h-32 flex-1 overflow-hidden rounded-lg scroll-mt-28">
                  <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                </div>
              }
              icon={<span className="font-[family-name:var(--font-display)] text-sm text-primary">0{i + 1}</span>}
              title={<span className="text-lg">{s.name}</span>}
              description={
                <>
                  <p>{s.summary}</p>
                  <p className="mt-1 text-xs">{s.items.join(" · ")}</p>
                </>
              }
            />
          ))}
        </BentoGrid>
      </div>
      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead title="คำถามที่พบบ่อย" />
          <FaqList items={faqs} />
          <FaqJsonLd items={faqs} />
          <div className="sk-actions">
            <Link href="/contact" className="sk-btn sk-btn-primary">ขอใบเสนอราคา</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
