import type { Metadata } from "next";
import { Anuphan, IBM_Plex_Sans_Thai, Instrument_Serif } from "next/font/google";
import { site } from "./content";
import "./globals.css";

const display = Anuphan({
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

// ตัวเอียงแบบ serif สำหรับคำภาษาอังกฤษตกแต่ง (hero, หัวข้อ, แถบตัวอักษรวิ่ง)
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const title = "รับทำเว็บไซต์และ Landing Page คลินิกความงาม | เริ่มต้น 12,000 บาท";
const description =
  "รับออกแบบเว็บไซต์และ Landing Page สำหรับคลินิกเสริมความงาม 3 แพ็กเกจ พร้อม SEO, AEO, ระบบหลังบ้าน โดเมน โฮสติ้ง และดูแลเว็บรายเดือน";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: site.brand,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
