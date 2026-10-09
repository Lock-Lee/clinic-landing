import type { Metadata } from "next";
import { Trirong, Sarabun } from "next/font/google";
import { clinic } from "./content";
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

// header/footer อยู่ใน (site)/layout.tsx ส่วน /admin ไม่มี
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
