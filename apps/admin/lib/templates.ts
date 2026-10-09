import type { ComponentType } from "react";
import type { Clinic } from "@repo/db/auth";
import { isTemplateId, type TemplateId } from "./template-list";
import { AdminEditor as StarterEditor } from "clinic-starter-demo/admin-editor";
import { editableDefaults as starterDefaults } from "clinic-starter-demo/content";
import { AdminEditor as StandardEditor } from "clinic-demo/admin-editor";
import { editableDefaults as standardDefaults } from "clinic-demo/content";
import { AdminEditor as PremiumEditor } from "clinic-full-demo/admin-editor";
import { editableDefaults as premiumDefaults } from "clinic-full-demo/content";

// template ของเว็บ = editor + เนื้อหาเริ่มต้น จากแอปเดโมแต่ละตัว
type Editor = ComponentType<{ initial: object; defaults: object }>;
export type Template = { Editor: Editor; defaults: object };

const template = <T extends object>(Editor: ComponentType<{ initial: T; defaults: T }>, defaults: T): Template => ({
  Editor: Editor as unknown as Editor,
  defaults,
});

const TEMPLATES: Record<TemplateId, Template> = {
  starter: template(StarterEditor, starterDefaults),
  standard: template(StandardEditor, standardDefaults),
  premium: template(PremiumEditor, premiumDefaults),
};

/** template ของคลินิก: clinic.template ?? clinic.id (คลินิกใหม่ใช้แม่แบบเดิมซ้ำได้ เนื้อหายังเก็บตาม clinic.id) */
export function templateFor(clinic: Pick<Clinic, "id" | "template">): Template | null {
  const id = clinic.template ?? clinic.id;
  return isTemplateId(id) ? TEMPLATES[id] : null;
}

export { TEMPLATE_OPTIONS, templateLabel } from "./template-list";
