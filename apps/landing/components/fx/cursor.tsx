"use client";

// ลูกบอลตามเมาส์แบบหน่วงๆ (แบบ fahrunstudio.com) ขยายเมื่อชี้ลิงก์/ปุ่ม
// ใส่ data-cursor="ข้อความ" ที่องค์ประกอบใดก็ได้ ลูกบอลจะกลายเป็นวงกลมใหญ่มีข้อความนั้น
// แสดงเฉพาะอุปกรณ์ที่มีเมาส์และไม่ได้ปิดแอนิเมชัน ไม่ซ่อนเคอร์เซอร์จริง

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const TARGETS = "[data-cursor], a, button, summary, [role=button]";

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setShown(true);
    };
    const over = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>(TARGETS) : null;
      setHover(Boolean(el));
      setLabel(el?.dataset.cursor ?? null);
    };
    const leave = () => setShown(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="fx-cursor"
      data-state={label ? "label" : hover ? "hover" : "idle"}
      style={{ x: springX, y: springY, opacity: shown ? 1 : 0 }}
      aria-hidden="true"
    >
      <span className="fx-cursor-ball">{label && <span className="fx-cursor-label">{label}</span>}</span>
    </motion.div>
  );
}
