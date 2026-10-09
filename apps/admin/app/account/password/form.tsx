"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { changePasswordAction, type PasswordState } from "../../actions";

export function PasswordForm({ minLength: MIN_PASSWORD }: { minLength: number }) {
  const [state, action, pending] = useActionState<PasswordState, FormData>(changePasswordAction, {});
  const [clientError, setClientError] = useState<string | null>(null);

  // เช็กฝั่ง client ก่อน (server เช็กซ้ำ) และไม่ให้ฟอร์มล้างตอน error
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = String(data.get("next") ?? "");
    const err =
      next.length < MIN_PASSWORD
        ? `รหัสผ่านใหม่ต้องยาวอย่างน้อย ${MIN_PASSWORD} ตัว`
        : next !== data.get("confirm")
          ? "ยืนยันรหัสผ่านใหม่ไม่ตรงกัน"
          : null;
    setClientError(err);
    if (!err) startTransition(() => action(data));
  };
  const error = clientError ?? state.error;

  return (
    <form onSubmit={onSubmit} className="ca-form">
      <div className="adm-field">
        <label htmlFor="current">รหัสผ่านเดิม</label>
        <input id="current" name="current" type="password" autoComplete="current-password" required />
        <small>เข้าครั้งแรกให้ใช้รหัสชั่วคราวที่ทีมงานส่งให้</small>
      </div>
      <div className="adm-field">
        <label htmlFor="next">รหัสผ่านใหม่</label>
        <input id="next" name="next" type="password" autoComplete="new-password" minLength={MIN_PASSWORD} required />
        <small>อย่างน้อย {MIN_PASSWORD} ตัว</small>
      </div>
      <div className="adm-field">
        <label htmlFor="confirm">ยืนยันรหัสผ่านใหม่</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={MIN_PASSWORD} required />
      </div>
      {error && (
        <p className="adm-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
        {pending ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
      </button>
    </form>
  );
}
