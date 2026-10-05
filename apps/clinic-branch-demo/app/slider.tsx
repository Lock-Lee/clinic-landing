"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Slide = { title: string; text: string; cta: string; href: string; tone: string };

// สไลด์แคมเปญหน้าแรก เลื่อนเองทุก 5 วินาที หยุดเมื่อเอาเมาส์ชี้ หรือเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
export function CampaignSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // นับใหม่ทุกครั้งที่เปลี่ยนสไลด์ กดเลือกเองแล้วจะไม่เลื่อนต่อทันที
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => window.clearTimeout(t);
  }, [paused, slides.length, index]);

  const go = (i: number) => setIndex((i + slides.length) % slides.length);

  return (
    <section
      className="slider"
      aria-roledescription="carousel"
      aria-label="แคมเปญ"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div
            key={s.title}
            className="slide"
            style={{ background: s.tone }}
            aria-roledescription="slide"
            aria-label={`${i + 1} จาก ${slides.length}`}
            aria-hidden={i !== index}
          >
            <div className="sk-container slide-inner">
              {i === 0 ? <h1>{s.title}</h1> : <h2 className="slide-title">{s.title}</h2>}
              <p className="sk-lead">{s.text}</p>
              <Link href={s.href} className="sk-btn sk-btn-primary" tabIndex={i === index ? 0 : -1}>
                {s.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="slider-arrow prev" onClick={() => go(index - 1)} aria-label="สไลด์ก่อนหน้า">‹</button>
      <button type="button" className="slider-arrow next" onClick={() => go(index + 1)} aria-label="สไลด์ถัดไป">›</button>
      <div className="slider-dots">
        {slides.map((s, i) => (
          <button key={s.title} type="button" aria-label={`ไปสไลด์ ${i + 1}`} aria-current={i === index} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  );
}
