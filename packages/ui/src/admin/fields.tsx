"use client";

import { useId, useState, type ReactNode } from "react";
import { useAdminHost } from "./context";

export function TextField({
  label,
  value,
  onChange,
  hint,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  multiline?: boolean;
}) {
  const id = useId();
  return (
    <div className="adm-field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && <small>{hint}</small>}
    </div>
  );
}

// ย่อรูปให้กว้างไม่เกิน maxWidth ก่อนอัปโหลด ไฟล์เล็กลง เว็บโหลดเร็วขึ้น
function resizeImage(file: File, maxWidth = 1600): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("ย่อรูปไม่สำเร็จ"))), "image/jpeg", 0.82);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("อ่านรูปไม่ได้"));
    };
    img.src = url;
  });
}

// อัปโหลดไปที่เก็บรูป (S3) ผ่าน route ของแอป ได้ URL กลับมาเก็บในเนื้อหา
async function uploadImage(file: File, endpoint: string): Promise<string> {
  const body = new FormData();
  body.append("file", file.type === "image/gif" ? file : new File([await resizeImage(file)], "image.jpg", { type: "image/jpeg" }));
  const res = await fetch(endpoint, { method: "POST", body });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) throw new Error(data?.error ?? "อัปโหลดไม่สำเร็จ");
  return data.url;
}

export function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const host = useAdminHost();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="adm-field">
      <span className="adm-label">{label}</span>
      <div className="adm-image">
        {value ? <img src={value} alt="" /> : <div className="adm-image-empty">ยังไม่มีรูป</div>}
        <div className="adm-image-actions">
          <label htmlFor={id} className="adm-btn adm-btn-outline" aria-disabled={busy}>
            {busy ? "กำลังอัปโหลด..." : value ? "เปลี่ยนรูป" : "อัปโหลดรูป"}
          </label>
          <input
            id={id}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="adm-sr-only"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              setError("");
              try {
                onChange(await uploadImage(file, host.uploadEndpoint ?? "/api/admin/upload"));
              } catch (err) {
                setError(err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ");
              } finally {
                setBusy(false);
                e.target.value = "";
              }
            }}
          />
          {value && (
            <button type="button" className="adm-btn adm-btn-ghost" onClick={() => onChange("")}>
              ลบรูป
            </button>
          )}
        </div>
      </div>
      {error && <small className="adm-error" role="alert">{error}</small>}
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="adm-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

// รายการที่เพิ่ม ลบ เลื่อนลำดับได้ เช่น โปรโมชัน รีวิว บริการ
export function ListEditor<T>({
  items,
  onChange,
  newItem,
  itemTitle,
  addLabel,
  moreAdds,
  renderItem,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  itemTitle: (item: T, index: number) => string;
  addLabel: string;
  /** ปุ่มเพิ่มรายการแบบอื่น เช่น "+ รูป" รายการที่เพิ่มจะเปิดให้แก้ทันที */
  moreAdds?: { label: string; make: () => T }[];
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const move = (from: number, to: number) => {
    const next = items.slice();
    const [it] = next.splice(from, 1);
    next.splice(to, 0, it as T);
    onChange(next);
    setOpen(to);
  };

  return (
    <div className="adm-list">
      {items.map((item, i) => (
        <div key={i} className="adm-list-item" data-open={open === i || undefined}>
          <div className="adm-list-head">
            <button type="button" className="adm-list-title" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              {itemTitle(item, i) || "(ยังไม่มีชื่อ)"}
            </button>
            <div className="adm-list-tools">
              <button type="button" aria-label="เลื่อนขึ้น" disabled={i === 0} onClick={() => move(i, i - 1)}>↑</button>
              <button type="button" aria-label="เลื่อนลง" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}>↓</button>
              <button
                type="button"
                aria-label="ลบ"
                className="adm-danger"
                onClick={() => {
                  if (!window.confirm(`ลบ "${itemTitle(item, i)}" ?`)) return;
                  onChange(items.filter((_, j) => j !== i));
                  setOpen(null);
                }}
              >
                ✕
              </button>
            </div>
          </div>
          {open === i && (
            <div className="adm-list-body">
              {renderItem(item, (patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it))))}
            </div>
          )}
        </div>
      ))}
      <div className="adm-adds">
        {[{ label: addLabel, make: newItem }, ...(moreAdds ?? [])].map((a) => (
          <button
            key={a.label}
            type="button"
            className="adm-btn adm-btn-outline"
            onClick={() => {
              onChange([...items, a.make()]);
              setOpen(items.length);
            }}
          >
            + {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
