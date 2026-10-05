import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero, Placeholder } from "@repo/ui/site";
import { projects } from "../../content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p?.name ?? "ผลงาน", description: p?.summary };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const index = projects.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <main>
      <PageHero
        eyebrow={p.industry}
        title={p.name}
        lead={p.summary}
        crumbs={[
          { href: "/", label: "หน้าแรก" },
          { href: "/projects", label: "ผลงาน" },
        ]}
      />
      <div className="sk-container sk-section">
        <img src={p.image} alt={`ภาพผลงาน ${p.name}`} className="aspect-[16/8] w-full rounded-[14px] object-cover" />
        <div className="project-body">
          <dl className="project-facts">
            <div><dt>ลูกค้า</dt><dd>{p.client}</dd></div>
            <div><dt>ปี</dt><dd>{p.year}</dd></div>
            <div><dt>บริการ</dt><dd>{p.services.join(", ")}</dd></div>
          </dl>
          <div className="sk-prose">
            <h2>โจทย์</h2>
            <p>{p.challenge}</p>
            <h2>สิ่งที่เราทำ</h2>
            <p>{p.solution}</p>
            <h2>ผลลัพธ์</h2>
            <ul>
              {p.results.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="sk-grid sk-grid-2">
          <Placeholder label="ภาพประกอบ 1" tone={p.tone} />
          <Placeholder label="ภาพประกอบ 2" tone={p.tone} />
        </div>
        <Link href={`/projects/${next.slug}`} className="next-project">
          <span className="sk-muted sk-small">ผลงานถัดไป</span>
          <strong>{next.name} →</strong>
        </Link>
      </div>
    </main>
  );
}
