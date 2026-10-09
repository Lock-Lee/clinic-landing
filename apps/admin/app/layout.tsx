import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";

const body = IBM_Plex_Sans_Thai({ subsets: ["thai", "latin"], weight: ["400", "600"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "หลังบ้านคลินิก", template: "%s | หลังบ้านคลินิก" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={body.variable}>
      <body>{children}</body>
    </html>
  );
}
