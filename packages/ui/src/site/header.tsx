"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// children = เมนูย่อย (dropdown บนจอใหญ่, กดเปิดในเมนูมือถือ)
export type NavLink = { href: string; label: string; children?: NavLink[] };

// header ติดบน + เมนูมือถือ ใช้ร่วมกันทุกเว็บเดโมหลายหน้า
export function SiteHeader({
  brand,
  sub,
  nav,
  cta,
  langs,
}: {
  brand: string;
  sub?: string;
  nav: NavLink[];
  cta?: NavLink;
  langs?: string[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
    setOpenSub(null);
  }, [pathname]);

  // ปิดเมนูย่อยเมื่อกดนอกเมนูหรือกด Esc
  useEffect(() => {
    if (openSub === null) return;
    const onDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenSub(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenSub(null);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openSub]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sk-header">
      <div className="sk-container sk-header-inner">
        <Link href="/" className="sk-brand">
          {brand}
          {sub && <small>{sub}</small>}
        </Link>
        <button
          type="button"
          className="sk-burger"
          aria-expanded={open}
          aria-controls="sk-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "ปิด" : "เมนู"}
        </button>
        <nav ref={navRef} id="sk-nav" className={open ? "sk-nav is-open" : "sk-nav"} aria-label="เมนูหลัก">
          {nav.map((l, i) =>
            l.children?.length ? (
              <div key={i} className="sk-nav-item" data-open={openSub === i || undefined}>
                <div className="sk-nav-parent">
                  <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                    {l.label}
                  </Link>
                  <button
                    type="button"
                    className="sk-sub-toggle"
                    aria-expanded={openSub === i}
                    aria-controls={`sk-sub-${i}`}
                    aria-label={`เมนูย่อย ${l.label}`}
                    onClick={() => setOpenSub(openSub === i ? null : i)}
                  >
                    <span aria-hidden="true">▾</span>
                  </button>
                </div>
                <div id={`sk-sub-${i}`} className="sk-sub">
                  {l.children.map((c, j) => (
                    <Link key={j} href={c.href} aria-current={pathname === c.href ? "page" : undefined}>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={i} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ),
          )}
          {langs && (
            <span className="sk-langs" title="เดโมแสดงเฉพาะภาษาไทย">
              {langs.join(" / ")}
            </span>
          )}
          {cta && (
            <Link href={cta.href} className="sk-btn sk-btn-primary">
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
