"use client";

// Border Beam จาก Magic UI (https://magicui.design/r/border-beam.json, ชุดเดียวกับบน 21st.dev)
// ปรับ: ใช้สีแบรนด์เป็นค่าเริ่มต้น, หยุดเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว, overflow-hidden กันหน้าเว็บล้นบนมือถือ
// วางไว้ใน element ที่มี position: relative และ border-radius

import { motion, useReducedMotion, type MotionStyle, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: React.CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

export const BorderBeam = ({
  className,
  size = 80,
  delay = 0,
  duration = 8,
  colorFrom = "var(--accent)",
  colorTo = "var(--accent-dark)",
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1.5,
}: BorderBeamProps) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  // กล่องนอกตัด (overflow-hidden) ส่วนที่ล้นของลำแสง ไม่ให้หน้าเว็บกว้างเกินจอ
  // ต้องเป็นกล่องแยก เพราะกล่องในมี border และ overflow จะตัดที่ขอบด้านในของ border ทำให้ลำแสงหายหมด
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]" aria-hidden="true">
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
        style={{ "--border-beam-width": `${borderWidth}px` } as React.CSSProperties}
      >
        <motion.div
          className={cn("absolute aspect-square", "bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent", className)}
          style={
            {
              width: size,
              offsetPath: `rect(0 auto auto 0 round ${size}px)`,
              "--color-from": colorFrom,
              "--color-to": colorTo,
              ...style,
            } as MotionStyle
          }
          initial={{ offsetDistance: `${initialOffset}%` }}
          animate={{
            offsetDistance: reverse
              ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
              : [`${initialOffset}%`, `${100 + initialOffset}%`],
          }}
          transition={{ repeat: Infinity, ease: "linear", duration, delay: -delay, ...transition }}
        />
      </div>
    </div>
  );
};
