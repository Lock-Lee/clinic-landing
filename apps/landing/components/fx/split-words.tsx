// ตัดข้อความเป็นคำ (ตัดคำไทยด้วย Intl.Segmenter) ให้แต่ละคำลอยขึ้นทีละคำตอนโหลดหน้า
// เป็น server component แอนิเมชันเป็น CSS ล้วน (.fx-rise ใน globals.css) ปิด JS ก็ทำงาน

import type { CSSProperties } from "react";

export function splitWords(text: string) {
  return Array.from(new Intl.Segmenter("th", { granularity: "word" }).segment(text), (s) => s.segment);
}

// start = ลำดับคำแรก ใช้ไล่จังหวะต่อจากบรรทัดก่อนหน้า
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {splitWords(text).map((word, i) =>
        word.trim() ? (
          <span key={i} className="fx-rise" style={{ "--i": start + i } as CSSProperties}>
            {word}
          </span>
        ) : (
          word
        ),
      )}
    </>
  );
}
