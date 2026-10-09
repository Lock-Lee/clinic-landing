import type { Metadata } from "next";
import { getContent } from "@repo/db";
import { AdminFab } from "@repo/ui/admin";
import { DemoBar, SiteHeader, SiteFooter, RouteMotion, LineFloat } from "@repo/ui/site";
import { SITE_ID, editableDefaults, groups } from "../content";

// อ่านเนื้อหาจากฐานข้อมูลทุกครั้ง แก้จากหลังบ้านแล้วเห็นผลทันที
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { clinic } = await getContent(SITE_ID, editableDefaults);
  return { title: { default: `${clinic.name} | ${clinic.tagline}`, template: `%s | ${clinic.name}` } };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { clinic, nav, services } = await getContent(SITE_ID, editableDefaults);
  return (
    <>
      <RouteMotion />
      <DemoBar />
      <SiteHeader
        brand={clinic.name}
        sub={clinic.tagline}
        nav={nav}
        langs={["TH", "EN", "中文"]}
        cta={{ href: "/contact", label: "จองปรึกษาฟรี" }}
      />
      {children}
      <SiteFooter
        brand={clinic.name}
        about={`${clinic.address} · ${clinic.hours}`}
        columns={[
          ...groups.map((g) => ({
            title: g.name as string,
            links: services.filter((s) => s.group === g.id).map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
          })),
          { title: "คลินิก", links: [...nav.slice(1).map(({ href, label }) => ({ href, label })), { href: "/contact", label: "ติดต่อเรา" }] },
        ]}
        note={`${clinic.license} · ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล · เว็บไซต์ตัวอย่าง ข้อมูลทั้งหมดเป็นข้อมูลสมมติ`}
      />
      {/* LINE อยู่มุมขวา ปุ่มหลังบ้านอยู่มุมซ้าย ไม่ทับกัน */}
      <LineFloat href={clinic.lineUrl} />
      <AdminFab />
    </>
  );
}
