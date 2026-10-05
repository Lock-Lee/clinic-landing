"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type NavLink = { href: string; label: string };

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

  useEffect(() => setOpen(false), [pathname]);

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
        <nav id="sk-nav" className={open ? "sk-nav is-open" : "sk-nav"} aria-label="เมนูหลัก">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
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
