import type { Metadata } from "next";
import { Trirong, Sarabun } from "next/font/google";
import { DemoBar, SiteHeader, SiteFooter, RouteMotion, LineFloat } from "@repo/ui/site";
import { clinic, nav, groups, services } from "./content";
import "@repo/ui/motion.css";
import "@repo/ui/site.css";
import "./globals.css";

const display = Trirong({ subsets: ["thai", "latin"], weight: ["500", "600"], variable: "--font-display", display: "swap" });
const body = Sarabun({ subsets: ["thai", "latin"], weight: ["400", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title: { default: `${clinic.name} | ${clinic.tagline}`, template: `%s | ${clinic.name}` },
  description: "ศัลยกรรมจมูก ตา ดึงหน้า และหัตถการผิว เช่น ร้อยไหม โบทูลินัม ฟิลเลอร์ โดยทีมแพทย์เฉพาะทาง ปรึกษาฟรี",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>
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
            { title: "คลินิก", links: [...nav.slice(1), { href: "/contact", label: "ติดต่อเรา" }] },
          ]}
          note={`${clinic.license} · ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล · เว็บไซต์ตัวอย่าง ข้อมูลทั้งหมดเป็นข้อมูลสมมติ`}
        />
        <LineFloat href={clinic.lineUrl} />
      </body>
    </html>
  );
}
