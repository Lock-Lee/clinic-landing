"use client";

import { AdminShell, ImageField, ListEditor, TextField, useDraft } from "@repo/ui/admin";
import type { EditableContent } from "../content";

// หลังบ้านแพ็ก Starter (ส่วนเสริม): แก้ข้อมูลคลินิก ข้อความหน้าแรก รูป และบริการกับราคา
export function AdminEditor({ initial, defaults }: { initial: EditableContent; defaults: EditableContent }) {
  const { draft, update, save, reset, dirty } = useDraft({ initial, defaults });
  const { clinic, hero, services } = draft;
  const setClinic = (patch: Partial<EditableContent["clinic"]>) => update("clinic", { ...clinic, ...patch });
  const setHero = (patch: Partial<EditableContent["hero"]>) => update("hero", { ...hero, ...patch });

  return (
    <AdminShell
      siteName={clinic.name}
      packageName="Starter + หลังบ้าน"
      dirty={dirty}
      onSave={save}
      onReset={reset}
      sections={[
        {
          id: "hero",
          label: "หน้าแรก",
          render: () => (
            <div className="adm-card">
              <TextField label="หัวข้อใหญ่" value={hero.title} onChange={(title) => setHero({ title })} />
              <TextField label="ข้อความใต้หัวข้อ" multiline value={hero.lead} onChange={(lead) => setHero({ lead })} />
              <ImageField label="รูปหน้าแรก" value={hero.image} onChange={(image) => setHero({ image })} />
            </div>
          ),
        },
        {
          id: "services",
          label: "บริการและราคา",
          render: () => (
            <ListEditor
              items={services}
              onChange={(v) => update("services", v)}
              newItem={() => ({ name: "บริการใหม่", detail: "", price: "เริ่มต้น " })}
              itemTitle={(s) => `${s.name} · ${s.price}`}
              addLabel="เพิ่มบริการ"
              renderItem={(s, set) => (
                <>
                  <TextField label="ชื่อบริการ" value={s.name} onChange={(name) => set({ name })} />
                  <TextField label="รายละเอียด" multiline value={s.detail} onChange={(detail) => set({ detail })} />
                  <TextField label="ราคา (บาท)" value={s.price} onChange={(price) => set({ price })} hint='เช่น "เริ่มต้น 990"' />
                </>
              )}
            />
          ),
        },
        {
          id: "clinic",
          label: "ข้อมูลคลินิก",
          render: () => (
            <div className="adm-card">
              <TextField label="ชื่อคลินิก (อังกฤษ)" value={clinic.name} onChange={(name) => setClinic({ name })} />
              <TextField label="ชื่อคลินิก (ไทย)" value={clinic.nameTh} onChange={(nameTh) => setClinic({ nameTh })} />
              <TextField label="สโลแกน" value={clinic.tagline} onChange={(tagline) => setClinic({ tagline })} />
              <TextField
                label="เบอร์โทร"
                value={clinic.phone}
                onChange={(phone) => setClinic({ phone, phoneHref: `tel:${phone.replace(/[^0-9+]/g, "")}` })}
              />
              <TextField label="LINE ID" value={clinic.lineId} onChange={(lineId) => setClinic({ lineId })} />
              <TextField label="ที่อยู่" multiline value={clinic.address} onChange={(address) => setClinic({ address })} />
              <TextField label="เวลาเปิด" value={clinic.hours} onChange={(hours) => setClinic({ hours })} />
            </div>
          ),
        },
      ]}
    />
  );
}
