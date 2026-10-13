"use client";

// การ์ดทีมงาน: รูปในกรอบเหรียญทอง มีชื่อตำแหน่งวิ่งวนรอบรูปและรัศมีด้านหลัง
// ชี้แล้วการ์ดเอียงตามเมาส์พร้อมแสงสะท้อน รูปจากโทนจางเป็นสีจริง ป้ายความถนัดเลื่อนขึ้น
// จอสัมผัสหรือปิดแอนิเมชัน: ไม่เอียง แสดงรูปสีจริงและป้ายความถนัดตลอด

import { useId, useRef } from "react";
import type { TeamMember } from "@/app/content";

const RAYS = Array.from({ length: 32 }, (_, i) => i);

export function TeamCard({ member }: { member: TeamMember }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathId = useId();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 12).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  };

  // วนชื่อตำแหน่งให้พอดีรอบวง (ประมาณ 57 ตัวอักษรต่อรอบ)
  const ringText = `${member.role} · `.repeat(Math.max(1, Math.round(57 / (member.role.length + 3)))).toUpperCase();

  return (
    <div ref={ref} className="card team-card" onPointerMove={onMove} onPointerLeave={onLeave}>
      <span className="team-glare" aria-hidden="true" />
      <div className="team-amulet" aria-hidden={member.photo ? undefined : true}>
        <svg className="team-rays" viewBox="-100 -100 200 200" aria-hidden="true">
          {RAYS.map((i) => {
            const a = (i / RAYS.length) * Math.PI * 2;
            const r2 = i % 2 === 0 ? 98 : 86;
            return (
              <line
                key={i}
                x1={(Math.cos(a) * 72).toFixed(2)}
                y1={(Math.sin(a) * 72).toFixed(2)}
                x2={(Math.cos(a) * r2).toFixed(2)}
                y2={(Math.sin(a) * r2).toFixed(2)}
                className={i % 4 === 0 ? "team-ray team-ray-gold" : "team-ray"}
              />
            );
          })}
        </svg>
        <svg className="team-ring" viewBox="-100 -100 200 200" aria-hidden="true">
          <defs>
            <path id={pathId} d="M0,-63 a63,63 0 1,1 0,126 a63,63 0 1,1 0,-126" />
          </defs>
          <circle r="70" className="team-ring-line" />
          <circle r="56" className="team-ring-line" />
          <text className="team-ring-text">
            <textPath href={`#${pathId}`} textLength="390">
              {ringText}
            </textPath>
          </text>
        </svg>
        <div className="team-photo">
          {member.photo ? (
            <img src={member.photo} alt={`รูป ${member.name} ${member.role}`} loading="lazy" />
          ) : (
            <svg viewBox="0 0 100 100" className="team-silhouette" aria-hidden="true">
              <circle cx="50" cy="38" r="17" />
              <path d="M16 96c2-20 16-32 34-32s32 12 34 32z" />
            </svg>
          )}
        </div>
      </div>
      <div className="team-body">
        <p className="card-type">{member.role}</p>
        <h3>{member.name}</h3>
        <p className="muted">{member.detail}</p>
      </div>
      <ul className="team-skills" aria-label="ความถนัด">
        {member.skills.map((s, i) => (
          <li key={s} style={{ "--i": i } as React.CSSProperties}>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
