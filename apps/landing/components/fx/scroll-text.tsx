"use client";

// ข้อความที่ตัวอักษรค่อยๆ สว่างตามการเลื่อน (reveal-type ของ fahrunstudio.com)
// ตัดตามกลุ่มอักษร (grapheme) เพื่อไม่ให้สระและวรรณยุกต์ไทยแยกจากพยัญชนะ
// ความทึบคำนวณใน CSS จาก --p (ความคืบหน้า) --i (ลำดับตัว) --n (จำนวนตัว) จึงไม่ re-render ตอนเลื่อน
// โปรแกรมอ่านหน้าจออ่านข้อความเต็มจาก sr-only, ปิด JS ก็เห็นข้อความเต็ม

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

function graphemes(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    return Array.from(new Intl.Segmenter("th", { granularity: "grapheme" }).segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const parts = useMemo(() => graphemes(text), [text]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 50%"] });

  // ผู้ใช้ที่ปิดแอนิเมชัน CSS จะแสดงทุกตัวเต็มเอง
  useMotionValueEvent(scrollYProgress, "change", (v) => ref.current?.style.setProperty("--p", v.toFixed(4)));
  useEffect(() => {
    ref.current?.style.setProperty("--p", scrollYProgress.get().toFixed(4));
  }, [scrollYProgress]);

  return (
    <p ref={ref} className={cn("fx-scroll-text", className)} style={{ "--n": parts.length } as CSSProperties}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {parts.map((ch, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </p>
  );
}
