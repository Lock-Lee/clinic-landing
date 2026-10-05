import type { Metadata } from "next";
import { Kanit, IBM_Plex_Sans_Thai } from "next/font/google";
import { DemoBar, SiteHeader, SiteFooter, RouteMotion, LineFloat } from "@repo/ui/site";
import { studio, nav, services } from "./content";
import "@repo/ui/motion.css";
import "./globals.css";

const display = Kanit({ subsets: ["thai", "latin"], weight: ["500", "600"], variable: "--font-display", display: "swap" });
const body = IBM_Plex_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(studio.url),
  title: { default: `${studio.name} | ${studio.tagline}`, template: `%s | ${studio.name}` },
  description: studio.about,
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>
        <RouteMotion />
        <DemoBar />
        <SiteHeader brand={studio.name} sub={studio.tagline} nav={nav} cta={{ href: "/contact", label: "คุยโปรเจกต์" }} />
        {children}
        <SiteFooter
          brand={studio.name}
          about={studio.about}
          columns={[
            { title: "เมนู", links: [...nav, { href: "/contact", label: "ติดต่อ" }] },
            { title: "บริการ", links: services.map((s) => ({ href: `/services#${s.slug}`, label: s.name })) },
            { title: "ติดต่อ", links: [{ href: `mailto:${studio.email}`, label: studio.email }, { href: "/contact", label: studio.phone }] },
          ]}
          note={`© ${studio.name} · เว็บไซต์ตัวอย่าง ข้อมูลทั้งหมดเป็นข้อมูลสมมติ`}
        />
        <LineFloat href={studio.lineUrl} />
      </body>
    </html>
  );
}
