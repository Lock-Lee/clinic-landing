"use client";

import { usePathname } from "next/navigation";
import { Motion } from "../motion";

const SELECTOR = [".sk-section-head", ".sk-grid > *", ".sk-faq-list > *", ".sk-reveal"].join(",");

// เว็บหลายหน้า: เล่นแอนิเมชันเลื่อนขึ้นใหม่ทุกครั้งที่เปลี่ยนหน้า
export function RouteMotion() {
  const pathname = usePathname();
  return <Motion key={pathname} selector={SELECTOR} />;
}
