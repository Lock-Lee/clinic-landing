"use client";

import { useEffect, useRef, useState } from "react";

// จำลองหน้าแชท LINE OA + Rich Menu กดเมนูแล้วบอทตอบ ใช้โชว์ลูกค้าว่า LINE OA ของคลินิกจะหน้าตาแบบไหน

export type LineIcon = "calendar" | "tag" | "list" | "star" | "pin" | "chat";

export type LineReply = {
  text?: string;
  card?: { title: string; lines: string[]; button?: string };
};

export type RichMenuItem = { label: string; icon: LineIcon; reply: LineReply[] };

type Message = { id: number; from: "bot" | "user"; body: LineReply };

const ICONS: Record<LineIcon, string> = {
  calendar: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 7.5h.01",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  star: "M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3z",
  pin: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  chat: "M4 5h16v11H9l-5 4V5z",
};

function Icon({ name }: { name: LineIcon }) {
  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

function Bubble({ msg, avatar }: { msg: Message; avatar: string }) {
  const { text, card } = msg.body;
  if (msg.from === "user") {
    return (
      <div className="lcm-row lcm-row-user">
        <div className="lcm-bubble lcm-bubble-user">{text}</div>
      </div>
    );
  }
  return (
    <div className="lcm-row">
      <span className="lcm-avatar" aria-hidden="true">{avatar}</span>
      {card ? (
        <div className="lcm-card">
          <strong>{card.title}</strong>
          {card.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
          {card.button && <span className="lcm-card-btn">{card.button}</span>}
        </div>
      ) : (
        <div className="lcm-bubble">{text}</div>
      )}
    </div>
  );
}

export function LineChatMock({
  name,
  avatar,
  greeting,
  menu,
}: {
  name: string;
  avatar: string;
  greeting: LineReply[];
  menu: RichMenuItem[];
}) {
  const nextId = useRef(0);
  const make = (from: Message["from"], body: LineReply): Message => ({ id: nextId.current++, from, body });

  const [messages, setMessages] = useState<Message[]>(() => greeting.map((g) => make("bot", g)));
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const tap = (item: RichMenuItem) => {
    if (typing) return;
    setMessages((m) => [...m, make("user", { text: item.label })]);
    setTyping(true);
    timers.current.push(
      window.setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, ...item.reply.map((r) => make("bot", r))]);
      }, 700),
    );
  };

  return (
    <div className="lcm-phone" role="region" aria-label={`ตัวอย่างแชท LINE OA ของ ${name}`}>
      <div className="lcm-top">
        <span aria-hidden="true">‹</span>
        <strong>{name}</strong>
        <span className="lcm-official">Official</span>
      </div>

      <div className="lcm-chat" ref={chatRef} aria-live="polite">
        {messages.map((m) => (
          <Bubble key={m.id} msg={m} avatar={avatar} />
        ))}
        {typing && (
          <div className="lcm-row">
            <span className="lcm-avatar" aria-hidden="true">{avatar}</span>
            <div className="lcm-bubble lcm-typing" aria-label="กำลังพิมพ์">
              <i /> <i /> <i />
            </div>
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="lcm-menu">
          {menu.map((item) => (
            <button key={item.label} type="button" onClick={() => tap(item)}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      <button type="button" className="lcm-toggle" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
        เมนู {menuOpen ? "▾" : "▴"}
      </button>
    </div>
  );
}
