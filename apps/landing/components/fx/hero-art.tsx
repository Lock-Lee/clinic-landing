"use client";

// ภาพประกอบ hero: โชว์ผลงานจริง (เว็บ Meekong ในหน้าต่างเบราว์เซอร์ แอปแม่ยุ้ยและ Rachanut ในมือถือ) จากภาพใน public/showcase
// มีป้ายลอยรอบๆ (ชุดสี ตัวอักษร แจ้งเตือน LINE) และรัศมีขาวทองด้านหลัง สีทั้งหมดมาจาก token ของชุดสีใน globals.css
// ขยับตามเมาส์เล็กน้อย ผู้ใช้ที่ปิดแอนิเมชันเห็นภาพนิ่ง

import { useEffect, useRef } from "react";

const RAYS = Array.from({ length: 48 }, (_, i) => i);

export function HeroArt({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty("--my", ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={ref} className={className} aria-hidden="true">
      <div className="art-stage">
        <svg className="art-rays" viewBox="-100 -100 200 200">
          <circle r="34" className="art-halo" />
          {RAYS.map((i) => {
            const a = (i / RAYS.length) * Math.PI * 2;
            const long = i % 2 === 0;
            const r1 = 40;
            const r2 = long ? 96 : 74;
            return (
              <line
                key={i}
                x1={(Math.cos(a) * r1).toFixed(2)}
                y1={(Math.sin(a) * r1).toFixed(2)}
                x2={(Math.cos(a) * r2).toFixed(2)}
                y2={(Math.sin(a) * r2).toFixed(2)}
                className={i % 4 === 0 ? "art-ray art-ray-gold" : "art-ray"}
              />
            );
          })}
        </svg>

        <div className="art-layer art-browser" style={{ "--depth": 1 } as React.CSSProperties}>
          <div className="art-browser-bar">
            <span />
            <span />
            <span />
            <em>meekong.com</em>
          </div>
          <img src="/showcase/screen-meekong.jpg" alt="" />
        </div>

        <div className="art-layer art-phone" style={{ "--depth": 2.2 } as React.CSSProperties}>
          <img src="/showcase/screen-rachanut.jpg" alt="" />
        </div>

        <div className="art-layer art-phone art-phone-right" style={{ "--depth": 1.8 } as React.CSSProperties}>
          <img src="/showcase/screen-maeyui.jpg" alt="" />
        </div>

        <div className="art-layer art-chip art-chip-type" style={{ "--depth": 3 } as React.CSSProperties}>
          <b>Aa</b>
          <span>ก ข ค</span>
        </div>

        <div className="art-layer art-chip art-chip-line" style={{ "--depth": 3.4 } as React.CSSProperties}>
          <svg viewBox="0 0 24 24" className="art-line-icon">
            <rect width="24" height="24" rx="6" />
            <path d="M12 5.5c-4 0-7 2.5-7 5.6 0 2.8 2.4 5.1 5.7 5.5.5.1.4.6.3 1.6 0 .3.2.4.5.3 2.6-1.4 7.5-4.4 7.5-7.4 0-3.1-3-5.6-7-5.6z" />
          </svg>
          <span>
            <b>มีลูกค้าจองคิวใหม่</b>
            แจ้งเตือนเข้า LINE ร้าน
          </span>
        </div>

      </div>
    </div>
  );
}
