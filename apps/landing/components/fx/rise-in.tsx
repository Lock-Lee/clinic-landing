"use client";

// ข้อความโผล่ขึ้นจากใต้เส้นเมื่อเลื่อนถึง (split-text-anim ของ fahrunstudio.com) ใช้กับชื่อแบรนด์ใหญ่ท้ายเว็บ

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function RiseIn({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    // ตรวจการมองเห็นที่กล่องนอก เพราะกล่องในถูกเลื่อนไปอยู่นอกส่วนที่มองเห็น
    <motion.div
      className={className}
      style={{ overflow: "hidden" }}
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
    >
      <motion.div
        variants={{ hidden: { y: "105%" }, shown: { y: "0%" } }}
        transition={{ duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
