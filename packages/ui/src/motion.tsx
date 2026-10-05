"use client";

import { useEffect } from "react";

// ใส่ selector ของสิ่งที่ต้องการให้ค่อยๆ เลื่อนขึ้นมาเมื่อเลื่อนหน้าจอถึง
export function Motion({ selector }: { selector: string }) {
  useEffect(() => {
    const root = document.documentElement;

    // เงาใต้ header เมื่อเลื่อนลงมา
    const onScroll = () => root.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const items = Array.from(document.querySelectorAll<HTMLElement>(selector));
    items.forEach((el) => {
      // ไล่จังหวะทีละชิ้นในแถวเดียวกัน
      const index = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0;
      el.style.setProperty("--d", `${(index % 4) * 90}ms`);
      el.classList.add("reveal");
    });
    root.classList.add("reveal-on");

    const done = (e: TransitionEvent) => {
      const el = e.currentTarget as HTMLElement;
      if (e.target !== el) return;
      // ถอดคลาสออกหลังเล่นจบ เพื่อให้ hover ของการ์ดทำงานตามปกติ
      el.classList.remove("reveal", "is-in");
      el.style.removeProperty("--d");
      el.removeEventListener("transitionend", done);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.addEventListener("transitionend", done);
          el.classList.add("is-in");
          observer.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    items.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [selector]);

  return null;
}
