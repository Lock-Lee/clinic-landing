"use client";

import { useState, type FormEvent } from "react";

export type FormField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

// ฟอร์มเดโม ไม่ส่งข้อมูลไปที่ไหน กดส่งแล้วแสดงข้อความยืนยันอย่างเดียว
export function DemoForm({
  fields,
  submitLabel,
  doneText,
  consent,
}: {
  fields: FormField[];
  submitLabel: string;
  doneText: string;
  consent?: string;
}) {
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDone(true);
  };

  if (done) {
    return (
      <div className="sk-form-done" role="status">
        <strong>{doneText}</strong>
        <span className="sk-muted">นี่คือเว็บเดโม ข้อมูลไม่ได้ถูกส่งหรือบันทึกไว้ที่ใด</span>
        <button type="button" className="sk-btn sk-btn-outline" onClick={() => setDone(false)}>
          กรอกใหม่
        </button>
      </div>
    );
  }

  return (
    <form className="sk-form" onSubmit={onSubmit}>
      {fields.map((f) => (
        <label key={f.name} className={f.type === "textarea" ? "sk-field sk-field-wide" : "sk-field"}>
          <span>
            {f.label}
            {f.required && " *"}
          </span>
          {f.type === "textarea" ? (
            <textarea name={f.name} rows={4} required={f.required} />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} defaultValue="">
              <option value="" disabled>
                เลือก
              </option>
              {f.options?.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ) : (
            <input name={f.name} type={f.type ?? "text"} required={f.required} />
          )}
        </label>
      ))}
      {consent && (
        <label className="sk-consent">
          <input type="checkbox" required /> <span>{consent}</span>
        </label>
      )}
      <button type="submit" className="sk-btn sk-btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}
