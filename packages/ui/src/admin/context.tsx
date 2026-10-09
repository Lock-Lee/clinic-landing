"use client";

import { createContext, useContext, type ReactNode } from "react";

// ค่าที่ admin กลาง (apps/admin) ส่งลงไปให้ editor ของแต่ละเว็บ โดยไม่ต้องแก้ editor
// ไม่มี provider = หลังบ้านตัวอย่างในเว็บเดโมเอง (/admin, /api/admin, หน้าเข้าสู่ระบบจำลอง)
export type AdminHost = {
  /** route ที่ PUT/DELETE เนื้อหา */
  endpoint?: string;
  /** ลิงก์ "ดูหน้าเว็บ" */
  previewHref?: string;
  /** ข้ามหน้าเข้าสู่ระบบจำลอง เพราะ login จริงแล้ว */
  authed?: boolean;
  /** ปุ่มเพิ่มบนแถบบน เช่น กลับไปเลือกคลินิก ออกจากระบบ */
  topActions?: ReactNode;
  /** ชื่อแพ็กเกจจริงของคลินิก (แทนชื่อที่ editor ใส่ไว้) */
  packageName?: string;
  /** route อัปโหลดรูป (multipart "file" → { url }) */
  uploadEndpoint?: string;
  /** แท็บที่แพ็กเกจนี้แก้ได้ แท็บอื่นแสดงเป็นล็อก ไม่ระบุ = แก้ได้ทุกแท็บ */
  allowedSections?: string[];
  /** ข้อความบนแท็บที่ล็อก เช่น "มีในแพ็กเกจ Premium" */
  lockedReason?: (sectionId: string) => string;
};

const AdminHostContext = createContext<AdminHost>({});

export function AdminHostProvider({ value, children }: { value: AdminHost; children: ReactNode }) {
  return <AdminHostContext.Provider value={value}>{children}</AdminHostContext.Provider>;
}

export const useAdminHost = () => useContext(AdminHostContext);
