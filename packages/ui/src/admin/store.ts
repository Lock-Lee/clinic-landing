"use client";

import { useCallback, useState } from "react";
import { useAdminHost } from "./context";

// สำเนาแก้ไขในหน้า admin: แก้ได้เรื่อยๆ แล้วกดบันทึกทีเดียว ส่งไปเก็บใน Postgres ผ่าน route ของแอป
// initial = เนื้อหาปัจจุบันที่หน้า admin (server component) อ่านจาก getContent()
export function useDraft<T extends object>({
  initial,
  defaults,
  endpoint: endpointProp,
}: {
  initial: T;
  defaults: T;
  endpoint?: string;
}) {
  const host = useAdminHost();
  const endpoint = endpointProp ?? host.endpoint ?? "/api/admin";
  const [draft, setDraft] = useState<T>(initial);
  const [dirty, setDirty] = useState(false);

  const update = useCallback(<K extends keyof T>(k: K, v: T[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  }, []);

  const request = async (init: RequestInit) => {
    const res = await fetch(endpoint, init);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? "บันทึกไม่สำเร็จ");
    }
  };

  const save = useCallback(async () => {
    await request({ method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, endpoint]);

  const reset = useCallback(async () => {
    await request({ method: "DELETE" });
    setDraft(defaults);
    setDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults, endpoint]);

  return { draft, update, save, reset, dirty };
}
