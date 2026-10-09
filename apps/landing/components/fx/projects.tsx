"use client";

// ผลงานแบบ "Featured Projects" ของ fahrunstudio.com
// กรอบภาพขยายจากตรงกลางเมื่อเลื่อนถึง, ภาพซูมออกตามการเลื่อน, ชี้แล้วเคอร์เซอร์เป็นวงกลม "เปิดดู"

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export type Project = { name: string; category: string; url: string; image: string };

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.35, 1]);

  return (
    <a
      ref={ref}
      href={project.url}
      className="fx-project"
      data-cursor="เปิดดู"
      {...(project.url.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
    >
      <motion.div
        className="fx-project-media"
        initial={reduce ? false : { clipPath: "inset(14% 10% 14% 10% round 24px)" }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 16px)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.1, ease: [0.7, 0, 0.2, 1] }}
      >
        <motion.img src={project.image} alt={`ภาพหน้าจอเว็บ ${project.name}`} loading="lazy" style={reduce ? undefined : { scale }} />
      </motion.div>
      <div className="fx-project-info">
        <span className="fx-project-no">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h3>{project.name}</h3>
          <p>{project.category}</p>
        </div>
        <span className="fx-project-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </a>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <div className="fx-projects">
      {projects.map((project, i) => (
        <ProjectCard key={project.name} project={project} index={i} />
      ))}
    </div>
  );
}
