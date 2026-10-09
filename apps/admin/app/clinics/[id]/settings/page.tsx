import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listAllClinics } from "@repo/db/users";
import { requireStaff } from "@/lib/session";
import { ActionButton, ClinicForm } from "@/components/manage-forms";
import { StaffNav } from "@/components/staff-nav";
import { setClinicDisabledAction, updateClinicAction } from "../../../manage-actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ข้อมูลคลินิก" };

export default async function ClinicSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireStaff();
  const clinic = (await listAllClinics()).find((c) => c.id === id);
  if (!clinic) notFound();

  return (
    <div className="adm">
      <StaffNav user={user} current="clinics" />
      <main className="adm-main">
        <a href="/" className="adm-link">← คลินิกทั้งหมด</a>
        <div className="ca-badges">
          <h1 className="ca-h1">แก้ไขข้อมูลคลินิก</h1>
          {clinic.disabled && <span className="ca-badge" data-status="off">ปิดใช้งาน</span>}
        </div>
        <p className="adm-muted">รหัส {clinic.id} · เนื้อหาเว็บเก็บตามรหัสนี้ เปลี่ยนแม่แบบแล้วเนื้อหาที่แก้ไว้อาจไม่ตรงกับแม่แบบใหม่</p>

        <div className="adm-card">
          <ClinicForm action={updateClinicAction} clinic={clinic} />
        </div>

        <div className="adm-card">
          <h2 className="ca-h2">สถานะ</h2>
          <p className="adm-muted">
            {clinic.disabled
              ? "ปิดใช้งานอยู่: บัญชีคลินิกเข้าแก้เว็บนี้ไม่ได้ (เว็บคลินิกยังแสดงตามเดิม)"
              : "ใช้งานอยู่ ปิดแล้วบัญชีคลินิกจะเข้าแก้เว็บนี้ไม่ได้ เว็บคลินิกยังแสดงตามเดิม"}
          </p>
          <ActionButton
            key={String(clinic.disabled)}
            action={setClinicDisabledAction}
            fields={{ id: clinic.id, disabled: clinic.disabled ? "0" : "1" }}
            label={clinic.disabled ? "เปิดใช้งานคลินิก" : "ปิดใช้งานคลินิก"}
            confirm={clinic.disabled ? `เปิดใช้งาน ${clinic.name}?` : `ปิดใช้งาน ${clinic.name}? บัญชีคลินิกจะเข้าแก้ไม่ได้`}
            danger={!clinic.disabled}
          />
        </div>
      </main>
    </div>
  );
}
