import type { Metadata } from "next";
import { Noto_Serif_Thai, IBM_Plex_Sans_Thai } from "next/font/google";
import { clinic } from "./content";
import "./globals.css";

const display = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const title = `${clinic.name} | ${clinic.tagline}`;
const description = "รักษาสิว กดสิว เลเซอร์รอยสิว และทรีตเมนต์หน้าใส ตรวจโดยแพทย์ จองคิวผ่าน LINE";

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "th_TH", url: "/", siteName: clinic.name, title, description },
  // เว็บเดโม ไม่ให้ search engine เก็บ
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
