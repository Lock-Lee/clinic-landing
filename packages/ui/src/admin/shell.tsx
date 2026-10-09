"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useAdminHost } from "./context";

export type AdminSection = { id: string; label: string; render: () => ReactNode };

// โครงหน้าหลังบ้านตัวอย่าง: หน้าเข้าสู่ระบบจำลอง + เมนูหมวด + แถบบันทึก
export function AdminShell({
  siteName,
  packageName,
  sections,
  dirty,
  onSave,
  onReset,
  previewHref: previewProp,
}: {
  siteName: string;
  /** ชื่อแพ็กเกจที่หลังบ้านนี้เป็นตัวอย่าง เช่น "Standard" */
  packageName: string;
  sections: AdminSection[];
  dirty: boolean;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
  previewHref?: string;
}) {
  const host = useAdminHost();
  const plan = host.packageName ?? packageName;
  const previewHref = host.previewHref ?? previewProp ?? "/";
  const [demoAuthed, setAuthed] = useState(false);
  const authed = host.authed || demoAuthed;
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>, doneText: string) => {
    setBusy(true);
    try {
      await action();
      setToast({ text: doneText });
    } catch (e) {
      setToast({ text: e instanceof Error ? e.message : "บันทึกไม่สำเร็จ", error: true });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    try {
      setAuthed(window.sessionStorage.getItem("demo-admin:authed") === "1");
    } catch {
      // ไม่มี storage ก็ให้กดเข้าใหม่ทุกครั้ง
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  if (!authed) {
    return (
      <div className="adm adm-login">
        <div className="adm-login-card">
          <p className="adm-eyebrow">หลังบ้านตัวอย่าง · แพ็กเกจ {plan}</p>
          <h1>{siteName}</h1>
          <p className="adm-muted">
            ของจริงคลินิกจะได้ชื่อผู้ใช้และรหัสผ่านของตัวเอง เดโมนี้กดเข้าได้เลย สิ่งที่แก้จะบันทึกลงฐานข้อมูลและแสดงบนหน้าเว็บทันที กด "คืนค่าเริ่มต้น" เพื่อล้างได้ทุกเมื่อ
          </p>
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            onClick={() => {
              try {
                window.sessionStorage.setItem("demo-admin:authed", "1");
              } catch {
                // ignore
              }
              setAuthed(true);
            }}
          >
            เข้าสู่หลังบ้านตัวอย่าง
          </button>
          <a href={previewHref} className="adm-link">← กลับไปหน้าเว็บ</a>
        </div>
      </div>
    );
  }

  const locked = (id: string) => !!host.allowedSections && !host.allowedSections.includes(id);
  // เปิดมาที่แท็บแรกที่แก้ได้
  const current = sections.find((s) => s.id === active && !locked(s.id)) ?? sections.find((s) => s.id === active) ?? sections[0];

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-inner">
          <div className="adm-brand">
            <strong>{siteName}</strong>
            <span>หลังบ้าน · แพ็กเกจ {plan}</span>
          </div>
          <div className="adm-top-actions">
            <a href={previewHref} target="_blank" rel="noopener" className="adm-btn adm-btn-ghost">
              ดูหน้าเว็บ ↗
            </a>
            {host.topActions}
          </div>
        </div>
        <nav className="adm-tabs" aria-label="หมวดที่แก้ได้">
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-current={s.id === current?.id ? "page" : undefined}
              data-locked={locked(s.id) || undefined}
              onClick={() => setActive(s.id)}
            >
              {locked(s.id) && <span aria-label="ล็อก">🔒 </span>}
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="adm-main">
        <h2>{current?.label}</h2>
        {current && locked(current.id) ? (
          <div className="adm-card adm-locked">
            <strong>🔒 ส่วนนี้ยังไม่อยู่ในแพ็กเกจของคุณ</strong>
            <p className="adm-muted">{host.lockedReason?.(current.id) ?? "ติดต่อทีมงานเพื่ออัปเกรดแพ็กเกจ"}</p>
          </div>
        ) : (
          current?.render()
        )}
      </main>

      <div className="adm-savebar" data-dirty={dirty || undefined}>
        <span>{dirty ? "มีการแก้ไขที่ยังไม่บันทึก" : "บันทึกแล้ว"}</span>
        <div className="adm-savebar-actions">
          <button
            type="button"
            className="adm-btn adm-btn-ghost"
            disabled={busy}
            onClick={() => {
              if (!window.confirm("ล้างทุกอย่างที่แก้ กลับไปเป็นเนื้อหาเริ่มต้น?")) return;
              void run(onReset, "กลับเป็นเนื้อหาเริ่มต้นแล้ว");
            }}
          >
            คืนค่าเริ่มต้น
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            disabled={!dirty || busy}
            onClick={() => void run(onSave, "บันทึกแล้ว เปิดหน้าเว็บเพื่อดูผลได้เลย")}
          >
            {busy ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>

      {toast && (
        <div className="adm-toast" role="status" data-error={toast.error || undefined}>
          {toast.text}
        </div>
      )}
    </div>
  );
}

// ปุ่มลอยบนหน้าเว็บเดโม ชวนลองเข้าหลังบ้าน
export function AdminFab({ href = "/admin", label = "ลองแก้เว็บนี้เอง" }: { href?: string; label?: string }) {
  return (
    <a href={href} className="adm-fab">
      ✎ {label}
    </a>
  );
}
