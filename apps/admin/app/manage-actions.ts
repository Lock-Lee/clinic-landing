"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { Role } from "@repo/db/auth";
import {
  createClinic,
  createUser,
  deleteUser,
  ManageError,
  resetUserPassword,
  setClinicDisabled,
  setUserDisabled,
  updateClinic,
  updateUser,
} from "@repo/db/users";
import { staffActor } from "@/lib/session";
import { isTemplateId } from "@/lib/template-list";

// จัดการผู้ใช้/คลินิก: ทีมงาน (staff) เท่านั้น เช็กสิทธิ์ซ้ำทุก action
// รหัสชั่วคราวคืนผ่าน state ของ action เท่านั้น (ไม่ใส่ URL/cookie) แสดงครั้งเดียว

export type ManageState = { error?: string; ok?: string; password?: string; email?: string };

const DENIED: ManageState = { error: "ไม่มีสิทธิ์ทำรายการนี้" };

async function attempt(fn: () => Promise<ManageState>): Promise<ManageState> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ManageError) return { error: e.message };
    console.error(e);
    return { error: "ทำรายการไม่สำเร็จ ลองใหม่อีกครั้ง" };
  }
}

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

// ---------- คลินิก ----------

function clinicInput(form: FormData) {
  const template = text(form, "template");
  if (!isTemplateId(template)) throw new ManageError("กรุณาเลือกแม่แบบเว็บ");
  return {
    name: text(form, "name"),
    package: text(form, "package"),
    domain: text(form, "domain") || null,
    site_url: text(form, "site_url"),
    template,
  };
}

export async function createClinicAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const id = text(form, "id").toLowerCase();
    await createClinic(actor, { id, ...clinicInput(form) });
    revalidatePath("/");
    return { ok: `เพิ่มคลินิก ${id} แล้ว` };
  });
}

export async function updateClinicAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const id = text(form, "id");
    await updateClinic(actor, id, clinicInput(form));
    revalidatePath("/");
    revalidatePath(`/clinics/${id}/settings`);
    return { ok: "บันทึกข้อมูลคลินิกแล้ว" };
  });
}

export async function setClinicDisabledAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const id = text(form, "id");
    const disabled = text(form, "disabled") === "1";
    await setClinicDisabled(actor, id, disabled);
    revalidatePath("/");
    revalidatePath(`/clinics/${id}/settings`);
    return { ok: disabled ? "ปิดใช้งานคลินิกแล้ว" : "เปิดใช้งานคลินิกแล้ว" };
  });
}

// ---------- ผู้ใช้ ----------

function userInput(form: FormData) {
  const role = (text(form, "role") || "clinic") as Role;
  // ทีมงานเห็นทุกคลินิกอยู่แล้ว ไม่ต้องผูกคลินิก
  const clinics = role === "clinic" ? form.getAll("clinics").map(String).filter(Boolean) : [];
  return { name: text(form, "name"), role, clinics };
}

export async function createUserAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const email = text(form, "email").toLowerCase();
    const { password } = await createUser(actor, { email, ...userInput(form) });
    revalidatePath("/users");
    return { ok: `สร้างบัญชี ${email} แล้ว`, password, email };
  });
}

export async function updateUserAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const id = Number(text(form, "id"));
    await updateUser(actor, id, userInput(form));
    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { ok: "บันทึกแล้ว" };
  });
}

export async function resetPasswordAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const id = Number(text(form, "id"));
    if (id === actor.id) throw new ManageError("เปลี่ยนรหัสของตัวเองที่หน้าเปลี่ยนรหัสผ่าน");
    const password = await resetUserPassword(actor, id);
    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { ok: "รีเซ็ตรหัสผ่านแล้ว", password, email: text(form, "email") };
  });
}

export async function setUserDisabledAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  return attempt(async () => {
    const id = Number(text(form, "id"));
    const disabled = text(form, "disabled") === "1";
    await setUserDisabled(actor, id, disabled);
    revalidatePath("/users");
    revalidatePath(`/users/${id}`);
    return { ok: disabled ? "ปิดบัญชีแล้ว" : "เปิดบัญชีแล้ว" };
  });
}

export async function deleteUserAction(_prev: ManageState, form: FormData): Promise<ManageState> {
  const actor = await staffActor();
  if (!actor) return DENIED;
  const result = await attempt(async () => {
    await deleteUser(actor, Number(text(form, "id")));
    revalidatePath("/users");
    return { ok: "ลบแล้ว" };
  });
  // redirect ต้องอยู่นอก try
  if (result.error) return result;
  redirect("/users");
}
