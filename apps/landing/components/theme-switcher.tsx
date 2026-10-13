"use client";

// ปุ่มเปลี่ยนชุดสีมงคลในหัวเว็บ สีที่เลือกจำไว้ในเครื่องผู้ชม (localStorage) และตั้งก่อนวาดหน้าแรกด้วยสคริปต์ใน layout.tsx

import { useEffect, useRef, useState } from "react";

export const THEME_KEY = "hc-theme";

// swatch: [ฟ้า/พื้น, สีหลัก, ทอง] ให้ตรงกับ token ใน globals.css
const themes = [
  { id: "sky", name: "ท้องฟ้าชมพู", note: "นุ่ม ละมุน", swatch: ["#a9b8e8", "#7a2150", "#f3c6da"] },
  { id: "hamcache", name: "HamCache", note: "สีโลโก้", swatch: ["#fbe6e1", "#e8857a", "#3fc2a2"] },
  { id: "purple", name: "ม่วงทอง", note: "ความสำเร็จ", swatch: ["#e3d6f3", "#5b2a86", "#c79a33"] },
  { id: "green", name: "เขียวทอง", note: "โชคลาภ การค้า", swatch: ["#d6ece1", "#0f5c4a", "#b8892a"] },
  { id: "red", name: "แดงทอง", note: "เฮง ค้าขายรุ่ง", swatch: ["#fadccf", "#a3182b", "#c99227"] },
  { id: "blue", name: "ฟ้าขาวทอง", note: "สงบ บริสุทธิ์", swatch: ["#d5e4f7", "#2f5d9e", "#b8913a"] },
] as const;

type ThemeId = (typeof themes)[number]["id"];

function applyTheme(id: ThemeId) {
  const root = document.documentElement;
  if (id === "sky") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", id);
  try {
    localStorage.setItem(THEME_KEY, id);
  } catch {}
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ThemeId>("sky");
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent((document.documentElement.getAttribute("data-theme") as ThemeId | null) ?? "sky");
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="theme-switch">
      <button
        type="button"
        className="theme-switch-btn"
        aria-label="เปลี่ยนสีเว็บ"
        aria-expanded={open}
        aria-controls="theme-switch-menu"
        onClick={() => setOpen((v) => !v)}
      />
      {open && (
        <div id="theme-switch-menu" className="theme-switch-menu" role="group" aria-label="ชุดสี">
          <p>เลือกชุดสีมงคล</p>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              className="theme-switch-item"
              aria-pressed={current === t.id}
              onClick={() => {
                applyTheme(t.id);
                setCurrent(t.id);
              }}
            >
              <span
                className="theme-switch-swatch"
                style={{ background: `conic-gradient(${t.swatch[0]} 0 40%, ${t.swatch[1]} 0 75%, ${t.swatch[2]} 0)` }}
                aria-hidden="true"
              />
              <span>
                {t.name}
                <span className="theme-switch-note">{t.note}</span>
              </span>
              {current === t.id && (
                <svg className="theme-switch-check" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
