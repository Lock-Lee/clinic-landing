import type { Metadata } from "next";
import { Anuphan, IBM_Plex_Sans_Thai, Instrument_Serif } from "next/font/google";
import { site, seo } from "./content";
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

const { title, description } = seo;
const ogImage = { url: "/brand/og.png", width: 1200, height: 630, alt: "HamCache รับทำเว็บไซต์ Landing Page และแอปมือถือ" };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  keywords: seo.keywords,
  applicationName: site.brand,
  authors: [{ name: site.brand, url: site.url }],
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: site.brand,
    title,
    description,
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  verification: {
    ...(site.verification.google ? { google: site.verification.google } : {}),
    ...(site.verification.bing ? { other: { "msvalidate.01": site.verification.bing } } : {}),
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
};

// ชุดสีที่ผู้ชมเลือกไว้ (components/theme-switcher.tsx) ตั้งก่อนวาดหน้า ไม่ให้สีกระพริบ
const THEMES = ["hamcache", "purple", "green", "red", "blue"];
const APPLY_THEME = `try{var t=localStorage.getItem("hc-theme");if(${JSON.stringify(THEMES)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

const SKIP_PRELOADER = `try{var q=location.search,s=/[?&](utm_|gclid|fbclid|ttclid)/.test(q)||location.hash.length>1||localStorage.getItem("seen-intro");localStorage.setItem("seen-intro","1");if(s)document.documentElement.classList.add("no-intro")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${display.variable} ${body.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* หน้าจอโหลดแสดงเฉพาะครั้งแรก ไม่แสดงกับคนที่มาจากโฆษณาหรือลิงก์ที่ชี้ไปส่วนใดส่วนหนึ่งของหน้า ตัดสินก่อนวาดหน้าแรก */}
        <script dangerouslySetInnerHTML={{ __html: SKIP_PRELOADER }} />
        <script dangerouslySetInnerHTML={{ __html: APPLY_THEME }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
