"use client";

import { AdminShell, ImageField, ListEditor, TextField, useDraft } from "@repo/ui/admin";
import type { EditableContent } from "../content";

// หลังบ้านแพ็ก Standard: แก้โปรโมชัน ข้อความและรูปหน้าแรก บริการ รีวิว และข้อมูลคลินิก
export function AdminEditor({ initial, defaults }: { initial: EditableContent; defaults: EditableContent }) {
  const { draft, update, save, reset, dirty } = useDraft({ initial, defaults });
  const { clinic, hero, services, promotions, reviews } = draft;
  const setClinic = (patch: Partial<EditableContent["clinic"]>) => update("clinic", { ...clinic, ...patch });
  const setHero = (patch: Partial<EditableContent["hero"]>) => update("hero", { ...hero, ...patch });

  return (
    <AdminShell
      siteName={clinic.name}
      packageName="Standard"
      dirty={dirty}
      onSave={save}
      onReset={reset}
      sections={[
        {
          id: "promotions",
          label: "โปรโมชัน",
          render: () => (
            <ListEditor
              items={promotions}
              onChange={(v) => update("promotions", v)}
              newItem={() => ({ name: "โปรใหม่", before: "", now: "", note: "" })}
              itemTitle={(p) => `${p.name} · ${p.now} บาท`}
              addLabel="เพิ่มโปรโมชัน"
              renderItem={(p, set) => (
                <>
                  <TextField label="ชื่อโปร" value={p.name} onChange={(name) => set({ name })} />
                  <TextField label="ราคาปกติ (บาท)" value={p.before} onChange={(before) => set({ before })} hint='เช่น "5,900" จะแสดงขีดฆ่า' />
                  <TextField label="ราคาโปร (บาท)" value={p.now} onChange={(now) => set({ now })} />
                  <TextField label="เงื่อนไข" value={p.note} onChange={(note) => set({ note })} hint='เช่น "เฉพาะลูกค้าใหม่ ถึง 31 ต.ค."' />
                </>
              )}
            />
          ),
        },
        {
          id: "hero",
          label: "หน้าแรก",
          render: () => (
            <>
              <div className="adm-card">
                <TextField label="หัวข้อใหญ่ บรรทัดที่ 1" value={hero.titleLine1} onChange={(titleLine1) => setHero({ titleLine1 })} />
                <TextField label="หัวข้อใหญ่ บรรทัดที่ 2 (สีเน้น)" value={hero.titleLine2} onChange={(titleLine2) => setHero({ titleLine2 })} />
                <TextField label="ข้อความใต้หัวข้อ" multiline value={hero.description} onChange={(description) => setHero({ description })} />
              </div>
              <ListEditor
                items={hero.images.map((src) => ({ src }))}
                onChange={(v) => setHero({ images: v.map((x) => x.src) })}
                newItem={() => ({ src: "" })}
                itemTitle={(_, i) => `รูปแถบเลื่อนที่ ${i + 1}`}
                addLabel="เพิ่มรูป"
                renderItem={(img, set) => <ImageField label="รูป" value={img.src} onChange={(src) => set({ src })} />}
              />
            </>
          ),
        },
        {
          id: "services",
          label: "บริการ",
          render: () => (
            <ListEditor
              items={services}
              onChange={(v) => update("services", v)}
              newItem={() => ({ name: "บริการใหม่", image: "", detail: "", price: "เริ่มต้น " })}
              itemTitle={(s) => `${s.name} · ${s.price}`}
              addLabel="เพิ่มบริการ"
              renderItem={(s, set) => (
                <>
                  <TextField label="ชื่อบริการ" value={s.name} onChange={(name) => set({ name })} />
                  <TextField label="รายละเอียด" multiline value={s.detail} onChange={(detail) => set({ detail })} />
                  <TextField label="ราคา (บาท)" value={s.price} onChange={(price) => set({ price })} hint='เช่น "เริ่มต้น 2,900"' />
                  <ImageField label="รูปบริการ" value={s.image} onChange={(image) => set({ image })} />
                </>
              )}
            />
          ),
        },
        {
          id: "reviews",
          label: "รีวิว",
          render: () => (
            <ListEditor
              items={reviews}
              onChange={(v) => update("reviews", v)}
              newItem={() => ({ name: "คุณ", service: "", text: "" })}
              itemTitle={(r) => `${r.name} · ${r.service}`}
              addLabel="เพิ่มรีวิว"
              renderItem={(r, set) => (
                <>
                  <TextField label="ชื่อผู้รีวิว" value={r.name} onChange={(name) => set({ name })} />
                  <TextField label="บริการที่ใช้" value={r.service} onChange={(service) => set({ service })} />
                  <TextField label="ข้อความรีวิว" multiline value={r.text} onChange={(text) => set({ text })} />
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
