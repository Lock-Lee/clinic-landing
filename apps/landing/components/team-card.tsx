"use client";

// การ์ดทีมงาน: รูปในกรอบเหรียญทอง มีชื่อตำแหน่งวิ่งวนรอบรูปและรัศมีด้านหลัง
// รูปเริ่มเป็นเงาตัวร้ายแบบการ์ตูนนักสืบ (เงาเข้มตาขาวกะพริบ) ชี้หรือแตะแล้ววงแสงขยายจากจุดที่ชี้ เปิดเห็นหน้าจริง
// ชี้แล้วการ์ดเอียงตามเมาส์พร้อมแสงสะท้อน ป้ายความถนัดเลื่อนขึ้น
// จอสัมผัส: แตะการ์ดเพื่อเปิดเผย/ซ่อน แสดงป้ายความถนัดตลอด

import { useId, useRef, useState } from "react";
import type { TeamMember } from "@/app/content";

const RAYS = Array.from({ length: 32 }, (_, i) => i);

export function TeamCard({ member }: { member: TeamMember }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathId = useId();
  const [revealed, setRevealed] = useState(false);

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
  // จุดเริ่มวงแสงเปิดหน้า ให้ขยายจากตำแหน่งที่ชี้/แตะบนรูป
  const aim = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    e.currentTarget.style.setProperty("--sy", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
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
    <div
      ref={ref}
      className="card team-card"
      data-revealed={revealed || undefined}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={() => setRevealed((v) => !v)}
    >
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
        <div className="team-photo" onPointerEnter={aim} onPointerDown={aim}>
          {member.photo && <img src={member.photo} alt={`รูป ${member.name} ${member.role}`} loading="lazy" />}
          <svg viewBox="0 0 100 100" className="team-culprit" aria-hidden="true">
            <path className="team-culprit-body" d="M50 14c-12 0-20 9-20 22 0 8 3 14 8 18-13 4-24 14-27 30l-1 16h80l-1-16c-3-16-14-26-27-30 5-4 8-10 8-18 0-13-8-22-20-22z" />
            <g className="team-culprit-eyes">
              <path d="M37 33c3-2 8-2 11 2-4 2-8 2-11-2z" />
              <path d="M63 33c-3-2-8-2-11 2 4 2 8 2 11-2z" />
            </g>
            <path className="team-culprit-grin" d="M41 45c5 4 13 4 18 0-3 5-15 5-18 0z" />
          </svg>
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
