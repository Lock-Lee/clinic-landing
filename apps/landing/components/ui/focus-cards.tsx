"use client";

// Focus Cards จาก Aceternity UI (https://ui.aceternity.com/registry/focus-cards.json, ชุดเดียวกับบน 21st.dev)
// ปรับ: การ์ดเป็นลิงก์ (href) มีคำอธิบายรอง, บนมือถือ (ไม่มี hover) แสดงชื่อตลอด,
//       โฟกัสด้วยคีย์บอร์ดได้, รูปเต็มกรอบ, สีตามธีม

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type FocusCard = { title: string; src: string; href?: string; subtitle?: string };

const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCard;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const active = hovered === index;
    const inner = (
      <>
        <img src={card.src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end gap-1 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-5 py-6 transition-opacity duration-300",
            active ? "opacity-100" : "opacity-100 md:opacity-0",
          )}
        >
          {card.subtitle && <span className="text-sm text-white/75">{card.subtitle}</span>}
          <span className="text-xl font-medium text-white md:text-2xl">{card.title}</span>
        </div>
      </>
    );
    const className = cn(
      "relative block h-64 w-full overflow-hidden rounded-xl bg-card no-underline transition-all duration-300 ease-out md:h-96",
      hovered !== null && !active && "md:blur-sm md:scale-[0.98]",
    );
    const handlers = {
      onMouseEnter: () => setHovered(index),
      onMouseLeave: () => setHovered(null),
      onFocus: () => setHovered(index),
      onBlur: () => setHovered(null),
    };
    return card.href ? (
      <Link href={card.href} className={className} aria-label={card.title} {...handlers}>
        {inner}
      </Link>
    ) : (
      <div className={className} {...handlers}>
        {inner}
      </div>
    );
  },
);
Card.displayName = "Card";

export function FocusCards({ cards, className }: { cards: FocusCard[]; className?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("mx-auto grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8", className)}>
      {cards.map((card, index) => (
        <Card key={card.title} card={card} index={index} hovered={hovered} setHovered={setHovered} />
      ))}
    </div>
  );
}
