"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="ca-form">
      <div className="adm-field">
        <label htmlFor="email">อีเมล</label>
        <input id="email" name="email" type="email" autoComplete="username" required />
      </div>
      <div className="adm-field">
        <label htmlFor="password">รหัสผ่าน</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state.error && (
        <p className="adm-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="adm-btn adm-btn-primary" disabled={pending}>
        {pending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
