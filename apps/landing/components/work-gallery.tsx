"use client";

// ระบบที่ทีมเคยร่วมพัฒนา: การ์ดมีภาพปก ภาพย่อ และกดเปิดดูภาพใหญ่ทีละภาพ (dialog ของเบราว์เซอร์ ปิดด้วย Esc ได้)

import { useEffect, useRef, useState } from "react";
import type { PastWork } from "@/app/content";

const src = (slug: string, i: number) => `/work/${slug}/${i + 1}.jpg`;

export function WorkGallery({ works }: { works: PastWork[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<{ w: number; i: number } | null>(null);

  const show = (w: number, i: number) => {
    setOpen({ w, i });
    dialog.current?.showModal();
  };
  const step = (d: number) =>
    setOpen((o) => (o ? { ...o, i: (o.i + d + works[o.w]!.images.length) % works[o.w]!.images.length } : o));

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setOpen(null);
    el.addEventListener("keydown", onKey);
    el.addEventListener("close", onClose);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("close", onClose);
    };
  });

  const cur = open ? works[open.w]! : null;

  return (
    <>
      <div className="work-grid">
        {works.map((w, wi) => (
          <article key={w.slug} className={w.featured ? "work-card is-featured" : "work-card"}>
            <button type="button" className="work-cover" onClick={() => show(wi, 0)} aria-label={`ดูภาพ ${w.name} (${w.images.length} ภาพ)`}>
              <img src={src(w.slug, 0)} alt={w.images[0]!.alt} loading="lazy" />
              {w.images.length > 1 && <span className="work-count">{w.images.length} ภาพ</span>}
            </button>
            {w.images.length > 1 && (
              <div className="work-thumbs">
                {w.images.slice(1, 5).map((im, i) => (
                  <button key={i} type="button" onClick={() => show(wi, i + 1)} aria-label={`ดูภาพ: ${im.alt}`}>
                    <img src={src(w.slug, i + 1)} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            <div className="work-info">
              <p className="work-kind">{w.kind}</p>
              <h3>{w.name}</h3>
              <p className="work-summary">{w.summary}</p>
              <p className="work-company">ร่วมพัฒนากับ {w.company}</p>
            </div>
          </article>
        ))}
      </div>

      <dialog ref={dialog} className="work-lightbox" aria-label={cur ? `ภาพ ${cur.name}` : "ภาพผลงาน"} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        {cur && open && (
          <figure>
            <img src={src(cur.slug, open.i)} alt={cur.images[open.i]!.alt} />
            <figcaption>
              <strong>{cur.name}</strong> · {cur.images[open.i]!.alt}
              <span>
                {open.i + 1} / {cur.images.length}
              </span>
            </figcaption>
          </figure>
        )}
        {cur && cur.images.length > 1 && (
          <>
            <button type="button" className="work-nav is-prev" onClick={() => step(-1)} aria-label="ภาพก่อนหน้า">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" className="work-nav is-next" onClick={() => step(1)} aria-label="ภาพถัดไป">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
        <button type="button" className="work-close" onClick={() => dialog.current?.close()} aria-label="ปิด">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </dialog>
    </>
  );
}
