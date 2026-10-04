import type { Metadata } from "next";
import { Anuphan, IBM_Plex_Sans_Thai } from "next/font/google";
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

export const metadata: Metadata = {
  title: "รับทำ Landing Page คลินิกความงาม | เริ่มต้น 9,900 บาท",
  description:
    "รับออกแบบเว็บไซต์และ Landing Page สำหรับคลินิกเสริมความงาม 3 แพ็กเกจ พร้อมบริการโดเมน โฮสติ้ง และดูแลเว็บรายเดือน",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
