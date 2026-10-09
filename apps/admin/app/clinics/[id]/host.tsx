"use client";

import type { ReactNode } from "react";
import { AdminHostProvider } from "@repo/ui/admin";
import { minPlanFor } from "@repo/db/plans";

// ส่ง endpoint/สิทธิ์ของคลินิกนี้ลงไปให้ editor ของเดโม (ฟังก์ชันต้องสร้างฝั่ง client)
export function EditorHost({
  clinicId,
  previewHref,
  packageName,
  allowedSections,
  topActions,
  children,
}: {
  clinicId: string;
  previewHref: string;
  packageName: string;
  allowedSections: string[];
  topActions: ReactNode;
  children: ReactNode;
}) {
  return (
    <AdminHostProvider
      value={{
        endpoint: `/api/clinics/${clinicId}/content`,
        uploadEndpoint: `/api/clinics/${clinicId}/upload`,
        previewHref,
        packageName,
        authed: true,
        topActions,
        allowedSections,
        lockedReason: (id) => `มีในแพ็กเกจ ${minPlanFor(id) ?? "ที่สูงกว่า"} · ติดต่อทีมงานเพื่ออัปเกรด`,
      }}
    >
      {children}
    </AdminHostProvider>
  );
}
