"use client";

// แถบตัวอักษรใหญ่วิ่งไม่รู้จบ สลับกับภาพวงกลม ยิ่งเลื่อนหน้าเร็วยิ่งวิ่งเร็ว
// เนื้อหาซ้ำ 2 ชุด แล้ววนที่ -50% ให้ต่อกันเนียน

import { Fragment, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

export function VelocityMarquee({ words, images }: { words: string[]; images: string[] }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1500, 0, 1500], [5, 0, 5], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // เลื่อนลงวิ่งซ้าย เลื่อนขึ้นวิ่งขวา
    const v = velocity.get();
    if (v > 20) direction.current = -1;
    else if (v < -20) direction.current = 1;
    base.set(base.get() + direction.current * 2 * (1 + boost.get()) * (delta / 1000));
  });

  const row = (copy: number) =>
    words.map((word, i) => (
      <Fragment key={`${copy}-${i}`}>
        <span className={i % 2 ? "fx-marquee-word is-outline" : "fx-marquee-word"}>{word}</span>
        <img className="fx-marquee-img" src={images[i % images.length]} alt="" loading="lazy" />
      </Fragment>
    ));

  return (
    <div className="fx-marquee" aria-hidden="true">
      <motion.div className="fx-marquee-track" style={{ x }}>
        {row(0)}
        {row(1)}
      </motion.div>
    </div>
  );
}
