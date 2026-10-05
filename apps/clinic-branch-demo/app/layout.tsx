import type { Metadata } from "next";
import { Mitr, Prompt } from "next/font/google";
import { DemoBar, SiteHeader, SiteFooter, RouteMotion, LineFloat } from "@repo/ui/site";
import { clinic, nav, branches } from "./content";
import "@repo/ui/motion.css";
import "@repo/ui/site.css";
import "./globals.css";

const display = Mitr({ subsets: ["thai", "latin"], weight: ["400", "500"], variable: "--font-display", display: "swap" });
const body = Prompt({ subsets: ["thai", "latin"], weight: ["300", "400", "500"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title: { default: `${clinic.name} | ${clinic.tagline}`, template: `%s | ${clinic.name}` },
  description: "คลินิกความงาม 2 สาขา บางนาและลาดพร้าว IV Drip โบท็อกซ์ สลายไขมัน สกินบูสเตอร์ โดยแพทย์ ราคาคุ้มค่า",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>
        <RouteMotion />
        <DemoBar />
        <SiteHeader brand={clinic.name} sub={clinic.nameTh} nav={nav} cta={{ href: "/contact", label: "จองคิว" }} />
        {children}
        <SiteFooter
          brand={clinic.name}
          about={clinic.tagline}
          columns={[
            { title: "สาขา", links: branches.map((b) => ({ href: "/contact", label: b.name })) },
            { title: "ข้อมูลคลินิก", links: [{ href: "/about", label: "เกี่ยวกับเรา" }, { href: "/policy", label: "นโยบายคลินิก" }, { href: "/contact", label: "ติดต่อเรา" }] },
            { title: "บริการ", links: nav.slice(1, 5) },
          ]}
          note={`${clinic.license} · ผลลัพธ์ขึ้นอยู่กับแต่ละบุคคล · เว็บไซต์ตัวอย่าง ข้อมูลทั้งหมดเป็นข้อมูลสมมติ`}
        />
        <LineFloat href={clinic.lineUrl} />
      </body>
    </html>
  );
}
