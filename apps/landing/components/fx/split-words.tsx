// ตัดข้อความเป็นคำ (ตัดคำไทยด้วย Intl.Segmenter) ให้แต่ละคำลอยขึ้นทีละคำตอนโหลดหน้า
// เป็น server component แอนิเมชันเป็น CSS ล้วน (.fx-rise ใน globals.css) ปิด JS ก็ทำงาน

import type { CSSProperties } from "react";

export function splitWords(text: string) {
  return Array.from(new Intl.Segmenter("th", { granularity: "word" }).segment(text), (s) => s.segment);
}

// start = ลำดับคำแรก ใช้ไล่จังหวะต่อจากบรรทัดก่อนหน้า
// ข้อความแบ่งเป็นวลีด้วยช่องว่างหรือ \u200B (ไม่เห็นเป็นช่องว่าง) ขึ้นบรรทัดใหม่ได้เฉพาะระหว่างวลี ไม่ตัดกลางคำอย่าง "มือ|ถือ"
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  let i = start;
  return (
    <>
      {text.split(/([\s\u200B]+)/).map((part, pi) =>
        part.replace(/\u200B/g, "").trim() ? (
          <span key={pi} className="fx-phrase">
            {splitWords(part).map((word, wi) => (
              <span key={wi} className="fx-rise" style={{ "--i": i++ } as CSSProperties}>
                {word}
              </span>
            ))}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
