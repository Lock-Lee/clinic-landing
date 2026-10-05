import type { Metadata } from "next";
import { PageHero, DemoForm } from "@repo/ui/site";
import { BorderBeam } from "@/components/ui/border-beam";
import { studio, services } from "../content";

export const metadata: Metadata = { title: "ติดต่อ" };

export default function ContactPage() {
  return (
    <main>
      <PageHero
        eyebrow="Let's Connect"
        title="เล่าโปรเจกต์ให้เราฟัง"
        lead="กรอกข้อมูลสั้นๆ เราจะติดต่อกลับภายใน 1 วันทำการ"
        crumbs={[{ href: "/", label: "หน้าแรก" }]}
      />
      <div className="sk-container sk-section contact-grid">
        <div className="relative rounded-2xl border border-border bg-card p-6 md:p-8">
          <BorderBeam />
          <DemoForm
            fields={[
              { name: "name", label: "ชื่อ", required: true },
              { name: "email", label: "อีเมล", type: "email", required: true },
              { name: "phone", label: "เบอร์โทร", type: "tel" },
              { name: "service", label: "สนใจบริการ", type: "select", options: services.map((s) => s.name) },
              { name: "detail", label: "รายละเอียดโปรเจกต์", type: "textarea" },
            ]}
            consent="ยินยอมให้ติดต่อกลับตามข้อมูลที่ให้ไว้"
            submitLabel="ส่งข้อความ"
            doneText="ได้รับข้อความแล้ว เราจะติดต่อกลับเร็วๆ นี้"
          />
        </div>
        <aside className="contact-aside">
          <h2>ช่องทางอื่น</h2>
          <p>อีเมล <a href={`mailto:${studio.email}`}>{studio.email}</a></p>
          <p>โทร {studio.phone}</p>
          <p className="sk-muted">ออฟฟิศ: {studio.city}</p>
        </aside>
      </div>
    </main>
  );
}
