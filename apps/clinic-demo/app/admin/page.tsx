import type { Metadata } from "next";
import { getContent } from "@repo/db";
import { SITE_ID, editableDefaults } from "../content";
import { AdminEditor } from "./editor";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "หลังบ้าน", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const content = await getContent(SITE_ID, editableDefaults);
  return <AdminEditor initial={content} defaults={editableDefaults} />;
}
