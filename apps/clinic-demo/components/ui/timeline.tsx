"use client";

// Timeline จาก Aceternity UI (https://ui.aceternity.com/registry/timeline.json, ชุดเดียวกับบน 21st.dev)
// ปรับ: หัวข้อ/คำอธิบาย/ขนาดหัวข้อเป็น prop (ต้นฉบับเขียนข้อความตายตัว), สีตามธีม, เส้นใช้สีแบรนด์,
//       วัดความสูงใหม่เมื่อขนาดเปลี่ยน (เช่นหมุนจอมือถือ)

import { useScroll, useTransform, motion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({
  data,
  heading,
  description,
  titleClassName = "md:text-5xl",
}: {
  data: TimelineEntry[];
  heading?: string;
  description?: string;
  /** ขนาดหัวข้อฝั่งซ้ายบนจอใหญ่ ค่าเริ่มต้นเหมาะกับปี ถ้าหัวข้อยาวให้ใช้ขนาดเล็กลง */
  titleClassName?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 10%", "end 50%"] });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full md:px-10" ref={containerRef}>
      {(heading || description) && (
        <div className="mx-auto max-w-7xl px-4 pt-16 md:px-8 lg:px-10">
          {heading && <h2 className="mb-4 max-w-4xl text-2xl text-foreground md:text-4xl">{heading}</h2>}
          {description && <p className="max-w-sm text-sm text-muted-foreground md:text-base">{description}</p>}
        </div>
      )}

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-32">
            <div className="sticky top-32 z-10 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-background md:left-3">
                <div className="h-4 w-4 rounded-full border border-border bg-card p-2" />
              </div>
              <h3 className={cn("hidden text-xl font-bold text-muted-foreground md:block md:pl-20", titleClassName)}>{item.title}</h3>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <h3 className="mb-4 block text-left text-2xl font-bold text-muted-foreground md:hidden">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-primary from-[0%] via-primary/60 via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
};
