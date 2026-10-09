import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@repo/db";
import { getClinicFor, listClinics } from "@repo/db/auth";
import { allowedKeys, requireUser } from "@/lib/session";
import { templateFor } from "@/lib/templates";
import { logoutAction } from "../../actions";
import { EditorHost } from "./host";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "แก้ไขเว็บ" };

export default async function ClinicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const clinic = await getClinicFor(user, id).catch(() => null);
  const template = clinic && templateFor(clinic);
  if (!clinic || !template) notFound();

  const content = await getContent(clinic.id, template.defaults);
  const showBack = user.role === "staff" || (await listClinics(user)).length > 1;
  const { Editor } = template;

  return (
    <EditorHost
      clinicId={clinic.id}
      previewHref={clinic.site_url}
      packageName={clinic.package}
      allowedSections={allowedKeys(clinic)}
      topActions={
        <>
          {showBack && (
            <a href="/" className="adm-btn adm-btn-ghost">← คลินิกทั้งหมด</a>
          )}
          <a href="/account/password" className="adm-btn adm-btn-ghost">เปลี่ยนรหัสผ่าน</a>
          <form action={logoutAction} className="ca-inline">
            <button type="submit" className="adm-btn adm-btn-ghost">ออกจากระบบ</button>
          </form>
        </>
      }
    >
      <Editor initial={content} defaults={template.defaults} />
    </EditorHost>
  );
}
