import type { Metadata } from "next";
import { PageHero } from "@repo/ui/site";
import { FocusCards } from "@/components/ui/focus-cards";
import { projects } from "../content";

export const metadata: Metadata = { title: "ผลงาน" };

export default function ProjectsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Projects"
        title="ผลงานของเรา"
        lead="ตัวอย่างงานแบรนด์ เว็บไซต์ และ LINE OA สำหรับคลินิกและธุรกิจความงาม"
        crumbs={[{ href: "/", label: "หน้าแรก" }]}
      />
      <div className="sk-container sk-section">
        <FocusCards
          cards={projects.map((p) => ({
            title: p.name,
            subtitle: `${p.industry} · ${p.year}`,
            src: p.image,
            href: `/projects/${p.slug}`,
          }))}
        />
      </div>
    </main>
  );
}
