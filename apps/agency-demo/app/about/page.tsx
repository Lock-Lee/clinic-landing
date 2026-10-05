import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead, Placeholder } from "@repo/ui/site";
import { Timeline } from "@/components/ui/timeline";
import { studio, timeline, team } from "../content";

export const metadata: Metadata = { title: "เกี่ยวกับเรา" };

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="About"
        title={`เกี่ยวกับ ${studio.name}`}
        lead="ทีมเล็กที่ทำงานกับคลินิกและแบรนด์ความงามเป็นหลัก เราเชื่อว่างานออกแบบที่ดีต้องวัดผลเป็นยอดจองได้"
        crumbs={[{ href: "/", label: "หน้าแรก" }]}
      />

      <section className="sk-container">
        <Timeline
          heading="เส้นทางของเรา"
          description="จากสตูดิโอเล็กๆ สู่ทีมที่ดูแลคลินิกความงามทั่วประเทศ"
          data={timeline.map((t) => ({
            title: t.year,
            content: <p className="text-lg text-foreground md:text-xl">{t.text}</p>,
          }))}
        />
      </section>

      <section className="sk-band">
        <div className="sk-container sk-section">
          <SectionHead eyebrow="Team" title="ทีมงาน" />
          <div className="sk-grid team">
            {team.map((m) => (
              <div key={m.name} className="member">
                <Placeholder label="ภาพทีมงาน" ratio="1 / 1" />
                <h3>{m.name}</h3>
                <p className="sk-muted sk-small">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sk-container sk-section cta">
        <h2>ร่วมงานกับเรา</h2>
        <p className="sk-lead">เรากำลังมองหานักออกแบบและนักพัฒนาเว็บที่สนใจงานสายสุขภาพและความงาม</p>
        <div className="sk-actions">
          <Link href="/contact" className="sk-btn sk-btn-outline">ส่ง Portfolio</Link>
        </div>
      </section>
    </main>
  );
}
