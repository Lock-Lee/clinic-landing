"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// ปรับจากต้นฉบับ hero-3:
// - ปุ่มใช้สีแบรนด์ (bg-primary) แทนแดง และเป็นลิงก์ได้ผ่าน ctaHref
// - แถบภาพเลื่อนวนต่อเนื่องไม่กระตุก (เลื่อน -50% ของความกว้างภาพทั้งแถว)
// - หยุดเลื่อนเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว
// - เว้นที่ด้านล่างให้แถบภาพ ข้อความจะไม่ทับภาพบนมือถือ

interface AnimatedMarqueeHeroProps {
  tagline: string;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref?: string;
  secondary?: { text: string; href: string };
  images: string[];
  className?: string;
}

const FADE_IN: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const BUTTON_CLASS =
  "inline-block px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg no-underline transition-colors hover:bg-primary/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const MotionLink = motion.create(Link);

const ActionButton = ({ children, href }: { children: React.ReactNode; href?: string }) =>
  href ? (
    <MotionLink href={href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={BUTTON_CLASS}>
      {children}
    </MotionLink>
  ) : (
    <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={BUTTON_CLASS}>
      {children}
    </motion.button>
  );

export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  title,
  description,
  ctaText,
  ctaHref,
  secondary,
  images,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        "relative w-full min-h-[640px] h-[calc(100svh-110px)] overflow-hidden bg-background flex flex-col items-center justify-center text-center px-4 pb-56 md:pb-72",
        className,
      )}
    >
      <div className="z-10 flex flex-col items-center">
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          className="mb-4 inline-block rounded-full border border-border bg-card/50 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
        >
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight tracking-tight text-foreground"
        >
          {typeof title === "string"
            ? title.split(" ").map((word, i) => (
                <motion.span key={i} variants={FADE_IN} className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground"
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <ActionButton href={ctaHref}>{ctaText}</ActionButton>
          {secondary && (
            <Link
              href={secondary.href}
              className="px-6 py-3 rounded-full border border-border text-foreground font-semibold no-underline transition-colors hover:border-primary hover:text-primary"
            >
              {secondary.text}
            </Link>
          )}
        </motion.div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-56 md:h-72 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
        aria-hidden="true"
      >
        <motion.div
          className="flex w-max gap-4 pt-6"
          animate={reduceMotion ? undefined : { x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-40 md:h-56 flex-shrink-0"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover rounded-2xl shadow-md" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
