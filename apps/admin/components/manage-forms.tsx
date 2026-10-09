"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { PLANS } from "@repo/db/plans";
import { TEMPLATE_OPTIONS } from "@/lib/template-list";
import type { ManageState } from "@/app/manage-actions";

type Action = (prev: ManageState, form: FormData) => Promise<ManageState>;

/** ส่งฟอร์มเอง (ไม่ให้ React ล้างฟอร์มตอน error) ถามยืนยันก่อนถ้ามี confirm */
function useManageForm(action: Action, opts: { confirm?: string; check?: (f: FormData) => string | null } = {}) {
  const [state, dispatch, pending] = useActionState<ManageState, FormData>(action, {});
  const [clientError, setClientError] = useState<string | null>(null);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const err = opts.check?.(data) ?? null;
    setClientError(err);
    if (err) return;
    if (opts.confirm && !window.confirm(opts.confirm)) return;
    startTransition(() => dispatch(data));
  };
  return { state, pending, onSubmit, error: clientError ?? state.error };
}

function Message({ error, ok }: { error?: string | null; ok?: string }) {
  if (error) return <p className="adm-error ca-msg" role="alert">{error}</p>;
  if (ok) return <p className="ca-ok ca-msg" role="status">{ok}</p>;
  return null;
}

/** รหัสผ่านชั่วคราว แสดงครั้งเดียว (มาจาก state ของ action เท่านั้น) */
export function TempPassword({ password, email }: { password: string; email?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="ca-temp" role="status">
      <p>
        รหัสผ่านชั่วคราว{email ? ` ของ ${email}` : ""}: <code className="ca-temp-code">{password}</code>
      </p>
      <button type="button" className="adm-btn adm-btn-outline" onClick={copy}>
        {copied ? "คัดลอกแล้ว" : "คัดลอก"}
      </button>
      <p className="adm-muted">ส่งให้ผู้ใช้ทาง LINE หรืออีเมล ระบบจะให้เปลี่ยนรหัสตอนเข้าครั้งแรก รหัสนี้จะไม่แสดงอีก</p>
    </div>
  );
}

/** ปุ่มเดียว + hidden field เช่น ปิด/เปิด รีเซ็ตรหัส ลบ */
export function ActionButton({
  action,
  fields,
  label,
  confirm,
  danger,
}: {
  action: Action;
  fields: Record<string, string>;
  label: string;
  confirm?: string;
  danger?: boolean;
}) {
  const { state, pending, onSubmit, error } = useManageForm(action, { confirm });
  return (
    <form onSubmit={onSubmit} className="ca-form">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button type="submit" className={`adm-btn ${danger ? "ca-btn-danger" : "adm-btn-outline"} ca-self-start`} disabled={pending}>
        {pending ? "กำลังทำรายการ..." : label}
      </button>
      <Message error={error} ok={state.password ? undefined : state.ok} />
      {state.password && <TempPassword password={state.password} email={state.email} />}
    </form>
  );
}

// ---------- คลินิก ----------

type ClinicValue = { id: string; name: string; package: string; domain: string | null; site_url: string; template: string | null };

export function ClinicForm({ action, clinic }: { action: Action; clinic?: ClinicValue }) {
  const create = !clinic;
  const ref = useRef<HTMLFormElement>(null);
  const { state, pending, onSubmit, error } = useManageForm(action);
  useEffect(() => {
    if (create && state.ok) ref.current?.reset();
  }, [create, state]);
  const p = create ? "new-clinic" : `clinic-${clinic.id}`;

  return (
    <form ref={ref} onSubmit={onSubmit} className="ca-form">
      {create ? (
        <div className="adm-field">
          <label htmlFor={`${p}-id`}>รหัสคลินิก (ใช้ในลิงก์)</label>
          <input id={`${p}-id`} name="id" type="text" required pattern="[a-z0-9][a-z0-9\-]*[a-z0-9]" minLength={2} maxLength={40} autoCapitalize="none" spellCheck={false} />
          <small>ตัวพิมพ์เล็ก a-z ตัวเลข และขีด - เช่น mira-skin เปลี่ยนภายหลังไม่ได้</small>
        </div>
      ) : (
        <input type="hidden" name="id" value={clinic.id} />
      )}
      <div className="adm-field">
        <label htmlFor={`${p}-name`}>ชื่อคลินิก</label>
        <input id={`${p}-name`} name="name" type="text" required defaultValue={clinic?.name} />
      </div>
      <div className="ca-grid2">
        <div className="adm-field">
          <label htmlFor={`${p}-package`}>แพ็กเกจ</label>
          <select id={`${p}-package`} name="package" required defaultValue={clinic?.package ?? ""}>
            {create && <option value="" disabled>เลือกแพ็กเกจ</option>}
            {PLANS.map((x) => (
              <option key={x} value={x}>{x}</option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label htmlFor={`${p}-template`}>แม่แบบเว็บ</label>
          <select id={`${p}-template`} name="template" required defaultValue={clinic ? (clinic.template ?? clinic.id) : ""}>
            {create && <option value="" disabled>เลือกแม่แบบ</option>}
            {TEMPLATE_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="adm-field">
        <label htmlFor={`${p}-site`}>ลิงก์เว็บคลินิก</label>
        <input id={`${p}-site`} name="site_url" type="url" required placeholder="https://" defaultValue={clinic?.site_url} />
      </div>
      <div className="adm-field">
        <label htmlFor={`${p}-domain`}>โดเมน (ไม่บังคับ)</label>
        <input id={`${p}-domain`} name="domain" type="text" placeholder="clinic.example" defaultValue={clinic?.domain ?? ""} autoCapitalize="none" spellCheck={false} />
      </div>
      <Message error={error} ok={state.ok} />
      <button type="submit" className="adm-btn adm-btn-primary ca-self-start" disabled={pending}>
        {pending ? "กำลังบันทึก..." : create ? "เพิ่มคลินิก" : "บันทึกข้อมูลคลินิก"}
      </button>
    </form>
  );
}

// ---------- ผู้ใช้ ----------

type UserValue = { id: number; email: string; name: string; role: "staff" | "clinic"; clinics: string[] };

export function UserForm({
  action,
  clinics,
  user,
  self,
}: {
  action: Action;
  clinics: { id: string; name: string }[];
  user?: UserValue;
  self?: boolean;
}) {
  const create = !user;
  const ref = useRef<HTMLFormElement>(null);
  const [role, setRole] = useState<"staff" | "clinic">(user?.role ?? "clinic");
  const { state, pending, onSubmit, error } = useManageForm(action, {
    check: (f) => (f.get("role") === "clinic" && f.getAll("clinics").length === 0 ? "บัญชีคลินิกต้องเลือกอย่างน้อย 1 คลินิก" : null),
  });
  useEffect(() => {
    if (create && state.password) {
      ref.current?.reset();
      setRole("clinic");
    }
  }, [create, state]);
  const p = create ? "new-user" : `user-${user.id}`;

  return (
    <form ref={ref} onSubmit={onSubmit} className="ca-form">
      {create ? (
        <div className="adm-field">
          <label htmlFor={`${p}-email`}>อีเมล</label>
          <input id={`${p}-email`} name="email" type="email" required autoComplete="off" />
        </div>
      ) : (
        <input type="hidden" name="id" value={user.id} />
      )}
      <div className="adm-field">
        <label htmlFor={`${p}-name`}>ชื่อ</label>
        <input id={`${p}-name`} name="name" type="text" required defaultValue={user?.name} />
      </div>
      <div className="adm-field">
        <label htmlFor={`${p}-role`}>บทบาท</label>
        <select id={`${p}-role`} name={self ? undefined : "role"} value={role} disabled={self} onChange={(e) => setRole(e.target.value as "staff" | "clinic")}>
          <option value="clinic">คลินิก (แก้ได้เฉพาะเว็บที่เลือก)</option>
          <option value="staff">ทีมงาน (เห็นและจัดการทุกอย่าง)</option>
        </select>
        {self && <input type="hidden" name="role" value={role} />}
        {self && <small>เปลี่ยนบทบาทของตัวเองไม่ได้</small>}
      </div>
      {role === "clinic" && (
        <fieldset className="ca-checks">
          <legend className="adm-label">คลินิกที่แก้ได้</legend>
          {clinics.map((c) => (
            <label key={c.id} className="adm-toggle">
              <input type="checkbox" name="clinics" value={c.id} defaultChecked={user?.clinics.includes(c.id)} />
              <span>{c.name} <span className="adm-muted">({c.id})</span></span>
            </label>
          ))}
        </fieldset>
      )}
      <Message error={error} ok={state.password ? undefined : state.ok} />
      {state.password && <TempPassword password={state.password} email={state.email} />}
      <button type="submit" className="adm-btn adm-btn-primary ca-self-start" disabled={pending}>
        {pending ? "กำลังบันทึก..." : create ? "สร้างบัญชี" : "บันทึก"}
      </button>
    </form>
  );
}
